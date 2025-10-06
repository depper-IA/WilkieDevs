#!/usr/bin/env node

/**
 * Script para limpiar workflows duplicados y crear solo los necesarios
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

async function deleteWorkflow(workflowId) {
    try {
        console.log(`🗑️  Eliminando workflow ${workflowId}...`);

        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
            method: 'DELETE',
            headers
        });

        if (response.ok) {
            console.log('✅ Workflow eliminado exitosamente');
            return true;
        } else {
            console.error('❌ Error eliminando workflow:', response.status);
            return false;
        }
    } catch (error) {
        console.error('💥 Error:', error.message);
        return false;
    }
}

async function testWebhook(webhookUrl, testData) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        if (response.ok) {
            console.log('✅ Webhook funcionando correctamente');
            return true;
        } else {
            console.log('❌ Webhook con errores:', response.status);
            return false;
        }
    } catch (error) {
        console.log('💥 Error probando webhook:', error.message);
        return false;
    }
}

async function main() {
    console.log('🧹 Iniciando limpieza y reorganización de workflows N8N...\n');

    // 1. Obtener todos los workflows
    const workflows = await getWorkflows();
    const wilkieWorkflows = workflows.filter(w => w.name.includes('[WILKIEDEVS]'));

    console.log(`📊 Total workflows WilkieDevs encontrados: ${wilkieWorkflows.length}\n`);

    // 2. Mostrar todos los workflows existentes
    console.log('📋 Workflows existentes:');
    wilkieWorkflows.forEach((workflow, index) => {
        const status = workflow.active ? '✅ Activo' : '⏸️  Inactivo';
        console.log(`${index + 1}. ${workflow.name}`);
        console.log(`   🆔 ID: ${workflow.id}`);
        console.log(`   📊 Estado: ${status}`);
        console.log(`   📅 Actualizado: ${new Date(workflow.updatedAt).toLocaleDateString()}`);
        console.log('');
    });

    // 3. Agrupar por tipo
    const workflowTypes = {
        'Lead Capture': wilkieWorkflows.filter(w => w.name.includes('Lead Capture')),
        'Quote Generation': wilkieWorkflows.filter(w => w.name.includes('Quote')),
        'Email Marketing': wilkieWorkflows.filter(w => w.name.includes('Email Marketing')),
        'Image Generation': wilkieWorkflows.filter(w => w.name.includes('Image Generator'))
    };

    console.log('🔍 Análisis por tipo:\n');

    // 4. Identificar duplicados y workflows a mantener
    const workflowsToKeep = [];
    const workflowsToDelete = [];

    for (const [type, workflows] of Object.entries(workflowTypes)) {
        console.log(`📂 ${type}:`);
        
        if (workflows.length === 0) {
            console.log(`   ⚠️  No encontrado - NECESITA CREARSE`);
        } else if (workflows.length === 1) {
            const workflow = workflows[0];
            console.log(`   ✅ Único workflow encontrado: ${workflow.id}`);
            workflowsToKeep.push(workflow);
        } else {
            console.log(`   ⚠️  ${workflows.length} duplicados encontrados`);
            
            // Ordenar por fecha de actualización (más reciente primero)
            const sortedWorkflows = workflows.sort((a, b) => 
                new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            
            // Mantener el más reciente
            const keepWorkflow = sortedWorkflows[0];
            const duplicates = sortedWorkflows.slice(1);
            
            console.log(`   ✅ Mantener: ${keepWorkflow.id} (más reciente)`);
            workflowsToKeep.push(keepWorkflow);
            
            duplicates.forEach(duplicate => {
                console.log(`   🗑️  Eliminar: ${duplicate.id} (duplicado)`);
                workflowsToDelete.push(duplicate);
            });
        }
        console.log('');
    }

    // 5. Confirmar eliminaciones
    if (workflowsToDelete.length > 0) {
        console.log(`⚠️  Se eliminarán ${workflowsToDelete.length} workflows duplicados:`);
        workflowsToDelete.forEach(workflow => {
            console.log(`   - ${workflow.name} (${workflow.id})`);
        });
        console.log('');

        // Eliminar duplicados
        for (const workflow of workflowsToDelete) {
            await deleteWorkflow(workflow.id);
            // Esperar un poco entre eliminaciones
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // 6. Verificar workflows que funcionan
    console.log('🧪 Probando workflows existentes...\n');

    const webhookTests = [
        {
            name: 'Lead Capture',
            url: 'https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture',
            data: { name: 'Test', email: 'test@example.com', projectType: 'automation' }
        },
        {
            name: 'Quote Request',
            url: 'https://n8n.wilkiedevs.com/webhook/quote-request',
            data: { name: 'Test', email: 'test@example.com', projectType: 'ecommerce' }
        },
        {
            name: 'Email Marketing',
            url: 'https://n8n.wilkiedevs.com/webhook/email-sequence-trigger',
            data: { name: 'Test', email: 'test@example.com', sequenceType: 'welcome' }
        },
        {
            name: 'Image Generation',
            url: 'https://n8n.wilkiedevs.com/webhook/generate-image',
            data: { title: 'Test', description: 'Test image', type: 'blog' }
        }
    ];

    const workingWebhooks = [];
    const brokenWebhooks = [];

    for (const test of webhookTests) {
        console.log(`🧪 Probando ${test.name}...`);
        const isWorking = await testWebhook(test.url, test.data);
        
        if (isWorking) {
            workingWebhooks.push(test.name);
        } else {
            brokenWebhooks.push(test.name);
        }
        
        // Esperar entre tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 7. Resumen final
    console.log('\n📋 RESUMEN FINAL\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log(`🗑️  Workflows eliminados: ${workflowsToDelete.length}`);
    console.log(`✅ Workflows mantenidos: ${workflowsToKeep.length}`);
    console.log(`🔧 Webhooks funcionando: ${workingWebhooks.length}/4`);
    
    if (workingWebhooks.length > 0) {
        console.log('\n✅ Webhooks que funcionan:');
        workingWebhooks.forEach(name => console.log(`   - ${name}`));
    }
    
    if (brokenWebhooks.length > 0) {
        console.log('\n❌ Webhooks que necesitan configuración manual:');
        brokenWebhooks.forEach(name => console.log(`   - ${name}`));
        
        console.log('\n🔧 ACCIÓN REQUERIDA:');
        console.log('Ve a n8n.wilkiedevs.com y configura manualmente los webhooks que fallan:');
        console.log('1. Abre cada workflow');
        console.log('2. Encuentra el nodo webhook');
        console.log('3. Configura HTTP Method = "POST"');
        console.log('4. Guarda y activa el workflow');
    }

    if (workingWebhooks.length === 4) {
        console.log('\n🎉 ¡Todos los workflows están funcionando correctamente!');
        console.log('✨ Puedes proceder con la implementación del chatbot.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };