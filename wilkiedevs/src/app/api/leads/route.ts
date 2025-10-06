import { NextRequest, NextResponse } from 'next/server';
import { supabase, n8n } from '@/lib/integrations';
import type { WilkieDevsLead } from '@/lib/integrations';

// Función para calcular lead scoring básico
function calculateLeadScore(lead: Partial<WilkieDevsLead>): number {
  let score = 0;
  
  // Email válido
  if (lead.email && lead.email.includes('@')) score += 20;
  
  // Teléfono proporcionado
  if (lead.phone) score += 15;
  
  // Empresa proporcionada
  if (lead.company) score += 10;
  
  // Interés específico en servicios
  if (lead.service_interest) {
    score += 25;
    // Bonus por servicios de alto valor
    if (lead.service_interest.toLowerCase().includes('automatización')) score += 15;
    if (lead.service_interest.toLowerCase().includes('desarrollo')) score += 10;
  }
  
  // Fuente de calidad
  if (lead.source === 'chatbot') score += 10;
  if (lead.source === 'referral') score += 20;
  
  return Math.min(score, 100); // Máximo 100 puntos
}

// GET - Listar leads (para dashboard interno)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let query = '';
    if (status) {
      query = `status=eq.${status}`;
    }
    
    const leads = await supabase.select<WilkieDevsLead>('wilkiedevs_leads', query);
    
    if (leads) {
      return NextResponse.json({
        success: true,
        data: leads.slice(0, limit),
        count: leads.length
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
    const body = await request.json();
    
    // Validación básica
    if (!body.name || !body.email) {
      return NextResponse.json({
        success: false,
        message: 'Nombre y email son requeridos'
      }, { status: 400 });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({
        success: false,
        message: 'Formato de email inválido'
      }, { status: 400 });
    }
    
    // Preparar datos del lead
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
      // Enviar a N8N para automatizaciones
      try {
        await n8n.sendWebhook(`${process.env.N8N_API_URL}/webhook/new-lead`, {
          lead: newLead,
          score,
          timestamp: new Date().toISOString()
        });
      } catch (n8nError) {
        console.error('Error enviando a N8N:', n8nError);
        // No fallar la creación del lead por error de N8N
      }
      
      return NextResponse.json({
        success: true,
        message: 'Lead creado exitosamente',
        data: newLead,
        score
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error creando lead'
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
    
    // Recalcular score si se actualizan datos relevantes
    if (updateData.service_interest || updateData.phone || updateData.company) {
      updateData.score = calculateLeadScore(updateData);
    }
    
    const updatedLead = await supabase.update('wilkiedevs_leads', id, updateData);
    
    if (updatedLead) {
      return NextResponse.json({
        success: true,
        message: 'Lead actualizado exitosamente',
        data: updatedLead
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error actualizando lead'
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