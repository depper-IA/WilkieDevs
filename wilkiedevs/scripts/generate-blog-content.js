// Script para generar contenido automático del blog usando N8N
const fs = require('fs');
const path = require('path');

// Webhook de N8N para generación de contenido
const CONTENT_GENERATION_WEBHOOK = 'https://n8n.wilkiedevs.com/webhook/generate-content';
const BLOG_WORKFLOW_ID = 'content-generation-workflow';

// Temas para generar contenido automático
const contentTopics = [
  {
    title: 'Automatización de Procesos Empresariales con N8N',
    category: 'automatizacion',
    keywords: ['n8n', 'automatización', 'workflows', 'procesos', 'empresas'],
    description: 'Guía completa sobre cómo automatizar procesos empresariales usando N8N',
    targetAudience: 'empresarios y desarrolladores',
    contentType: 'tutorial'
  },
  {
    title: 'Desarrollo Web Moderno: Tendencias 2025',
    category: 'desarrollo-web',
    keywords: ['desarrollo web', 'react', 'nextjs', 'tendencias', '2025'],
    description: 'Las últimas tendencias en desarrollo web para el 2025',
    targetAudience: 'desarrolladores y empresarios',
    contentType: 'articulo'
  },
  {
    title: 'Inteligencia Artificial en el Desarrollo Web',
    category: 'ia',
    keywords: ['inteligencia artificial', 'chatbots', 'ai', 'desarrollo', 'web'],
    description: 'Cómo integrar IA en proyectos de desarrollo web',
    targetAudience: 'desarrolladores y empresarios tech',
    contentType: 'guia'
  },
  {
    title: 'SEO Técnico para Desarrolladores',
    category: 'seo',
    keywords: ['seo', 'optimización', 'google', 'posicionamiento', 'técnico'],
    description: 'Guía técnica de SEO para desarrolladores web',
    targetAudience: 'desarrolladores web',
    contentType: 'tutorial'
  },
  {
    title: 'E-commerce: Mejores Prácticas 2025',
    category: 'ecommerce',
    keywords: ['ecommerce', 'tienda online', 'ventas', 'conversión', 'ux'],
    description: 'Mejores prácticas para crear tiendas online exitosas',
    targetAudience: 'empresarios y desarrolladores',
    contentType: 'articulo'
  }
];

// Función para generar contenido usando N8N
async function generateContentWithN8N(topicData) {
  try {
    console.log(`📝 Generando contenido: ${topicData.title}`);
    
    const requestData = {
      topic: topicData.title,
      category: topicData.category,
      keywords: topicData.keywords,
      description: topicData.description,
      targetAudience: topicData.targetAudience,
      contentType: topicData.contentType,
      company: 'WilkieDevs',
      tone: 'profesional pero accesible',
      language: 'español',
      wordCount: 1500,
      includeImages: true,
      includeCTA: true
    };

    const response = await fetch(CONTENT_GENERATION_WEBHOOK, {
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
    console.log(`✅ Contenido generado: ${topicData.title}`);
    return result;

  } catch (error) {
    console.error(`❌ Error generando ${topicData.title}:`, error.message);
    return null;
  }
}

// Función para crear contenido placeholder
async function createPlaceholderContent(topicData) {
  try {
    console.log(`📝 Creando placeholder para: ${topicData.title}`);
    
    const slug = topicData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const placeholderContent = `---
title: "${topicData.title}"
description: "${topicData.description}"
category: "${topicData.category}"
keywords: [${topicData.keywords.map(k => `"${k}"`).join(', ')}]
author: "WilkieDevs Team"
date: "${new Date().toISOString().split('T')[0]}"
image: "/images/blog/${slug}-hero.webp"
status: "draft"
---

# ${topicData.title}

*Contenido generándose automáticamente...*

## Introducción

Este artículo sobre **${topicData.title.toLowerCase()}** está siendo generado automáticamente por nuestro sistema de IA. 

**Audiencia objetivo:** ${topicData.targetAudience}

**Palabras clave:** ${topicData.keywords.join(', ')}

## Contenido Principal

El contenido completo se generará automáticamente una vez que el workflow de N8N esté configurado correctamente.

### Temas a cubrir:

${topicData.keywords.map(keyword => `- ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`).join('\n')}

## Conclusión

Este contenido será completado automáticamente por nuestro sistema de generación de contenido con IA.

---

*Artículo generado automáticamente por WilkieDevs - ${new Date().toLocaleDateString()}*
`;

    // Crear directorio de blog si no existe
    const blogDir = path.join(__dirname, '..', 'content', 'blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    // Guardar archivo markdown
    const filePath = path.join(blogDir, `${slug}.md`);
    fs.writeFileSync(filePath, placeholderContent);
    
    console.log(`✅ Placeholder creado: ${slug}.md`);
    return filePath;

  } catch (error) {
    console.error(`❌ Error creando placeholder para ${topicData.title}:`, error);
    return null;
  }
}

// Función para verificar si el workflow está activo
async function checkContentWorkflowStatus() {
  try {
    console.log('🔍 Verificando estado del workflow de generación de contenido...');
    
    const testData = {
      test: true,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(CONTENT_GENERATION_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      console.log('✅ Workflow de generación de contenido está activo');
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

// Función para generar imágenes de blog
async function generateBlogImages() {
  console.log('🎨 Generando imágenes para artículos de blog...');
  
  const imageGenerationWebhook = 'https://n8n.wilkiedevs.com/webhook/generate-image';
  
  for (const topic of contentTopics) {
    const slug = topic.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    try {
      const imageData = {
        prompt: `Professional blog header image for article about: ${topic.title}. Modern, clean design, technology theme, professional lighting, 16:9 aspect ratio, ${topic.category} related imagery`,
        filename: `${slug}-hero.webp`,
        category: 'blog',
        alt_text: `${topic.title} - WilkieDevs Blog`,
        style: 'professional-blog-header',
        dimensions: '1200x630'
      };

      const response = await fetch(imageGenerationWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(imageData)
      });

      if (response.ok) {
        console.log(`✅ Imagen generada para: ${topic.title}`);
      } else {
        console.log(`❌ Error generando imagen para: ${topic.title}`);
      }

    } catch (error) {
      console.error(`❌ Error generando imagen para ${topic.title}:`, error.message);
    }

    // Pausa entre generaciones
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Función principal
async function generateBlogContent() {
  console.log('🚀 Iniciando generación de contenido del blog...\n');

  // Verificar estado del workflow
  const workflowActive = await checkContentWorkflowStatus();
  
  if (!workflowActive) {
    console.log('\n🔧 INSTRUCCIONES PARA ACTIVAR EL WORKFLOW:');
    console.log('1. Crea un workflow en N8N para generación de contenido');
    console.log('2. Configura el webhook: generate-content');
    console.log('3. Integra con OpenAI/GPT para generación de texto');
    console.log('4. Configura respuesta en formato markdown');
    console.log('5. Ejecuta este script nuevamente\n');
    
    console.log('📝 Mientras tanto, creando placeholders...\n');
  }

  let generated = 0;
  let placeholders = 0;
  let failed = 0;

  // Generar contenido
  for (const topicData of contentTopics) {
    const slug = topicData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Verificar si el contenido ya existe
    const contentPath = path.join(__dirname, '..', 'content', 'blog', `${slug}.md`);
    if (fs.existsSync(contentPath)) {
      console.log(`⏭️  Ya existe: ${topicData.title}`);
      continue;
    }

    if (workflowActive) {
      // Intentar generar con N8N
      const result = await generateContentWithN8N(topicData);
      if (result) {
        generated++;
        
        // Guardar contenido generado
        const contentDir = path.join(__dirname, '..', 'content', 'blog');
        if (!fs.existsSync(contentDir)) {
          fs.mkdirSync(contentDir, { recursive: true });
        }
        
        fs.writeFileSync(
          path.join(contentDir, `${slug}.md`),
          result.content || result.markdown || result.text
        );
      } else {
        // Si falla N8N, crear placeholder
        const placeholder = await createPlaceholderContent(topicData);
        if (placeholder) {
          placeholders++;
        } else {
          failed++;
        }
      }
    } else {
      // Crear placeholder si workflow no está activo
      const placeholder = await createPlaceholderContent(topicData);
      if (placeholder) {
        placeholders++;
      } else {
        failed++;
      }
    }

    // Pausa entre generaciones
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Generar imágenes para el blog
  await generateBlogImages();

  console.log('\n📊 RESUMEN:');
  console.log(`📝 Artículos generados con IA: ${generated}`);
  console.log(`📄 Placeholders creados: ${placeholders}`);
  console.log(`❌ Fallos: ${failed}`);
  console.log(`📁 Total procesados: ${contentTopics.length}`);

  if (placeholders > 0) {
    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('1. Configura el workflow de N8N para generación de contenido');
    console.log('2. Ejecuta este script nuevamente para generar contenido real');
    console.log('3. Los placeholders se reemplazarán automáticamente');
  }

  console.log('\n✨ Proceso completado!');
  console.log(`📁 Contenido guardado en: content/blog/`);
}

// Ejecutar
generateBlogContent().catch(console.error);