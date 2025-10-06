// Script para generar imágenes faltantes usando N8N workflow
const fs = require('fs');
const path = require('path');

// Webhook activo para generación de imágenes con Gemini Nano Banana
const IMAGE_GENERATION_WEBHOOK = 'https://n8n.wilkiedevs.com/webhook/generate-image';

// Imágenes que necesitamos generar
const missingImages = [
    {
        filename: 'case-study-1.webp',
        description: 'Condominio La Mariana - Proyecto de desarrollo web para condominio residencial con sistema de gestión',
        alt: 'Condominio La Mariana - Proyecto WilkieDevs',
        category: 'project'
    },
    {
        filename: 'case-study-2.webp',
        description: 'LW Language School - Plataforma e-learning para escuela de idiomas con sistema de clases virtuales',
        alt: 'LW Language School - Proyecto WilkieDevs',
        category: 'project'
    },
    {
        filename: 'case-study-3.webp',
        description: 'E4U Worldwide Corp - Sitio web corporativo internacional con múltiples idiomas',
        alt: 'E4U Worldwide Corp - Proyecto WilkieDevs',
        category: 'project'
    },
    {
        filename: 'precision-wrapz.webp',
        description: 'Precision Wrapz - E-commerce para empresa de wrapping automotriz con catálogo de servicios',
        alt: 'Precision Wrapz - Proyecto WilkieDevs',
        category: 'project'
    },
    {
        filename: 'grupo-metric.webp',
        description: 'Grupo Metric - Portal corporativo para grupo empresarial con dashboard ejecutivo',
        alt: 'Grupo Metric - Proyecto WilkieDevs',
        category: 'project'
    }
];

// Función para generar imagen usando N8N con Gemini Nano Banana
async function generateImageWithN8N(imageData) {
    try {
        console.log(`🎨 Generando imagen con Gemini Nano Banana: ${imageData.filename}`);

        const requestData = {
            type: imageData.category,
            description: imageData.description,
            filename: imageData.filename,
            alt_text: imageData.alt,
            size: '1024x1024',
            style: 'corporate'
        };

        const response = await fetch(IMAGE_GENERATION_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`✅ Imagen generada con Gemini: ${imageData.filename}`);
        return result;

    } catch (error) {
        console.error(`❌ Error generando ${imageData.filename}:`, error.message);
        return null;
    }
}

// Función para crear imagen placeholder local
async function createPlaceholderImage(imageData) {
    try {
        console.log(`📝 Creando placeholder para: ${imageData.filename}`);

        // Crear SVG placeholder
        const svgContent = `
<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#grad1)"/>
  <text x="600" y="300" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">
    ${imageData.alt}
  </text>
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#E5E7EB">
    WilkieDevs Project
  </text>
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#9CA3AF">
    Imagen generándose automáticamente...
  </text>
</svg>`;

        // Guardar como SVG temporalmente
        const svgPath = path.join(__dirname, '..', 'public', 'images', imageData.filename.replace('.webp', '.svg'));
        fs.writeFileSync(svgPath, svgContent);

        console.log(`✅ Placeholder creado: ${imageData.filename.replace('.webp', '.svg')}`);
        return svgPath;

    } catch (error) {
        console.error(`❌ Error creando placeholder para ${imageData.filename}:`, error);
        return null;
    }
}

// Función para verificar si el workflow está activo
async function checkWorkflowStatus() {
    try {
        console.log('🔍 Verificando estado del workflow de generación de imágenes...');

        const testData = {
            test: true,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(IMAGE_GENERATION_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        if (response.ok) {
            console.log('✅ Workflow de generación de imágenes está activo');
            return true;
        } else {
            console.log(`❌ Workflow inactivo (${response.status})`);
            return false;
        }

    } catch (error) {
        console.log(`❌ Error verificando workflow: ${error.message}`);
        return false;
    }
}

// Función principal
async function generateMissingImages() {
    console.log('🚀 Iniciando generación de imágenes faltantes...\n');

    // Verificar si el directorio de imágenes existe
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Verificar estado del workflow
    const workflowActive = await checkWorkflowStatus();

    if (!workflowActive) {
        console.log('\n🔧 INSTRUCCIONES PARA ACTIVAR EL WORKFLOW:');
        console.log(`1. Abre: https://n8n.wilkiedevs.com/workflow/${WORKFLOW_ID}`);
        console.log('2. Activa el workflow (toggle "Active")');
        console.log('3. Configura el webhook para generación de imágenes');
        console.log('4. Ejecuta este script nuevamente\n');

        console.log('📝 Mientras tanto, creando placeholders...\n');
    }

    let generated = 0;
    let placeholders = 0;
    let failed = 0;

    for (const imageData of missingImages) {
        // Verificar si la imagen ya existe
        const imagePath = path.join(imagesDir, imageData.filename);
        if (fs.existsSync(imagePath)) {
            console.log(`⏭️  Ya existe: ${imageData.filename}`);
            continue;
        }

        if (workflowActive) {
            // Intentar generar con N8N
            const result = await generateImageWithN8N(imageData);
            if (result) {
                generated++;
            } else {
                // Si falla N8N, crear placeholder
                const placeholder = await createPlaceholderImage(imageData);
                if (placeholder) {
                    placeholders++;
                } else {
                    failed++;
                }
            }
        } else {
            // Crear placeholder si workflow no está activo
            const placeholder = await createPlaceholderImage(imageData);
            if (placeholder) {
                placeholders++;
            } else {
                failed++;
            }
        }

        // Pausa entre generaciones
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n📊 RESUMEN:');
    console.log(`🎨 Imágenes generadas con IA: ${generated}`);
    console.log(`📝 Placeholders creados: ${placeholders}`);
    console.log(`❌ Fallos: ${failed}`);
    console.log(`📁 Total procesadas: ${missingImages.length}`);

    if (placeholders > 0) {
        console.log('\n💡 PRÓXIMOS PASOS:');
        console.log('1. Activa el workflow de N8N para generación de imágenes');
        console.log('2. Ejecuta este script nuevamente para generar imágenes reales');
        console.log('3. Los placeholders se reemplazarán automáticamente');
    }

    console.log('\n✨ Proceso completado!');
}

// Ejecutar
generateMissingImages().catch(console.error);