#!/usr/bin/env node

/**
 * Script para arreglar y verificar workflows de N8N
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY
};

async function getWorkflows() {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
            method: 'GET',
            headers
        });

        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        } else {
            console.error('❌ Error obteniendo workflows:', response.status);
            return [];
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return [];
    }
}

async function testWebhook(webhookUrl, testData) {
    try {
        console.log(`🧪 Probando webhook: ${webhookUrl}`);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            responseData = responseText;
        }

        if (response.ok) {
            console.log('✅ Webhook funcionando correctamente');
            return { success: true, response: responseData };
        } else {
            console.log('❌ Webhook con errores:', response.status);
            console.log('📄 Respuesta:', responseData);
            return { success: false, error: responseData };
        }
    } catch (error) {
        console.log('💥 Error probando webhook:', error.message);
        return { success: false, error: error.message };
    }
}

async function activateWorkflow(workflowId) {
    try {
        console.log(`🔄 Activando workflow ${workflowId}...`);

        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
            method: 'POST',
            headers
        });

        if (response.ok) {
            console.log('✅ Workflow activado exitosamente');
            return true;
        } else {
            console.error('❌ Error activando workflow:', response.status);
            return false;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return false;
    }
}

async function deactivateWorkflow(workflowId) {
    try {
        console.log(`⏸️  Desactivando workflow ${workflowId}...`);

        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/deactivate`, {
            method: 'POST',
            headers
        });

        if (response.ok) {
            console.log('✅ Workflow desactivado exitosamente');
            return true;
        } else {
            console.error('❌ Error desactivando workflow:', response.status);
            return false;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return false;
    }
}

async function main() {
    console.log('🔧 Iniciando verificación y reparación de workflows N8N...\n');

    // Obtener todos los workflows
    const workflows = await getWorkflows();
    const wilkieWorkflows = workflows.filter(w => w.name.includes('[WILKIEDEVS]'));

    console.log(`📊 Total workflows WilkieDevs encontrados: ${wilkieWorkflows.length}\n`);

    // Agrupar workflows por tipo
    const workflowGroups = {
        'Lead Capture': [],
        'Quote Generation': [],
        'Email Marketing': [],
        'Image Generation': []
    };

    wilkieWorkflows.forEach(workflow => {
        if (workflow.name.includes('Lead Capture')) {
            workflowGroups['Lead Capture'].push(workflow);
        } else if (workflow.name.includes('Quote')) {
            workflowGroups['Quote Generation'].push(workflow);
        } else if (workflow.name.includes('Email Marketing')) {
            workflowGroups['Email Marketing'].push(workflow);
        } else if (workflow.name.includes('Image Generator')) {
            workflowGroups['Image Generation'].push(workflow);
        }
    });

    // Verificar y limpiar duplicados
    for (const [type, workflows] of Object.entries(workflowGroups)) {
        console.log(`\n🔍 Verificando workflows de tipo: ${type}`);
        
        if (workflows.length === 0) {
            console.log(`⚠️  No se encontraron workflows de tipo ${type}`);
            continue;
        }

        if (workflows.length > 1) {
            console.log(`⚠️  Se encontraron ${workflows.length} workflows duplicados`);
            
            // Mantener solo el más reciente y activo
            const sortedWorkflows = workflows.sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            
            const keepWorkflow = sortedWorkflows[0];
            const duplicates = sortedWorkflows.slice(1);
            
            console.log(`✅ Manteniendo workflow: ${keepWorkflow.id} (${keepWorkflow.name})`);
            
            // Activar el workflow principal si no está activo
            if (!keepWorkflow.active) {
                await activateWorkflow(keepWorkflow.id);
            }
            
            // Desactivar duplicados
            for (const duplicate of duplicates) {
                console.log(`🗑️  Desactivando duplicado: ${duplicate.id}`);
                await deactivateWorkflow(duplicate.id);
            }
        } else {
            const workflow = workflows[0];
            console.log(`✅ Workflow único encontrado: ${workflow.id}`);
            
            // Activar si no está activo
            if (!workflow.active) {
                await activateWorkflow(workflow.id);
            }
        }
    }

    console.log('\n🧪 Probando webhooks...\n');

    // Definir tests para cada tipo de webhook
    const webhookTests = [
        {
            name: 'Lead Capture',
            url: 'https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture',
            data: {
                name: 'Test User',
                email: 'test@example.com',
                phone: '+57 300 123 4567',
                company: 'Test Company',
                projectType: 'automation',
                message: 'Testing lead capture',
                intent: 'general'
            }
        },
        {
            name: 'Quote Request',
            url: 'https://n8n.wilkiedevs.com/webhook/quote-request',
            data: {
                name: 'María González',
                email: 'maria@example.com',
                projectType: 'ecommerce',
                requirements: 'Tienda online con 100 productos'
            }
        },
        {
            name: 'Email Marketing',
            url: 'https://n8n.wilkiedevs.com/webhook/email-sequence-trigger',
            data: {
                name: 'Carlos Rodríguez',
                email: 'carlos@example.com',
                sequenceType: 'welcome'
            }
        },
        {
            name: 'Image Generation',
            url: 'https://n8n.wilkiedevs.com/webhook/generate-image',
            data: {
                title: 'Blog Post Image',
                description: 'Modern web development',
                type: 'blog',
                size: '1024x1024'
            }
        }
    ];

    const results = [];
    
    for (const test of webhookTests) {
        console.log(`\n📡 Probando ${test.name}...`);
        const result = await testWebhook(test.url, test.data);
        results.push({
            name: test.name,
            url: test.url,
            ...result
        });
        
        // Esperar un poco entre tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Resumen final
    console.log('\n📋 RESUMEN DE VERIFICACIÓN\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    results.forEach(result => {
        const status = result.success ? '✅ FUNCIONANDO' : '❌ CON ERRORES';
        console.log(`${result.name}: ${status}`);
        if (!result.success) {
            console.log(`   Error: ${JSON.stringify(result.error)}`);
        }
    });

    const workingWebhooks = results.filter(r => r.success).length;
    const totalWebhooks = results.length;
    
    console.log(`\n📊 Webhooks funcionando: ${workingWebhooks}/${totalWebhooks}`);
    
    if (workingWebhooks === totalWebhooks) {
        console.log('🎉 ¡Todos los workflows están funcionando correctamente!');
    } else {
        console.log('⚠️  Algunos workflows necesitan atención. Revisa las credenciales y configuraciones.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };