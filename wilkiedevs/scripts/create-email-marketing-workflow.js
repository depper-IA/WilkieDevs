#!/usr/bin/env node

/**
 * Workflow N8N para Email Marketing Sequences
 * Tag: WILKIEDEVS
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': N8N_API_KEY
};

async function createEmailMarketingWorkflow() {
  const workflowData = {
    name: '[WILKIEDEVS] Email Marketing Sequences',
    settings: {
      executionOrder: 'v1'
    },
    staticData: {},
    nodes: [
      {
        parameters: {
          path: 'email-sequence-trigger',
          options: {}
        },
        id: 'webhook-email-trigger',
        name: '📧 Email Sequence Trigger',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [240, 300],
        webhookId: 'email-sequence-trigger'
      },
      {
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: '',
              typeValidation: 'strict'
            },
            conditions: [
              {
                id: 'sequence-type-check',
                leftValue: '={{ $json.sequenceType }}',
                rightValue: 'welcome',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ],
            combinator: 'and'
          },
          options: {}
        },
        id: 'check-sequence-type',
        name: '🔍 Tipo de Secuencia',
        type: 'n8n-nodes-base.if',
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          to: '={{ $json.email }}',
          subject: '¡Bienvenido a WilkieDevs! 🚀 Tu viaje digital comienza aquí',
          emailType: 'html',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
              <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #3B82F6; margin: 0;">¡Hola {{ $json.name }}! 👋</h1>
                  <p style="color: #64748b; font-size: 18px; margin: 10px 0;">Bienvenido a la familia WilkieDevs</p>
                </div>
                
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1E293B; margin-top: 0;">🎯 ¿Qué puedes esperar?</h3>
                  <ul style="color: #475569; line-height: 1.6;">
                    <li>Consejos exclusivos sobre desarrollo web</li>
                    <li>Casos de éxito de nuestros clientes</li>
                    <li>Ofertas especiales solo para suscriptores</li>
                    <li>Invitaciones a webinars gratuitos</li>
                  </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://wilkiedevs.com/servicios" style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    🔍 Explorar Servicios
                  </a>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
                  <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                    WilkieDevs - Transformando ideas en soluciones digitales<br>
                    📧 info@wilkie-design.com | 📱 +57 310 665 46 41
                  </p>
                </div>
              </div>
            </div>
          `,
          options: {}
        },
        id: 'send-welcome-email',
        name: '📬 Email 1: Bienvenida',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2.1,
        position: [680, 200]
      },
      {
        parameters: {
          amount: 2,
          unit: 'days'
        },
        id: 'wait-2-days',
        name: '⏰ Esperar 2 días',
        type: 'n8n-nodes-base.wait',
        typeVersion: 1.1,
        position: [900, 200]
      },
      {
        parameters: {
          to: '={{ $json.email }}',
          subject: '🏆 Casos de Éxito: Cómo transformamos negocios digitalmente',
          emailType: 'html',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
              <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #3B82F6; text-align: center;">🏆 Casos de Éxito</h1>
                
                <p>Hola {{ $json.name }},</p>
                <p>Quiero compartir contigo algunos de nuestros casos de éxito más impactantes:</p>
                
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1E293B;">📈 La Montaña Agromercados</h3>
                  <p><strong>Resultado:</strong> 150% aumento en consultas online</p>
                  <p><strong>Solución:</strong> Vitrina virtual con catálogo interactivo</p>
                </div>
                
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1E293B;">🌍 E4U Worldwide Corp</h3>
                  <p><strong>Resultado:</strong> Presencia digital en 3 idiomas</p>
                  <p><strong>Solución:</strong> Sitio corporativo internacional</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://wilkiedevs.com/portfolio" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    📁 Ver Más Casos
                  </a>
                </div>
              </div>
            </div>
          `,
          options: {}
        },
        id: 'send-case-studies',
        name: '📊 Email 2: Casos de Éxito',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2.1,
        position: [1120, 200]
      },
      {
        parameters: {
          amount: 3,
          unit: 'days'
        },
        id: 'wait-3-days',
        name: '⏰ Esperar 3 días',
        type: 'n8n-nodes-base.wait',
        typeVersion: 1.1,
        position: [1340, 200]
      },
      {
        parameters: {
          to: '={{ $json.email }}',
          subject: '🛠️ Nuestro Proceso: De la Idea a la Realidad Digital',
          emailType: 'html',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
              <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #3B82F6; text-align: center;">🛠️ Nuestro Proceso</h1>
                
                <p>Hola {{ $json.name }},</p>
                <p>Te explico cómo trabajamos en WilkieDevs para garantizar el éxito de tu proyecto:</p>
                
                <div style="margin: 30px 0;">
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="background: #3B82F6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">1</div>
                    <div>
                      <h4 style="margin: 0; color: #1E293B;">Análisis y Planificación</h4>
                      <p style="margin: 5px 0; color: #64748b;">Entendemos tu negocio y objetivos</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="background: #10B981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">2</div>
                    <div>
                      <h4 style="margin: 0; color: #1E293B;">Diseño y Prototipado</h4>
                      <p style="margin: 5px 0; color: #64748b;">Creamos mockups y prototipos interactivos</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="background: #F59E0B; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">3</div>
                    <div>
                      <h4 style="margin: 0; color: #1E293B;">Desarrollo y Testing</h4>
                      <p style="margin: 5px 0; color: #64748b;">Programamos y probamos cada funcionalidad</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="background: #8B5CF6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold;">4</div>
                    <div>
                      <h4 style="margin: 0; color: #1E293B;">Lanzamiento y Soporte</h4>
                      <p style="margin: 5px 0; color: #64748b;">Publicamos y brindamos soporte continuo</p>
                    </div>
                  </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://wilkiedevs.com/contacto" style="background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                    💬 Hablemos de tu Proyecto
                  </a>
                </div>
              </div>
            </div>
          `,
          options: {}
        },
        id: 'send-process-email',
        name: '⚙️ Email 3: Proceso',
        type: 'n8n-nodes-base.emailSend',
        typeVersion: 2.1,
        position: [1560, 200]
      }
    ],
    connections: {
      '📧 Email Sequence Trigger': {
        main: [
          [
            {
              node: '🔍 Tipo de Secuencia',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '🔍 Tipo de Secuencia': {
        main: [
          [
            {
              node: '📬 Email 1: Bienvenida',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '📬 Email 1: Bienvenida': {
        main: [
          [
            {
              node: '⏰ Esperar 2 días',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '⏰ Esperar 2 días': {
        main: [
          [
            {
              node: '📊 Email 2: Casos de Éxito',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '📊 Email 2: Casos de Éxito': {
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
              node: '⚙️ Email 3: Proceso',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    }
  };

  try {
    console.log('📧 Creando workflow de Email Marketing...');
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workflowData)
    });

    if (response.ok) {
      const result = await response.json();
      const workflowId = result.data?.id || result.id;
      console.log('✅ Workflow Email Marketing creado:', workflowId);
      
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
  console.log('🚀 Configurando Email Marketing Sequences...');
  const workflowId = await createEmailMarketingWorkflow();
  
  if (workflowId) {
    console.log('');
    console.log('🎉 ¡Email Marketing configurado!');
    console.log(`🆔 ID: ${workflowId}`);
    console.log('🔗 Webhook: https://n8n.wilkiedevs.com/webhook/email-sequence-trigger');
    console.log('');
    console.log('📝 Ejemplo de uso:');
    console.log('curl -X POST https://n8n.wilkiedevs.com/webhook/email-sequence-trigger \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"name":"Juan Pérez","email":"juan@example.com","sequenceType":"welcome"}\'');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };