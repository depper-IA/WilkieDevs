// Script para probar el servicio de IA de Rebecca basado en N8N

// Configuración directa de N8N
const n8nConfig = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.wilkiedevs.com',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
};

// Funciones de N8N simplificadas
async function testN8NConnection() {
  try {
    const response = await fetch(`${n8nConfig.apiUrl}/healthz`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function getN8NWorkflows() {
  try {
    const response = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return null;
  }
}

async function sendWebhook(webhookUrl, data) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function testRebeccaAI() {
    console.log('🤖 Probando servicio de IA de Rebecca (N8N)...');
    
    try {
        // 1. Test N8N connection
        console.log('\n🔍 Verificando conexión con N8N...');
        const isConnected = await testN8NConnection();
        console.log('N8N conectado:', isConnected ? '✅' : '❌');
        
        if (!isConnected) {
            console.log('❌ No se puede conectar con N8N. Verifica la configuración.');
            return;
        }
        
        // 2. List workflows
        console.log('\n📋 Obteniendo workflows disponibles...');
        const workflows = await getN8NWorkflows();
        if (workflows) {
            console.log(`✅ ${workflows.length} workflows encontrados`);
            
            // Buscar workflows de Rebecca
            const rebeccaWorkflows = workflows.filter(w => 
                w.name && w.name.toLowerCase().includes('rebecca') || 
                w.tags && w.tags.includes('WILKIEDEVS')
            );
            
            console.log(`🤖 ${rebeccaWorkflows.length} workflows de Rebecca encontrados:`);
            rebeccaWorkflows.forEach(w => {
                console.log(`   - ${w.name} (ID: ${w.id}) - Activo: ${w.active ? '✅' : '❌'}`);
            });
        } else {
            console.log('❌ No se pudieron obtener workflows');
        }
        
        // 3. Test webhook simple
        console.log('\n💬 Probando webhook del chatbot...');
        const testMessage = {
            message: 'Hola Rebecca, ¿qué servicios ofrecen?',
            userId: 'test-user',
            sessionId: 'test-session-' + Date.now(),
            timestamp: new Date().toISOString()
        };
        
        try {
            const webhookUrl = 'https://n8n.wilkiedevs.com/webhook/rebecca-chat';
            const response = await sendWebhook(webhookUrl, testMessage);
            
            if (response) {
                console.log('✅ Webhook respondió:');
                console.log('   Respuesta:', JSON.stringify(response, null, 2));
            } else {
                console.log('⚠️ Webhook no respondió o respuesta vacía');
            }
        } catch (error) {
            console.log('❌ Error en webhook:', error.message);
            console.log('💡 Esto es normal si el webhook aún no está configurado');
        }
        
        // 4. Test lead capture workflow
        console.log('\n📝 Probando captura de lead...');
        try {
            const leadData = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Prueba de captura de lead desde Rebecca',
                source: 'rebecca-chatbot',
                timestamp: new Date().toISOString()
            };
            
            const leadWebhook = 'https://n8n.wilkiedevs.com/webhook/lead-capture';
            const leadResponse = await sendWebhook(leadWebhook, leadData);
            
            if (leadResponse) {
                console.log('✅ Lead capturado exitosamente');
            } else {
                console.log('⚠️ Captura de lead sin respuesta');
            }
        } catch (error) {
            console.log('❌ Error capturando lead:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error en pruebas:', error.message);
    }
}

// Ejecutar pruebas
testRebeccaAI().then(() => {
    console.log('\n🏁 Pruebas de Rebecca AI completadas');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Crear workflows específicos para Rebecca en N8N');
    console.log('2. Configurar webhooks para chat y RAG');
    console.log('3. Implementar la interfaz de usuario del chatbot');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});