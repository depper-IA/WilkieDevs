// Script para importar el workflow de Rebecca a N8N
const fs = require('fs');
const path = require('path');

// Configuración de N8N
const n8nConfig = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.wilkiedevs.com',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
};

async function importWorkflowToN8N() {
  console.log('📥 Importando workflow de Rebecca a N8N...\n');

  try {
    // 1. Leer el archivo del workflow
    console.log('📖 Leyendo archivo del workflow...');
    const workflowPath = path.join(__dirname, 'n8n-rebecca-workflow.json');
    
    if (!fs.existsSync(workflowPath)) {
      throw new Error('Archivo del workflow no encontrado: ' + workflowPath);
    }

    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    console.log('✅ Workflow leído correctamente');

    // 2. Verificar conexión con N8N
    console.log('\n🔍 Verificando conexión con N8N...');
    const healthResponse = await fetch(`${n8nConfig.apiUrl}/healthz`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    if (!healthResponse.ok) {
      throw new Error('No se puede conectar con N8N');
    }

    console.log('✅ Conexión con N8N exitosa');

    // 3. Verificar si ya existe un workflow de Rebecca
    console.log('\n🔍 Verificando workflows existentes...');
    const workflowsResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    if (!workflowsResponse.ok) {
      throw new Error('Error obteniendo workflows existentes');
    }

    const existingWorkflows = await workflowsResponse.json();
    const rebeccaWorkflows = existingWorkflows.data.filter(w => 
      w.name && w.name.includes('Rebecca') && w.name.includes('WILKIEDEVS')
    );

    console.log(`📋 Workflows de Rebecca encontrados: ${rebeccaWorkflows.length}`);

    // 4. Crear o actualizar el workflow
    let workflowId = null;
    let isUpdate = false;

    if (rebeccaWorkflows.length > 0) {
      // Actualizar workflow existente
      workflowId = rebeccaWorkflows[0].id;
      isUpdate = true;
      console.log(`\n🔄 Actualizando workflow existente (ID: ${workflowId})...`);

      const updateResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows/${workflowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': n8nConfig.apiKey
        },
        body: JSON.stringify({
          ...workflowData,
          id: workflowId
        })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Error actualizando workflow: ${updateResponse.status} - ${errorText}`);
      }

      console.log('✅ Workflow actualizado exitosamente');

    } else {
      // Crear nuevo workflow
      console.log('\n➕ Creando nuevo workflow...');

      const createResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': n8nConfig.apiKey
        },
        body: JSON.stringify(workflowData)
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Error creando workflow: ${createResponse.status} - ${errorText}`);
      }

      const createdWorkflow = await createResponse.json();
      workflowId = createdWorkflow.data.id;
      console.log(`✅ Workflow creado exitosamente (ID: ${workflowId})`);
    }

    // 5. Activar el workflow
    console.log('\n🚀 Activando workflow...');
    const activateResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    if (!activateResponse.ok) {
      console.warn('⚠️ No se pudo activar automáticamente el workflow');
    } else {
      console.log('✅ Workflow activado exitosamente');
    }

    // 6. Obtener información del webhook
    console.log('\n📡 Información del webhook:');
    console.log(`   URL: https://n8n.wilkiedevs.com/webhook/rebecca-chat-main`);
    console.log(`   Método: POST`);
    console.log(`   Formato: JSON`);

    // 7. Mostrar ejemplo de uso
    console.log('\n📝 Ejemplo de uso:');
    console.log(`
curl -X POST https://n8n.wilkiedevs.com/webhook/rebecca-chat-main \\
  -H "Content-Type: application/json" \\
  -d '{
    "chatInput": "Hola Rebecca, necesito un sitio web",
    "sessionId": "test-session-123",
    "userId": "user-456"
  }'
    `);

    // 8. Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE IMPORTACIÓN');
    console.log('='.repeat(60));
    console.log(`✅ Workflow ${isUpdate ? 'actualizado' : 'creado'} exitosamente`);
    console.log(`🆔 ID del workflow: ${workflowId}`);
    console.log(`🏷️ Nombre: ${workflowData.name}`);
    console.log(`🔗 Webhook: rebecca-chat-main`);
    console.log(`📊 Nodos: ${workflowData.nodes.length}`);
    console.log(`🏷️ Tags: ${workflowData.tags.join(', ')}`);

  } catch (error) {
    console.error('❌ Error importando workflow:', error.message);
    
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n💡 Sugerencias:');
      console.log('- Verifica que el API key de N8N sea correcto');
      console.log('- Asegúrate de tener permisos para crear/modificar workflows');
    } else if (error.message.includes('404')) {
      console.log('\n💡 Sugerencias:');
      console.log('- Verifica que la URL de N8N sea correcta');
      console.log('- Asegúrate de que N8N esté ejecutándose');
    }
  }
}

// Ejecutar importación
importWorkflowToN8N().then(() => {
  console.log('\n🎉 Importación completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Verificar que el workflow esté activo en N8N');
  console.log('2. Configurar las credenciales necesarias (Supabase, Redis, Gemini)');
  console.log('3. Probar el webhook con el script de pruebas');
  console.log('4. Integrar el chatbot en el sitio web');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});