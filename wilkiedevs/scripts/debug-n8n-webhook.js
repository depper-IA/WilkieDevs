// Script para debuggear el webhook de N8N y verificar su estado
const n8nConfig = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.wilkiedevs.com',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
};

async function debugN8NWebhook() {
  console.log('🔍 Debuggeando webhook de N8N...\n');

  try {
    // 1. Verificar conexión con N8N
    console.log('1. Verificando conexión con N8N API...');
    const healthResponse = await fetch(`${n8nConfig.apiUrl}/healthz`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    console.log(`   Status: ${healthResponse.status}`);
    if (!healthResponse.ok) {
      console.log('❌ N8N API no está disponible');
      return;
    }
    console.log('✅ N8N API conectado');

    // 2. Listar todos los workflows
    console.log('\n2. Obteniendo lista de workflows...');
    const workflowsResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    if (!workflowsResponse.ok) {
      console.log('❌ Error obteniendo workflows');
      return;
    }

    const workflows = await workflowsResponse.json();
    console.log(`   Total workflows: ${workflows.data.length}`);

    // 3. Buscar workflows con webhooks
    console.log('\n3. Buscando workflows con webhooks...');
    const webhookWorkflows = workflows.data.filter(w => 
      w.nodes && w.nodes.some(node => 
        node.type === '@n8n/n8n-nodes-langchain.chatTrigger' || 
        node.type === 'n8n-nodes-base.webhook'
      )
    );

    console.log(`   Workflows con webhooks: ${webhookWorkflows.length}`);

    // 4. Mostrar detalles de cada workflow con webhook
    for (const workflow of webhookWorkflows) {
      console.log(`\n📋 Workflow: ${workflow.name}`);
      console.log(`   ID: ${workflow.id}`);
      console.log(`   Activo: ${workflow.active ? '✅' : '❌'}`);
      
      // Buscar nodos de webhook
      const webhookNodes = workflow.nodes.filter(node => 
        node.type === '@n8n/n8n-nodes-langchain.chatTrigger' || 
        node.type === 'n8n-nodes-base.webhook'
      );

      for (const node of webhookNodes) {
        console.log(`   Webhook Node: ${node.name}`);
        console.log(`   Tipo: ${node.type}`);
        
        if (node.webhookId) {
          console.log(`   Webhook ID: ${node.webhookId}`);
          console.log(`   URL: https://n8n.wilkiedevs.com/webhook/${node.webhookId}`);
        }
        
        if (node.parameters && node.parameters.path) {
          console.log(`   Path: ${node.parameters.path}`);
        }
      }
    }

    // 5. Probar el webhook específico que tenemos
    const webhookId = 'cc5a13ee-536a-4d78-a65b-0f84536f9c66';
    console.log(`\n4. Probando webhook específico: ${webhookId}`);
    
    const testWebhookUrl = `https://n8n.wilkiedevs.com/webhook/${webhookId}`;
    console.log(`   URL: ${testWebhookUrl}`);

    try {
      const testResponse = await fetch(testWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatInput: 'Test de conexión',
          sessionId: 'debug-session',
          userId: 'debug-user'
        })
      });

      console.log(`   Status: ${testResponse.status}`);
      
      if (testResponse.ok) {
        const responseData = await testResponse.json();
        console.log('✅ Webhook respondió correctamente');
        console.log(`   Respuesta: ${JSON.stringify(responseData, null, 2)}`);
      } else {
        console.log('❌ Webhook no respondió correctamente');
        const errorText = await testResponse.text();
        console.log(`   Error: ${errorText}`);
      }

    } catch (webhookError) {
      console.log('❌ Error probando webhook:', webhookError.message);
    }

    // 6. Verificar workflows activos específicamente
    console.log('\n5. Workflows activos:');
    const activeWorkflows = workflows.data.filter(w => w.active);
    console.log(`   Total activos: ${activeWorkflows.length}`);
    
    activeWorkflows.forEach(w => {
      console.log(`   - ${w.name} (ID: ${w.id})`);
    });

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar debug
debugN8NWebhook().then(() => {
  console.log('\n🏁 Debug completado');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});