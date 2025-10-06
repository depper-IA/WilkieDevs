#!/usr/bin/env node

/**
 * Script maestro para crear TODOS los workflows de WILKIEDEVS
 */

const { main: createEmailMarketing } = require('./create-email-marketing-workflow.js');
const { main: createQuoteWorkflow } = require('./create-quote-workflow.js');

async function createAllWorkflows() {
  console.log('🚀 CREANDO TODOS LOS WORKFLOWS DE WILKIEDEVS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  const results = [];

  try {
    // 1. Email Marketing Sequences
    console.log('📧 1/2 - Email Marketing Sequences...');
    await createEmailMarketing();
    results.push('✅ Email Marketing');
    console.log('');

    // 2. Quote Generation & Follow-up
    console.log('💰 2/2 - Quote Generation & Follow-up...');
    await createQuoteWorkflow();
    results.push('✅ Quote Generation');
    console.log('');

    console.log('🎉 ¡TODOS LOS WORKFLOWS CREADOS EXITOSAMENTE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📊 Resumen de workflows creados:');
    results.forEach(result => console.log(`   ${result}`));
    console.log('');
    console.log('🔗 Webhooks disponibles:');
    console.log('   📧 Email Marketing: https://n8n.wilkiedevs.com/webhook/email-sequence-trigger');
    console.log('   💰 Quote Generation: https://n8n.wilkiedevs.com/webhook/quote-request');
    console.log('   🤖 Lead Capture: https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture');
    console.log('   🎨 Image Generation: https://n8n.wilkiedevs.com/webhook/generate-image');
    console.log('');
    console.log('✨ ¡Sistema de automatización completo configurado!');

  } catch (error) {
    console.error('💥 Error creando workflows:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  createAllWorkflows();
}

module.exports = { createAllWorkflows };