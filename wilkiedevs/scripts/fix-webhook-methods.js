#!/usr/bin/env node

/**
 * Script para corregir los métodos HTTP de los webhooks en N8N
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY
};

async function getWorkflow(workflowId) {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
            method: 'GET',
            headers
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`❌ Error obteniendo workflow ${workflowId}:`, response.status);
            return null;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return null;
    }
}

async function updateWorkflow(workflowId, workflowData) {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(workflowData)
        });

        if (response.ok) {
            console.log(`✅ Workflow ${workflowId} actualizado exitosamente`);
            return await response.json();
        } else {
            const errorText = await response.text();
            console.error(`❌ Error actualizando workflow ${workflowId}:`, response.status, errorText);
            return null;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return null;
    }
}

async function activateWorkflow(workflowId) {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
            method: 'POST',
            headers
        });

        if (response.ok) {
            console.log(`✅ Workflow ${workflowId} activado exitosamente`);
            return true;
        } else {
            console.error(`❌ Error activando workflow ${workflowId}:`, response.status);
            return false;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return false;
    }
}

async function fixWebhookMethods() {
    console.log('🔧 Iniciando corrección de métodos HTTP de webhooks...\n');

    // Obtener workflows WilkieDevs
    const workflowsResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
        method: 'GET',
        headers
    });

    if (!workflowsResponse.ok) {
        console.error('❌ No se pudieron obtener workflows');
        return;
    }

    const workflowsData = await workflowsResponse.json();
    const wilkieWorkflows = workflowsData.data.filter(w => 
        w.name.includes('[WILKIEDEVS]') && w.active
    );

    console.log(`📊 Workflows WilkieDevs activos encontrados: ${wilkieWorkflows.length}\n`);

    for (const workflow of wilkieWorkflows) {
        console.log(`🔍 Procesando workflow: ${workflow.name}`);
        
        const fullWorkflow = await getWorkflow(workflow.id);
        if (!fullWorkflow) {
            console.log('❌ No se pudo obtener el workflow completo');
            continue;
        }

        let needsUpdate = false;
        const updatedNodes = fullWorkflow.nodes.map(node => {
            if (node.type === 'n8n-nodes-base.webhook') {
                console.log(`   📡 Webhook encontrado: ${node.name}`);
                console.log(`      - Método actual: ${node.parameters?.httpMethod || 'POST (default)'}`);
                
                // Asegurar que el método sea POST
                if (!node.parameters) {
                    node.parameters = {};
                }
                
                if (node.parameters.httpMethod !== 'POST') {
                    console.log(`      - Cambiando método a POST`);
                    node.parameters.httpMethod = 'POST';
                    needsUpdate = true;
                }

                // Asegurar que las opciones estén configuradas correctamente
                if (!node.parameters.options) {
                    node.parameters.options = {};
                }

                // Asegurar que el path esté configurado
                if (!node.parameters.path) {
                    console.log(`      - ⚠️  Path no configurado para ${node.name}`);
                }
            }
            return node;
        });

        if (needsUpdate) {
            console.log(`   🔄 Actualizando workflow...`);
            
            const updatedWorkflow = {
                ...fullWorkflow,
                nodes: updatedNodes
            };

            // Desactivar primero
            await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflow.id}/deactivate`, {
                method: 'POST',
                headers
            });

            // Actualizar
            const updateResult = await updateWorkflow(workflow.id, updatedWorkflow);
            
            if (updateResult) {
                // Reactivar
                await activateWorkflow(workflow.id);
            }
        } else {
            console.log(`   ✅ Webhook ya está configurado correctamente`);
        }

        console.log(''); // Línea en blanco
    }

    console.log('🎉 Corrección de webhooks completada!\n');

    // Probar webhooks después de la corrección
    console.log('🧪 Probando webhooks corregidos...\n');
    
    const webhooksToTest = [
        { path: 'rebecca-lead-capture', data: { name: 'Test', email: 'test@example.com' } },
        { path: 'quote-request', data: { name: 'Test', email: 'test@example.com', projectType: 'web' } },
        { path: 'email-sequence-trigger', data: { name: 'Test', email: 'test@example.com', sequenceType: 'welcome' } },
        { path: 'generate-image', data: { title: 'Test', description: 'Test image', type: 'blog' } }
    ];

    for (const webhook of webhooksToTest) {
        try {
            console.log(`🧪 Probando ${webhook.path}...`);
            
            const response = await fetch(`${N8N_BASE_URL}/webhook/${webhook.path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhook.data)
            });

            if (response.ok) {
                console.log(`✅ ${webhook.path}: FUNCIONANDO`);
            } else {
                const errorText = await response.text();
                console.log(`❌ ${webhook.path}: ERROR ${response.status}`);
                console.log(`   ${errorText}`);
            }
        } catch (error) {
            console.log(`💥 ${webhook.path}: ERROR - ${error.message}`);
        }
        
        // Esperar entre tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

if (require.main === module) {
    fixWebhookMethods();
}

module.exports = { fixWebhookMethods };