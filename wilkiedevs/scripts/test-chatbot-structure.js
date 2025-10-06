// Script para verificar la estructura del proyecto del chatbot Rebecca
const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  return fs.existsSync(fullPath);
}

function checkDirectoryExists(dirPath) {
  const fullPath = path.join(__dirname, '..', dirPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

async function testChatbotStructure() {
  console.log('🏗️ Verificando estructura del proyecto del chatbot Rebecca...\n');

  const checks = [
    // Directorios principales
    { type: 'dir', path: 'src/components/chatbot', name: 'Directorio de componentes del chatbot' },
    { type: 'dir', path: 'src/types', name: 'Directorio de tipos TypeScript' },
    { type: 'dir', path: 'src/hooks', name: 'Directorio de hooks personalizados' },
    { type: 'dir', path: 'src/lib', name: 'Directorio de librerías y servicios' },

    // Archivos de componentes
    { type: 'file', path: 'src/components/chatbot/ChatWidget.tsx', name: 'Componente principal del chat' },
    { type: 'file', path: 'src/components/chatbot/ChatProvider.tsx', name: 'Proveedor de contexto del chat' },
    { type: 'file', path: 'src/components/chatbot/ChatbotIntegration.tsx', name: 'Integración del chatbot' },
    { type: 'file', path: 'src/components/chatbot/index.ts', name: 'Exportaciones del módulo chatbot' },

    // Archivos de tipos
    { type: 'file', path: 'src/types/chatbot.ts', name: 'Tipos TypeScript del chatbot' },

    // Hooks personalizados
    { type: 'file', path: 'src/hooks/useChatbot.ts', name: 'Hook principal del chatbot' },
    { type: 'file', path: 'src/hooks/useMigratedImage.ts', name: 'Hook para imágenes migradas' },

    // Servicios
    { type: 'file', path: 'src/lib/ai-services.ts', name: 'Servicios de IA (N8N)' },
    { type: 'file', path: 'src/lib/integrations.ts', name: 'Integraciones con servicios externos' },

    // Configuración
    { type: 'file', path: '.env.local', name: 'Variables de entorno' },
    { type: 'file', path: 'package.json', name: 'Configuración de dependencias' },

    // Scripts de prueba
    { type: 'file', path: 'scripts/test-rebecca-ai.js', name: 'Script de prueba de IA' },
    { type: 'file', path: 'scripts/test-supabase-connection.js', name: 'Script de prueba de Supabase' },
    { type: 'file', path: 'scripts/activate-rebecca-workflows.js', name: 'Script de activación de workflows' }
  ];

  let passed = 0;
  let failed = 0;

  console.log('📋 Verificando archivos y directorios:\n');

  for (const check of checks) {
    const exists = check.type === 'dir' 
      ? checkDirectoryExists(check.path)
      : checkFileExists(check.path);

    if (exists) {
      console.log(`✅ ${check.name}`);
      console.log(`   📁 ${check.path}\n`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      console.log(`   📁 ${check.path} (NO ENCONTRADO)\n`);
      failed++;
    }
  }

  // Verificar dependencias en package.json
  console.log('📦 Verificando dependencias:\n');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const requiredDeps = [
      'react',
      'next',
      'lucide-react',
      '@supabase/supabase-js',
      'next-themes'
    ];

    for (const dep of requiredDeps) {
      if (packageJson.dependencies[dep] || packageJson.devDependencies?.[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep] || packageJson.devDependencies[dep]}`);
        passed++;
      } else {
        console.log(`❌ ${dep}: NO INSTALADO`);
        failed++;
      }
    }
  } catch (error) {
    console.log('❌ Error leyendo package.json:', error.message);
    failed++;
  }

  // Resumen
  console.log('\n📊 Resumen de la verificación:');
  console.log(`✅ Elementos correctos: ${passed}`);
  console.log(`❌ Elementos faltantes: ${failed}`);
  console.log(`📈 Porcentaje de completitud: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 ¡Estructura del proyecto completamente configurada!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Integrar ChatbotIntegration en el layout principal');
    console.log('2. Configurar webhooks específicos en N8N');
    console.log('3. Implementar sistema RAG');
    console.log('4. Poblar base de conocimientos');
  } else {
    console.log('\n⚠️ Hay elementos faltantes que necesitan atención.');
  }
}

// Ejecutar verificación
testChatbotStructure().then(() => {
  console.log('\n🏁 Verificación de estructura completada');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});