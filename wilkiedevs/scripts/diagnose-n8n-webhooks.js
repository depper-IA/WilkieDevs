#!/usr/bin/env node

/**
 * Script para diagnosticar problemas específicos con webhooks de N8N
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY
};

async function getWorkflowDetails(workflowId) {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
            method: 'GET',
            headers
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error(`❌ Error obteniendo detalles del workflow ${workflowId}:`, response.status);
            return null;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return null;
    }
}

async function getActiveWebhooks() {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/webhooks`, {
            method: 'GET',
            headers
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('❌ Error obteniendo webhooks activos:', response.status);
            return null;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return null;
    }
}

async function testWebhookDirect(webhookPath) {
    try {
        console.log(`🧪 Probando webhook directo: ${webhookPath}`);
        
        // Probar GET primero
        const getResponse = await fetch(`${N8N_BASE_URL}/webhook/${webhookPath}`, {
            method: 'GET'
        });
        
        console.log(`📡 GET ${webhookPath}: ${getResponse.status}`);
        
        // Probar POST
        const postResponse = await fetch(`${N8N_BASE_URL}/webhook/${webhookPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test: true })
        });
        
        console.log(`📡 POST ${webhookPath}: ${postResponse.status}`);
        
        if (postResponse.ok) {
            const responseText = await postResponse.text();
            console.log(`✅ Respuesta: ${responseText}`);
        } else {
            const errorText = await postResponse.text();
            console.log(`❌ Error: ${errorText}`);
        }
        
        return postResponse.ok;
    } catch (error) {
        console.log(`💥 Error probando webhook ${webhookPath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🔍 Iniciando diagnóstico detallado de webhooks N8N...\n');

    // 1. Obtener webhooks activos
    console.log('📡 Obteniendo webhooks activos...');
    const activeWebhooks = await getActiveWebhooks();
    
    if (activeWebhooks) {
        console.log(`✅ Webhooks activos encontrados: ${activeWebhooks.length || 0}`);
        if (activeWebhooks.length > 0) {
            activeWebhooks.forEach(webhook => {
                console.log(`   - ${webhook.webhookPath} (${webhook.method})`);
            });
        }
    } else {
        console.log('❌ No se pudieron obtener webhooks activos');
    }

    console.log('\n');

    // 2. Obtener workflows WilkieDevs activos
    console.log('📊 Obteniendo workflows WilkieDevs...');
    const workflowsResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
        method: 'GET',
        headers
    });

    if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json();
        const wilkieWorkflows = workflowsData.data.filter(w => 
            w.name.includes('[WILKIEDEVS]') && w.active
        );

        console.log(`✅ Workflows WilkieDevs activos: ${wilkieWorkflows.length}`);

        for (const workflow of wilkieWorkflows) {
            console.log(`\n🔍 Analizando workflow: ${workflow.name} (${workflow.id})`);
            
            const details = await getWorkflowDetails(workflow.id);
            if (details) {
                // Buscar nodos webhook
                const webhookNodes = details.nodes.filter(node => 
                    node.type === 'n8n-nodes-base.webhook'
                );

                if (webhookNodes.length > 0) {
                    webhookNodes.forEach(node => {
                        console.log(`   📡 Webhook encontrado:`);
                        console.log(`      - ID: ${node.id}`);
                        console.log(`      - Nombre: ${node.name}`);
                        console.log(`      - Path: ${node.parameters?.path || 'No definido'}`);
                        console.log(`      - Método: ${node.parameters?.httpMethod || 'POST'}`);
                        console.log(`      - WebhookId: ${node.webhookId || 'No definido'}`);
                    });
                } else {
                    console.log('   ⚠️  No se encontraron nodos webhook en este workflow');
                }
            }
        }

        // 3. Probar webhooks específicos
        console.log('\n🧪 Probando webhooks específicos...\n');
        
        const webhooksToTest = [
            'rebecca-lead-capture',
            'quote-request',
            'email-sequence-trigger',
            'generate-image'
        ];

        for (const webhookPath of webhooksToTest) {
            await testWebhookDirect(webhookPath);
            console.log(''); // Línea en blanco
        }

    } else {
        console.log('❌ No se pudieron obtener workflows');
    }

    console.log('🏁 Diagnóstico completado.');
}

if (require.main === module) {
    main();
}

module.exports = { main };