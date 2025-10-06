import { NextRequest, NextResponse } from 'next/server';
import { supabase, n8n } from '@/lib/integrations';
import { workflowManager } from '@/lib/n8n-workflows';
import type { WilkieDevsLead } from '@/lib/integrations';

// Rate limiting simple (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Función para calcular lead scoring avanzado
function calculateLeadScore(lead: Partial<WilkieDevsLead>): number {
  let score = 0;
  
  // Email válido (obligatorio)
  if (lead.email && lead.email.includes('@')) {
    score += 20;
    // Bonus por dominios empresariales
    if (!lead.email.includes('gmail.com') && !lead.email.includes('hotmail.com') && !lead.email.includes('yahoo.com')) {
      score += 10;
    }
  }
  
  // Teléfono proporcionado
  if (lead.phone) score += 15;
  
  // Empresa proporcionada
  if (lead.company) {
    score += 15;
    // Bonus por empresas grandes (más de 10 caracteres)
    if (lead.company.length > 10) score += 5;
  }
  
  // Interés específico en servicios
  if (lead.service_interest) {
    score += 20;
    const interest = lead.service_interest.toLowerCase();
    
    // Servicios de alto valor
    if (interest.includes('automatización') || interest.includes('automation')) score += 20;
    if (interest.includes('desarrollo') || interest.includes('development')) score += 15;
    if (interest.includes('ecommerce') || interest.includes('tienda')) score += 15;
    if (interest.includes('custom') || interest.includes('personalizado')) score += 10;
    if (interest.includes('landing') || interest.includes('página')) score += 5;
  }
  
  // Fuente de calidad
  const sourceScores: Record<string, number> = {
    'referral': 25,
    'chatbot': 15,
    'contact-form': 10,
    'website': 5,
    'social-media': 8,
    'google-ads': 12
  };
  score += sourceScores[lead.source || 'website'] || 5;
  
  return Math.min(score, 100); // Máximo 100 puntos
}

// Validación avanzada de datos
function validateLeadData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validaciones obligatorias
  if (!data.name || data.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }
  
  if (!data.email) {
    errors.push('El email es obligatorio');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Formato de email inválido');
    }
  }
  
  // Validaciones opcionales
  if (data.phone && data.phone.length < 8) {
    errors.push('El teléfono debe tener al menos 8 dígitos');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('El nombre no puede exceder 100 caracteres');
  }
  
  if (data.company && data.company.length > 100) {
    errors.push('El nombre de la empresa no puede exceder 100 caracteres');
  }
  
  // Validar caracteres especiales maliciosos
  const maliciousPatterns = [/<script/i, /javascript:/i, /on\w+=/i];
  const textFields = [data.name, data.company, data.service_interest];
  
  for (const field of textFields) {
    if (field && maliciousPatterns.some(pattern => pattern.test(field))) {
      errors.push('Contenido no permitido detectado');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Función para detectar leads duplicados
async function checkDuplicateLead(email: string): Promise<WilkieDevsLead | null> {
  try {
    const existingLeads = await supabase.select<WilkieDevsLead>('wilkiedevs_leads', `email=eq.${email}`);
    return existingLeads && existingLeads.length > 0 ? existingLeads[0] : null;
  } catch (error) {
    console.error('Error checking duplicate lead:', error);
    return null;
  }
}

// GET - Listar leads (para dashboard interno)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Máximo 100
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Construir query
    let query = '';
    const conditions: string[] = [];
    
    if (status) conditions.push(`status=eq.${status}`);
    if (source) conditions.push(`source=eq.${source}`);
    
    if (conditions.length > 0) {
      query = conditions.join('&');
    }
    
    const leads = await supabase.select<WilkieDevsLead>('wilkiedevs_leads', query);
    
    if (leads) {
      // Ordenar resultados
      const sortedLeads = leads.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        if (sortOrder === 'desc') {
          return aValue > bValue ? -1 : 1;
        }
        return aValue < bValue ? -1 : 1;
      });
      
      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLeads = sortedLeads.slice(startIndex, endIndex);
      
      // Estadísticas adicionales
      const stats = {
        total: leads.length,
        byStatus: leads.reduce((acc, lead) => {
          acc[lead.status || 'unknown'] = (acc[lead.status || 'unknown'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bySource: leads.reduce((acc, lead) => {
          acc[lead.source || 'unknown'] = (acc[lead.source || 'unknown'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        averageScore: leads.reduce((sum, lead) => sum + ((lead as any).score || 0), 0) / leads.length
      };
      
      return NextResponse.json({
        success: true,
        data: paginatedLeads,
        pagination: {
          page,
          limit,
          total: leads.length,
          pages: Math.ceil(leads.length / limit)
        },
        stats
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error obteniendo leads'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error interno',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Crear nuevo lead
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip, 5, 60000)) { // 5 requests per minute
      return NextResponse.json({
        success: false,
        message: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.',
        code: 'RATE_LIMIT_EXCEEDED'
      }, { status: 429 });
    }

    const body = await request.json();
    
    // Validación avanzada
    const validation = validateLeadData(body);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Datos inválidos',
        errors: validation.errors
      }, { status: 400 });
    }
    
    // Verificar lead duplicado
    const existingLead = await checkDuplicateLead(body.email.toLowerCase().trim());
    if (existingLead) {
      // Actualizar lead existente en lugar de crear duplicado
      const updatedData = {
        name: body.name.trim(),
        phone: body.phone?.trim() || existingLead.phone,
        company: body.company?.trim() || existingLead.company,
        service_interest: body.service_interest?.trim() || existingLead.service_interest,
        source: body.source || existingLead.source,
        status: existingLead.status === 'lost' ? 'new' : existingLead.status // Reactivar si estaba perdido
      };
      
      const score = calculateLeadScore(updatedData);
      (updatedData as any).score = score;
      
      const updatedLead = await supabase.update('wilkiedevs_leads', existingLead.id!, updatedData);
      
      if (updatedLead) {
        // Disparar workflow de lead actualizado
        await workflowManager.triggerLeadCapture({
          ...updatedData,
          email: existingLead.email,
          source: 'updated_lead'
        });
        
        return NextResponse.json({
          success: true,
          message: 'Lead actualizado exitosamente',
          data: updatedLead,
          score,
          isUpdate: true
        }, { status: 200 });
      }
    }
    
    // Preparar datos del nuevo lead
    const leadData: Partial<WilkieDevsLead> = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone?.trim(),
      company: body.company?.trim(),
      service_interest: body.service_interest?.trim(),
      source: body.source || 'website',
      status: 'new'
    };
    
    // Calcular score del lead
    const score = calculateLeadScore(leadData);
    (leadData as any).score = score;
    
    // Insertar en Supabase
    const newLead = await supabase.insert('wilkiedevs_leads', leadData);
    
    if (newLead) {
      // Disparar workflow de N8N para automatizaciones
      try {
        await workflowManager.triggerLeadCapture({
          name: leadData.name!,
          email: leadData.email!,
          phone: leadData.phone,
          company: leadData.company,
          projectType: leadData.service_interest,
          source: leadData.source!
        });
      } catch (n8nError) {
        console.error('Error disparando workflow N8N:', n8nError);
        // No fallar la creación del lead por error de N8N
      }
      
      return NextResponse.json({
        success: true,
        message: 'Lead creado exitosamente',
        data: newLead,
        score,
        isUpdate: false
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error creando lead en la base de datos'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error en POST /api/leads:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
}

// PUT - Actualizar lead existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID del lead es requerido'
      }, { status: 400 });
    }
    
    // Validar datos de actualización
    const validation = validateLeadData({ ...updateData, email: 'temp@example.com' }); // Email temporal para validación
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Datos inválidos',
        errors: validation.errors.filter(error => !error.includes('email')) // Filtrar errores de email
      }, { status: 400 });
    }
    
    // Limpiar y preparar datos
    const cleanUpdateData: any = {};
    if (updateData.name) cleanUpdateData.name = updateData.name.trim();
    if (updateData.phone) cleanUpdateData.phone = updateData.phone.trim();
    if (updateData.company) cleanUpdateData.company = updateData.company.trim();
    if (updateData.service_interest) cleanUpdateData.service_interest = updateData.service_interest.trim();
    if (updateData.status) cleanUpdateData.status = updateData.status;
    if (updateData.source) cleanUpdateData.source = updateData.source;
    
    // Recalcular score si se actualizan datos relevantes
    if (cleanUpdateData.service_interest || cleanUpdateData.phone || cleanUpdateData.company) {
      cleanUpdateData.score = calculateLeadScore(cleanUpdateData);
    }
    
    const updatedLead = await supabase.update('wilkiedevs_leads', id, cleanUpdateData);
    
    if (updatedLead) {
      // Disparar workflow si hay cambio de estado importante
      if (cleanUpdateData.status && ['qualified', 'converted'].includes(cleanUpdateData.status)) {
        try {
          await workflowManager.triggerLeadCapture({
            name: updatedLead.name,
            email: updatedLead.email,
            phone: updatedLead.phone,
            company: updatedLead.company,
            projectType: updatedLead.service_interest,
            source: 'status_update'
          });
        } catch (n8nError) {
          console.error('Error disparando workflow de actualización:', n8nError);
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Lead actualizado exitosamente',
        data: updatedLead
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Lead no encontrado o error actualizando'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error en PUT /api/leads:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
}

// DELETE - Eliminar lead (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID del lead es requerido'
      }, { status: 400 });
    }
    
    // Soft delete - cambiar status a 'deleted'
    const deletedLead = await supabase.update('wilkiedevs_leads', id, { 
      status: 'deleted',
      deleted_at: new Date().toISOString()
    });
    
    if (deletedLead) {
      return NextResponse.json({
        success: true,
        message: 'Lead eliminado exitosamente'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Lead no encontrado'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error en DELETE /api/leads:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
}