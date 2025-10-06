#!/usr/bin/env node

/**
 * Script para activar todos los workflows de WILKIEDEVS
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': N8N_API_KEY
};

async function activateWorkflow(workflowId, name) {
  try {
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers
    });

    if (response.ok) {
      console.log(`✅ ${name} activado`);
      return true;
    } else {
      console.error(`❌ Error activando ${name}:`, response.status);
      return false;
    }
  } catch (error) {
    console.error(`💥 Error activando ${name}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔄 Activando todos los workflows de WILKIEDEVS...');
  
  // IDs de workflows conocidos
  const workflows = [
    { id: 'JyywpOCMvw4PM1ZJ', name: 'Rebecca Chatbot - Lead Capture' },
    { id: 'XpRmwskBHG32IyRO', name: 'AI Image Generator' },
    { id: 'HwHn3MFIcYJKgr3g', name: 'Email Marketing Sequences' }
  ];

  let activatedCount = 0;
  
  for (const workflow of workflows) {
    const activated = await activateWorkflow(workflow.id, workflow.name);
    if (activated) activatedCount++;
  }

  console.log('');
  console.log(`🎉 Workflows activados: ${activatedCount}/${workflows.length}`);
  
  if (activatedCount === workflows.length) {
    console.log('✨ ¡Todos los workflows están activos y funcionando!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };