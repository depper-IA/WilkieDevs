#!/usr/bin/env node

/**
 * Workflow N8N para Quote Generation & Follow-up
 * Tag: WILKIEDEVS
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': N8N_API_KEY
};

async function createQuoteWorkflow() {
  const workflowData = {
    name: '[WILKIEDEVS] Quote Generation & Follow-up',
    settings: {
      executionOrder: 'v1'
    },
    staticData: {},
    nodes: [
      {
        parameters: {
          path: 'quote-request',
          options: {}
        },
        id: 'webhook-quote-request',
        name: '💰 Quote Request',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [240, 300],
        webhookId: 'quote-request'
      },
      {
        parameters: {
          assignments: {
            assignments: [
              {
                id: 'calculate-cost',
                name: 'estimatedCost',
                value: '={{ $json.projectType === "landing-page" ? 2000 : $json.projectType === "corporate" ? 4000 : $json.projectType === "ecommerce" ? 6000 : $json.projectType === "custom-app" ? 10000 : 3000 }}',
                type: 'number'
              },
              {
                id: 'calculate-timeline',
                name: 'estimatedTimeline',
                value: '={{ $json.projectType === "landing-page" ? "2-3 semanas" : $json.projectType === "corporate" ? "4-6 semanas" : $json.projectType === "ecommerce" ? "6-8 semanas" : $json.projectType === "custom-app" ? "8-12 semanas" : "4-6 semanas" }}',
                type: 'string'
              },
              {
                id: 'quote-id',
                name: 'quoteId',
                value: '={{ "WD-" + $now().toISOString().split("T")[0].replace(/-/g, "") + "-" + Math.random().toString(36).substr(2, 6).toUpperCase() }}',
                type: 'string'
              },
              {
                id: 'valid-until',
                name: 'validUntil',
                value: '={{ new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES") }}',
                type: 'string'
              }
            ]
          },
          options: {}
        },
        id: 'calculate-quote',
        name: '🧮 Calcular Cotización',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.3,
        position: [460, 300]
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://ziglshuhhtsthwedrους.supabase.co/rest/v1/wilkiedevs_quotes',
          authentication: 'genericCredentialType',
          genericAuthType: 'httpHeaderAuth',
          httpHeaderAuth: {
            name: 'Authorization',
            value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NzM5NywiZXhwIjoyMDczNTIzMzk3fQ.SERVICE_ROLE_KEY'
          },
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'apikey',
                value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08'
              },
              {
                name: 'Content-Type',
                value: 'application/json'
              }
            ]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: 'quote_id',
                value: '={{ $json.quoteId }}'
              },
              {
                name: 'client_name',
                value: '={{ $json.name }}'
              },
              {
                name: 'client_email',
                value: '={{ $json.email }}'
              },
              {
                name: 'project_type',
                value: '={{ $json.projectType }}'
              },
              {
                name: 'estimated_cost',
                value: '={{ $json.estimatedCost }}'
              },
              {
                name: 'timeline',
                value: '={{ $json.estimatedTimeline }}'
              },
              {
                name: 'requirements',
                value: '={{ $json.requirements }}'
              },
              {
                name: 'status',
                value: 'sent'
              },
              {
                name: 'valid_until',
                value: '={{ $json.validUntil }}'
              }
            ]
          },
          options: {}
        },
        id: 'save-quote',
        name: '💾 Guardar Cotización',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [680, 300]
      },
      {
        parameters: {
          to: '={{ $json.email }}',
          subject: 'Tu Cotización Personalizada - WilkieDevs',
          emailType: 'text',
          message: 'Hola! Tu cotización personalizada está lista. Te contactaremos pronto con todos los detalles. Gracias por confiar en WilkieDevs.',
          options: {}
        },
        id: 'send-quote-email',
        name: '📧 Enviar Cotización',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2.1,
        position: [900, 300]
      },
      {
        parameters: {
          amount: 3,
          unit: 'days'
        },
        id: 'wait-followup',
        name: '⏰ Esperar 3 días',
        type: 'n8n-nodes-base.wait',
        typeVersion: 1.1,
        position: [1120, 300]
      },
      {
        parameters: {
          to: '={{ $json.email }}',
          subject: '¿Tienes preguntas sobre tu cotización?',
          emailType: 'text',
          message: 'Hola! Hace unos días te enviamos tu cotización personalizada. ¿Tienes alguna pregunta? Estamos aquí para ayudarte. Llámanos al +57 310 665 46 41 o responde este email.',
          options: {}
        },
        id: 'send-followup',
        name: '📞 Follow-up Email',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2.1,
        position: [1340, 300]
      }
    ],
    connections: {
      '💰 Quote Request': {
        main: [
          [
            {
              node: '🧮 Calcular Cotización',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '🧮 Calcular Cotización': {
        main: [
          [
            {
              node: '💾 Guardar Cotización',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '💾 Guardar Cotización': {
        main: [
          [
            {
              node: '📧 Enviar Cotización',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '📧 Enviar Cotización': {
        main: [
          [
            {
              node: '⏰ Esperar 3 días',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '⏰ Esperar 3 días': {
        main: [
          [
            {
              node: '📞 Follow-up Email',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    }
  };

  try {
    console.log('💰 Creando workflow de Cotizaciones...');
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workflowData)
    });

    if (response.ok) {
      const result = await response.json();
      const workflowId = result.data?.id || result.id;
      console.log('✅ Workflow Cotizaciones creado:', workflowId);
      
      // Activar workflow
      const activateResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
        method: 'POST',
        headers
      });

      if (activateResponse.ok) {
        console.log('✅ Workflow activado exitosamente');
        return workflowId;
      }
    } else {
      const error = await response.text();
      console.error('❌ Error:', error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
  return null;
}

async function main() {
  console.log('🚀 Configurando Quote Generation & Follow-up...');
  const workflowId = await createQuoteWorkflow();
  
  if (workflowId) {
    console.log('');
    console.log('🎉 ¡Sistema de Cotizaciones configurado!');
    console.log(`🆔 ID: ${workflowId}`);
    console.log('🔗 Webhook: https://n8n.wilkiedevs.com/webhook/quote-request');
    console.log('');
    console.log('📝 Ejemplo de uso:');
    console.log('curl -X POST https://n8n.wilkiedevs.com/webhook/quote-request \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"name":"Juan Pérez","email":"juan@example.com","projectType":"ecommerce","requirements":"Tienda online con 100 productos"}\'');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };