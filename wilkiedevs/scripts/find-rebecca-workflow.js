// Script para encontrar el workflow de Rebecca con el webhook específico
const n8nConfig = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.wilkiedevs.com',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
};

async function findRebeccaWorkflow() {
  console.log('🔍 Buscando workflow de Rebecca...\n');

  try {
    // Obtener todos los workflows
    const workflowsResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    const workflows = await workflowsResponse.json();
    const targetWebhookId = 'cc5a13ee-536a-4d78-a65b-0f84536f9c66';

    console.log(`Buscando webhook ID: ${targetWebhookId}\n`);

    // Buscar el workflow que contiene este webhook
    for (const workflow of workflows.data) {
      if (workflow.nodes) {
        const hasTargetWebhook = workflow.nodes.some(node => 
          node.webhookId === targetWebhookId
        );

        if (hasTargetWebhook) {
          console.log('🎯 ¡WORKFLOW ENCONTRADO!');
          console.log(`   Nombre: ${workflow.name}`);
          console.log(`   ID: ${workflow.id}`);
          console.log(`   Activo: ${workflow.active ? '✅ SÍ' : '❌ NO'}`);
          console.log(`   Tags: ${workflow.tags ? workflow.tags.join(', ') : 'Sin tags'}`);
          
          // Mostrar nodos del workflow
          console.log('\n📋 Nodos del workflow:');
          workflow.nodes.forEach(node => {
            console.log(`   - ${node.name} (${node.type})`);
            if (node.webhookId) {
              console.log(`     Webhook: ${node.webhookId}`);
            }
          });

          // Si no está activo, intentar activarlo
          if (!workflow.active) {
            console.log('\n🚀 Intentando activar el workflow...');
            
            try {
              const activateResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows/${workflow.id}/activate`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-N8N-API-KEY': n8nConfig.apiKey
                }
              });

              if (activateResponse.ok) {
                console.log('✅ Workflow activado exitosamente!');
                
                // Probar el webhook ahora
                console.log('\n🧪 Probando webhook después de activación...');
                const testResponse = await fetch(`https://n8n.wilkiedevs.com/webhook/${targetWebhookId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    chatInput: 'Hola Rebecca, esto es una prueba',
                    sessionId: 'test-session-activation',
                    userId: 'test-user'
                  })
                });

                console.log(`   Status: ${testResponse.status}`);
                
                if (testResponse.ok) {
                  const responseData = await testResponse.json();
                  console.log('✅ ¡Webhook funcionando correctamente!');
                  console.log(`   Respuesta: ${JSON.stringify(responseData, null, 2)}`);
                } else {
                  console.log('❌ Webhook aún no responde correctamente');
                  const errorText = await testResponse.text();
                  console.log(`   Error: ${errorText}`);
                }

              } else {
                console.log('❌ Error activando workflow');
                const errorText = await activateResponse.text();
                console.log(`   Error: ${errorText}`);
              }

            } catch (activationError) {
              console.log('❌ Error en activación:', activationError.message);
            }

          } else {
            console.log('\n✅ El workflow ya está activo');
            
            // Probar el webhook
            console.log('\n🧪 Probando webhook...');
            const testResponse = await fetch(`https://n8n.wilkiedevs.com/webhook/${targetWebhookId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                chatInput: 'Hola Rebecca, esto es una prueba',
                sessionId: 'test-session',
                userId: 'test-user'
              })
            });

            console.log(`   Status: ${testResponse.status}`);
            
            if (testResponse.ok) {
              const responseData = await testResponse.json();
              console.log('✅ Webhook funcionando correctamente!');
              console.log(`   Respuesta: ${JSON.stringify(responseData, null, 2)}`);
            } else {
              console.log('❌ Webhook no responde correctamente');
              const errorText = await testResponse.text();
              console.log(`   Error: ${errorText}`);
            }
          }

          return; // Salir después de encontrar el workflow
        }
      }
    }

    console.log('❌ No se encontró ningún workflow con ese webhook ID');
    console.log('\n💡 Posibles soluciones:');
    console.log('1. El workflow fue eliminado');
    console.log('2. El webhook ID cambió');
    console.log('3. Necesitas importar/crear el workflow de Rebecca');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar búsqueda
findRebeccaWorkflow().then(() => {
  console.log('\n🏁 Búsqueda completada');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});