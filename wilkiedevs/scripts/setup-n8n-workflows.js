#!/usr/bin/env node

/**
 * Script para configurar workflows de N8N con tag WILKIEDEVS
 * Basado en mejores prácticas del video: https://www.youtube.com/watch?v=SF8Ddp0RaF8&t=9331s
 */

const { setupChatbotWorkflows, activateChatbotWorkflows } = require('../src/lib/chatbot-workflows.ts');

async function main() {
  console.log('🚀 Iniciando configuración de workflows N8N para WilkieDevs...');
  console.log('📹 Basado en: https://www.youtube.com/watch?v=SF8Ddp0RaF8&t=9331s');
  
  try {
    // Verificar conexión con N8N
    console.log('🔍 Verificando conexión con N8N...');
    
    // Configurar workflows del chatbot
    console.log('🤖 Configurando workflows del chatbot Rebecca...');
    const workflows = await setupChatbotWorkflows();
    
    if (workflows.leadCapture && workflows.responseIntelligence) {
      console.log('✅ Workflows creados exitosamente:');
      console.log(`   📊 Lead Capture: ${workflows.leadCapture}`);
      console.log(`   🧠 Response Intelligence: ${workflows.responseIntelligence}`);
      
      // Activar workflows
      console.log('🔄 Activando workflows...');
      const workflowIds = [workflows.leadCapture, workflows.responseIntelligence].filter(Boolean);
      const activated = await activateChatbotWorkflows(workflowIds);
      
      if (activated) {
        console.log('🎉 ¡Todos los workflows están activos y funcionando!');
        console.log('');
        console.log('📋 Resumen de configuración:');
        console.log('   🏷️  Tag: WILKIEDEVS');
        console.log('   🎨 Colores: Esquema WilkieDevs aplicado');
        console.log('   🤖 Chatbot: Rebecca configurada');
        console.log('   📊 Analytics: Habilitado');
        console.log('   📧 Email: Templates personalizados');
        console.log('');
        console.log('🔗 URLs de Webhook:');
        console.log('   Lead Capture: https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture');
        console.log('   Response AI: https://n8n.wilkiedevs.com/webhook/rebecca-response');
        console.log('');
        console.log('✨ ¡Configuración completada exitosamente!');
      } else {
        console.error('❌ Error activando workflows');
        process.exit(1);
      }
    } else {
      console.error('❌ Error creando workflows');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Error durante la configuración:', error.message);
    console.log('');
    console.log('🔧 Pasos para solucionar:');
    console.log('   1. Verificar que N8N esté ejecutándose');
    console.log('   2. Verificar credenciales en .env');
    console.log('   3. Verificar conectividad de red');
    console.log('   4. Revisar logs de N8N');
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main };