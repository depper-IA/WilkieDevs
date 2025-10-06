#!/usr/bin/env node

/**
 * Script para listar todos los workflows de WILKIEDEVS
 */

const N8N_BASE_URL = 'https://n8n.wilkiedevs.com';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU';

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': N8N_API_KEY
};

async function listWorkflows() {
  try {
    console.log('📊 Obteniendo lista de workflows...');
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
      method: 'GET',
      headers
    });

    if (response.ok) {
      const data = await response.json();
      const workflows = data.data || [];
      
      // Filtrar workflows de WILKIEDEVS
      const wilkieWorkflows = workflows.filter(w => 
        w.name.includes('[WILKIEDEVS]') || 
        w.name.includes('WILKIEDEVS') ||
        w.name.includes('Rebecca') ||
        w.name.includes('WilkieDevs')
      );

      console.log(`📈 Total de workflows: ${workflows.length}`);
      console.log(`🏷️  Workflows WILKIEDEVS: ${wilkieWorkflows.length}`);
      console.log('');
      
      if (wilkieWorkflows.length > 0) {
        console.log('🤖 Workflows de WilkieDevs:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        wilkieWorkflows.forEach((workflow, index) => {
          const status = workflow.active ? '✅ Activo' : '⏸️  Inactivo';
          const updated = new Date(workflow.updatedAt).toLocaleDateString();
          
          console.log(`${index + 1}. ${workflow.name}`);
          console.log(`   🆔 ID: ${workflow.id}`);
          console.log(`   📊 Estado: ${status}`);
          console.log(`   📅 Actualizado: ${updated}`);
          console.log(`   🔢 Nodos: ${workflow.nodes?.length || 0}`);
          console.log('');
        });
        
        // Estadísticas
        const activeCount = wilkieWorkflows.filter(w => w.active).length;
        const inactiveCount = wilkieWorkflows.length - activeCount;
        
        console.log('📊 Estadísticas:');
        console.log(`   ✅ Activos: ${activeCount}`);
        console.log(`   ⏸️  Inactivos: ${inactiveCount}`);
        console.log(`   📈 Total: ${wilkieWorkflows.length}`);
        
      } else {
        console.log('❌ No se encontraron workflows de WILKIEDEVS');
      }
      
    } else {
      console.error('❌ Error obteniendo workflows:', response.status);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Listando workflows de WilkieDevs...');
  await listWorkflows();
}

if (require.main === module) {
  main();
}

module.exports = { main };