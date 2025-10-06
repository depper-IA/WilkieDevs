import { NextResponse } from 'next/server';
import { n8n } from '@/lib/integrations';

export async function GET() {
  try {
    // Probar conexión con N8N listando workflows
    const response = await fetch(`${process.env.N8N_API_URL}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY!,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const workflows = await response.json();
      return NextResponse.json({
        success: true,
        message: 'Conexión con N8N exitosa',
        workflowCount: workflows.data?.length || 0,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Error de conexión N8N: ${response.status}`,
        status: response.status
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error interno N8N',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { webhookUrl, data } = await request.json();
    
    if (!webhookUrl) {
      return NextResponse.json({
        success: false,
        message: 'webhookUrl es requerido'
      }, { status: 400 });
    }

    // Enviar datos a webhook N8N
    const result = await n8n.sendWebhook(webhookUrl, data || {
      test: true,
      source: 'wilkiedevs-api',
      timestamp: new Date().toISOString()
    });

    if (result !== null) {
      return NextResponse.json({
        success: true,
        message: 'Webhook enviado exitosamente',
        result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error enviando webhook'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error interno webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}