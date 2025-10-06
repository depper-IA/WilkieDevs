import { NextRequest, NextResponse } from 'next/server';

// Test endpoints para probar workflows de n8n
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow, data } = body;

    const workflows = {
      'lead-capture': 'https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture',
      'quote-request': 'https://n8n.wilkiedevs.com/webhook/quote-request',
      'email-sequence': 'https://n8n.wilkiedevs.com/webhook/email-sequence-trigger',
      'image-generation': 'https://n8n.wilkiedevs.com/webhook/generate-image'
    };

    const webhookUrl = workflows[workflow as keyof typeof workflows];
    
    if (!webhookUrl) {
      return NextResponse.json({
        success: false,
        message: 'Workflow no encontrado',
        availableWorkflows: Object.keys(workflows)
      }, { status: 400 });
    }

    console.log(`Testing workflow: ${workflow}`);
    console.log(`Webhook URL: ${webhookUrl}`);
    console.log(`Data:`, data);

    // Probar el webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseText = await response.text();
    let responseData;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      workflow,
      webhookUrl,
      response: responseData,
      message: response.ok ? 'Workflow ejecutado exitosamente' : 'Error en el workflow'
    });

  } catch (error) {
    console.error('Error testing workflow:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET para listar workflows disponibles
export async function GET() {
  return NextResponse.json({
    success: true,
    workflows: {
      'lead-capture': {
        name: 'Lead Capture',
        webhook: 'https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture',
        description: 'Captura y procesa leads del chatbot',
        sampleData: {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+57 300 123 4567',
          company: 'Test Company',
          projectType: 'automation',
          message: 'Interesado en automatización',
          intent: 'general'
        }
      },
      'quote-request': {
        name: 'Quote Request',
        webhook: 'https://n8n.wilkiedevs.com/webhook/quote-request',
        description: 'Genera cotizaciones automáticas',
        sampleData: {
          name: 'María González',
          email: 'maria@example.com',
          projectType: 'ecommerce',
          requirements: 'Tienda online con 100 productos'
        }
      },
      'email-sequence': {
        name: 'Email Marketing',
        webhook: 'https://n8n.wilkiedevs.com/webhook/email-sequence-trigger',
        description: 'Activa secuencias de email marketing',
        sampleData: {
          name: 'Carlos Rodríguez',
          email: 'carlos@example.com',
          sequenceType: 'welcome'
        }
      },
      'image-generation': {
        name: 'Image Generation',
        webhook: 'https://n8n.wilkiedevs.com/webhook/generate-image',
        description: 'Genera imágenes con IA',
        sampleData: {
          title: 'Blog Post Image',
          description: 'Modern web development',
          type: 'blog',
          size: '1024x1024'
        }
      }
    }
  });
}