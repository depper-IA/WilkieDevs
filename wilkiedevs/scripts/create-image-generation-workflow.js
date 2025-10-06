#!/usr/bin/env node

/**
 * Workflow N8N para generación automática de imágenes
 * Para blog, servicios y proyectos de WilkieDevs
 */

// Configuración de N8N
const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': N8N_API_KEY
};

async function createImageGenerationWorkflow() {
  const workflowData = {
    name: '[WILKIEDEVS] AI Image Generator - Blog & Services',
    settings: {
      executionOrder: 'v1'
    },
    staticData: {},
    nodes: [
      {
        parameters: {
          path: 'generate-image',
          options: {}
        },
        id: 'webhook-image-request',
        name: '🎨 Image Request Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1,
        position: [240, 300],
        webhookId: 'generate-image'
      },
      {
        parameters: {
          assignments: {
            assignments: [
              {
                id: 'image-prompt',
                name: 'enhancedPrompt',
                value: '={{ "Professional, modern, clean design for " + $json.type + ": " + $json.description + ". Style: corporate, technology, blue and orange color scheme, high quality, 4K, professional photography style, WilkieDevs branding" }}',
                type: 'string'
              },
              {
                id: 'image-size',
                name: 'imageSize',
                value: '={{ $json.size || "1024x1024" }}',
                type: 'string'
              },
              {
                id: 'image-style',
                name: 'imageStyle',
                value: '={{ $json.style || "corporate" }}',
                type: 'string'
              }
            ]
          },
          options: {}
        },
        id: 'prepare-prompt',
        name: '📝 Preparar Prompt',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.3,
        position: [460, 300]
      },
      {
        parameters: {
          resource: 'image',
          operation: 'generate',
          model: 'dall-e-3',
          prompt: '={{ $json.enhancedPrompt }}',
          size: '1024x1024',
          quality: 'hd',
          style: 'natural',
          responseFormat: 'url'
        },
        id: 'generate-with-dalle',
        name: '🤖 DALL-E 3 Generator',
        type: 'n8n-nodes-base.openAi',
        typeVersion: 1.3,
        position: [680, 300],
        credentials: {
          openAiApi: {
            id: 'openai-wilkiedevs',
            name: 'OpenAI WilkieDevs'
          }
        }
      },
      {
        parameters: {
          url: '={{ $json.data[0].url }}',
          options: {}
        },
        id: 'download-image',
        name: '⬇️ Descargar Imagen',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [900, 300]
      },
      {
        parameters: {
          bucketName: 'wilkiedevs-images',
          fileName: '={{ $json.type }}/{{ $now().toISOString().split("T")[0] }}/{{ $json.title.toLowerCase().replace(/[^a-z0-9]/g, "-") }}.png',
          binaryData: true,
          options: {}
        },
        id: 'upload-to-supabase',
        name: '☁️ Subir a Supabase',
        type: 'n8n-nodes-base.supabase',
        typeVersion: 1,
        position: [1120, 300],
        credentials: {
          supabaseApi: {
            id: 'supabase-wilkiedevs',
            name: 'Supabase WilkieDevs'
          }
        }
      },
      {
        parameters: {
          method: 'POST',
          url: 'https://ziglshuhhtsthwedrους.supabase.co/rest/v1/wilkiedevs_images',
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
                name: 'title',
                value: '={{ $json.title }}'
              },
              {
                name: 'description',
                value: '={{ $json.description }}'
              },
              {
                name: 'type',
                value: '={{ $json.type }}'
              },
              {
                name: 'url',
                value: '={{ $json.publicUrl }}'
              },
              {
                name: 'prompt',
                value: '={{ $json.enhancedPrompt }}'
              },
              {
                name: 'size',
                value: '={{ $json.imageSize }}'
              },
              {
                name: 'style',
                value: '={{ $json.imageStyle }}'
              },
              {
                name: 'status',
                value: 'generated'
              }
            ]
          },
          options: {}
        },
        id: 'save-metadata',
        name: '💾 Guardar Metadata',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: [1340, 300]
      },
      {
        parameters: {
          respondWith: 'json',
          responseBody: {
            success: true,
            data: {
              imageUrl: '={{ $json.publicUrl }}',
              title: '={{ $json.title }}',
              description: '={{ $json.description }}',
              type: '={{ $json.type }}',
              prompt: '={{ $json.enhancedPrompt }}',
              generatedAt: '={{ $now() }}'
            }
          },
          options: {}
        },
        id: 'return-result',
        name: '📤 Retornar Resultado',
        type: 'n8n-nodes-base.respondToWebhook',
        typeVersion: 1.1,
        position: [1560, 300]
      }
    ],
    connections: {
      '🎨 Image Request Webhook': {
        main: [
          [
            {
              node: '📝 Preparar Prompt',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '📝 Preparar Prompt': {
        main: [
          [
            {
              node: '🤖 DALL-E 3 Generator',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '🤖 DALL-E 3 Generator': {
        main: [
          [
            {
              node: '⬇️ Descargar Imagen',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '⬇️ Descargar Imagen': {
        main: [
          [
            {
              node: '☁️ Subir a Supabase',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '☁️ Subir a Supabase': {
        main: [
          [
            {
              node: '💾 Guardar Metadata',
              type: 'main',
              index: 0
            }
          ]
        ]
      },
      '💾 Guardar Metadata': {
        main: [
          [
            {
              node: '📤 Retornar Resultado',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    }
  };

  try {
    console.log('🎨 Creando workflow de generación de imágenes...');
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: 'POST',
      headers,
      body: JSON.stringify(workflowData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Workflow de imágenes creado exitosamente');
      const workflowId = result.data?.id || result.id;
      console.log('🆔 Workflow ID:', workflowId);
      
      // Activar workflow
      const activateResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
        method: 'POST',
        headers
      });

      if (activateResponse.ok) {
        console.log('✅ Workflow activado exitosamente');
        console.log('');
        console.log('🎉 ¡Generador de imágenes configurado!');
        console.log('');
        console.log('📋 Detalles:');
        console.log(`   🆔 ID: ${workflowId}`);
        console.log('   🔗 Webhook: https://n8n.wilkiedevs.com/webhook/generate-image');
        console.log('   🎨 Generador: DALL-E 3');
        console.log('   ☁️  Storage: Supabase');
        console.log('');
        console.log('📝 Ejemplo de uso:');
        console.log('curl -X POST https://n8n.wilkiedevs.com/webhook/generate-image \\');
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"title":"Blog Post Image","description":"Modern web development","type":"blog","size":"1024x1024"}\'');
        
        return workflowId;
      } else {
        console.error('❌ Error activando workflow');
        return null;
      }
    } else {
      const error = await response.text();
      console.error('❌ Error creando workflow:', response.status, error);
      return null;
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Configurando generador automático de imágenes...');
  
  const workflowId = await createImageGenerationWorkflow();
  
  if (workflowId) {
    console.log('');
    console.log('🎯 Tipos de imágenes soportadas:');
    console.log('   📝 blog - Para artículos del blog');
    console.log('   🛠️  service - Para servicios');
    console.log('   📁 project - Para proyectos del portafolio');
    console.log('   🏠 hero - Para secciones hero');
    console.log('   👥 team - Para miembros del equipo');
    console.log('');
    console.log('✨ ¡Listo para generar imágenes automáticamente!');
  } else {
    console.error('❌ No se pudo configurar el generador de imágenes');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };