// Script para activar y verificar el workflow de N8N de Rebecca
// Usando fetch nativo de Node.js 18+

// Configuración del workflow
const WORKFLOW_ID = 'y8d3eOzMf5y9Uzbc';
const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const WORKFLOW_URL = `${N8N_BASE_URL}/workflow/${WORKFLOW_ID}`;

// Webhooks esperados del workflow
const expectedWebhooks = [
  'c4ce0742-8638-47b6-9507-a8bd7bb63896', // Webhook principal de Rebecca
  'lead-capture',
  'generate-quote',
  'conversation-metrics'
];

async function checkWorkflowStatus() {
  console.log('🔍 Verificando estado del workflow de Rebecca...\n');
  
  try {
    // Verificar si el workflow existe
    console.log(`📋 Workflow URL: ${WORKFLOW_URL}`);
    
    // Probar cada webhook esperado
    for (const webhookId of expectedWebhooks) {
      const webhookUrl = `${N8N_BASE_URL}/webhook/${webhookId}`;
      console.log(`\n🔗 Probando webhook: ${webhookUrl}`);
      
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          console.log(`✅ Webhook activo: ${webhookId}`);
          const result = await response.text();
          console.log(`   Respuesta: ${result.substring(0, 100)}...`);
        } else {
          console.log(`❌ Webhook inactivo: ${webhookId} (${response.status})`);
        }
        
      } catch (error) {
        console.log(`❌ Error en webhook ${webhookId}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verificando workflow:', error.message);
  }
}

async function testRebeccaWebhook() {
  console.log('\n🤖 Probando webhook principal de Rebecca...\n');
  
  const webhookUrl = `${N8N_BASE_URL}/webhook/c4ce0742-8638-47b6-9507-a8bd7bb63896`;
  
  const testMessages = [
    'Hola Rebecca',
    'Necesito un sitio web',
    '¿Cuánto cuesta?',
    'Mi email es test@example.com'
  ];
  
  for (const message of testMessages) {
    console.log(`📤 Enviando: "${message}"`);
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chatInput: message,
          sessionId: 'test-session-' + Date.now(),
          userId: 'test-user',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Respuesta: ${result.response || result.output || 'Sin respuesta'}`);
        
        if (result.intent) {
          console.log(`🎯 Intención: ${result.intent}`);
        }
      } else {
        console.log(`❌ Error ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    // Pausa entre mensajes
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function generateActivationInstructions() {
  console.log('\n📋 INSTRUCCIONES PARA ACTIVAR EL WORKFLOW:\n');
  
  console.log('1. 🌐 Abre tu N8N dashboard:');
  console.log(`   ${N8N_BASE_URL}`);
  
  console.log('\n2. 📂 Busca el workflow de Rebecca:');
  console.log(`   ID: ${WORKFLOW_ID}`);
  console.log(`   URL: ${WORKFLOW_URL}`);
  
  console.log('\n3. ⚡ Activa el workflow:');
  console.log('   - Haz clic en el toggle "Active" en la esquina superior derecha');
  console.log('   - Asegúrate de que esté en color verde/azul');
  console.log('   - Guarda el workflow si es necesario');
  
  console.log('\n4. 🔗 Verifica los webhooks:');
  expectedWebhooks.forEach(webhook => {
    console.log(`   - ${N8N_BASE_URL}/webhook/${webhook}`);
  });
  
  console.log('\n5. 🧪 Prueba el sistema:');
  console.log('   - Ejecuta: node scripts/test-rebecca-complete-system.js');
  console.log('   - Verifica que no haya errores 404');
  
  console.log('\n📝 CONFIGURACIÓN REQUERIDA EN EL WORKFLOW:');
  console.log('   - Webhook Trigger configurado correctamente');
  console.log('   - Conexión a Supabase activa');
  console.log('   - API keys de OpenAI/Gemini configuradas');
  console.log('   - Nodos de respuesta funcionando');
}

// Ejecutar verificaciones
async function main() {
  console.log('🚀 Verificador de Workflow N8N para Rebecca\n');
  
  await checkWorkflowStatus();
  await testRebeccaWebhook();
  await generateActivationInstructions();
  
  console.log('\n✨ Verificación completada!');
  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('1. Activa el workflow en N8N siguiendo las instrucciones');
  console.log('2. Ejecuta las pruebas nuevamente');
  console.log('3. Verifica que Rebecca responda correctamente');
}

main().catch(console.error);