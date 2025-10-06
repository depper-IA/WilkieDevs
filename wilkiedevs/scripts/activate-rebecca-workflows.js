// Script para activar los workflows de Rebecca en N8N

// Configuración directa de N8N
const n8nConfig = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.wilkiedevs.com',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
};

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

async function activateWorkflow(workflowId) {
  try {
    const response = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function activateRebeccaWorkflows() {
    console.log('🤖 Activando workflows de Rebecca...');
    
    try {
        // Obtener todos los workflows
        console.log('\n📋 Obteniendo workflows...');
        const workflows = await getN8NWorkflows();
        
        if (!workflows) {
            console.log('❌ No se pudieron obtener workflows');
            return;
        }
        
        // Buscar workflows de Rebecca/WilkieDevs
        const rebeccaWorkflows = workflows.filter(w => 
            (w.name && (
                w.name.toLowerCase().includes('rebecca') || 
                w.name.toLowerCase().includes('wilkiedevs') ||
                w.name.toLowerCase().includes('chatbot')
            )) ||
            (w.tags && w.tags.includes('WILKIEDEVS'))
        );
        
        console.log(`🔍 Encontrados ${rebeccaWorkflows.length} workflows relacionados con Rebecca/WilkieDevs:`);
        
        for (const workflow of rebeccaWorkflows) {
            console.log(`\n📝 Workflow: ${workflow.name}`);
            console.log(`   ID: ${workflow.id}`);
            console.log(`   Activo: ${workflow.active ? '✅' : '❌'}`);
            console.log(`   Tags: ${workflow.tags ? workflow.tags.join(', ') : 'Sin tags'}`);
            
            if (!workflow.active) {
                console.log(`   🔄 Activando workflow...`);
                const activated = await activateWorkflow(workflow.id);
                
                if (activated) {
                    console.log(`   ✅ Workflow activado exitosamente`);
                } else {
                    console.log(`   ❌ Error activando workflow`);
                }
            } else {
                console.log(`   ✅ Workflow ya está activo`);
            }
        }
        
        // Mostrar resumen
        console.log(`\n📊 Resumen:`);
        console.log(`   Total workflows encontrados: ${rebeccaWorkflows.length}`);
        console.log(`   Workflows activos: ${rebeccaWorkflows.filter(w => w.active).length}`);
        console.log(`   Workflows inactivos: ${rebeccaWorkflows.filter(w => !w.active).length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Ejecutar activación
activateRebeccaWorkflows().then(() => {
    console.log('\n🏁 Proceso de activación completado');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});