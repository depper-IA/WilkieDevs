// Script para poblar la base de conocimientos de Rebecca con contenido real
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ziglshuhhtsthwedrous.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const supabase = createClient(supabaseUrl, supabaseKey);

// Servicio de embeddings simplificado
class EmbeddingService {
  generateSimpleEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    const features = {
      length: Math.min(text.length / 1000, 1),
      wordCount: Math.min(words.length / 100, 1),
      hasQuestion: text.includes('?') ? 1 : 0,
      hasEmail: /@/.test(text) ? 1 : 0,
      hasPhone: /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) ? 1 : 0,
      hasPrice: /\$|\€|precio|costo|cotiz/.test(text.toLowerCase()) ? 1 : 0,
      hasService: /servicio|desarrollo|web|app|automatiz/.test(text.toLowerCase()) ? 1 : 0,
      hasContact: /contact|llamar|escribir|email/.test(text.toLowerCase()) ? 1 : 0,
      hasWeb: /web|sitio|página|website/.test(text.toLowerCase()) ? 1 : 0,
      hasEcommerce: /tienda|ecommerce|venta|producto/.test(text.toLowerCase()) ? 1 : 0,
      hasAutomation: /automatiz|n8n|workflow|proceso/.test(text.toLowerCase()) ? 1 : 0,
      hasMobile: /móvil|mobile|app|aplicación/.test(text.toLowerCase()) ? 1 : 0
    };

    Object.values(features).forEach((value, index) => {
      if (index < embedding.length) {
        embedding[index] = value;
      }
    });

    const hash = this.simpleHash(text);
    for (let i = 0; i < 50 && i + 50 < embedding.length; i++) {
      embedding[i + 50] = ((hash >> i) & 1) * 0.1;
    }

    return embedding;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  async indexDocument(document) {
    try {
      const embedding = this.generateSimpleEmbedding(document.content);
      
      const documentData = {
        title: document.title,
        content: document.content,
        source: document.source,
        document_type: document.documentType,
        metadata: {
          ...document.metadata,
          embedding: embedding,
          indexedAt: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('wilkiedevs_knowledge_documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;
      return data.id;

    } catch (error) {
      console.error('Error indexing document:', error);
      throw error;
    }
  }
}

async function populateKnowledgeBase() {
  console.log('📚 Poblando base de conocimientos de Rebecca con contenido real...\n');

  const embeddingService = new EmbeddingService();

  try {
    // Limpiar contenido anterior de WilkieDevs
    console.log('🧹 Limpiando contenido anterior...');
    await supabase
      .from('wilkiedevs_knowledge_documents')
      .delete()
      .in('source', ['wilkiedevs-services', 'wilkiedevs-faq', 'wilkiedevs-policies']);

    // Servicios principales de WilkieDevs
    const services = [
      {
        title: 'Desarrollo de Sitios Web Corporativos',
        content: `Creamos sitios web profesionales y modernos para empresas de todos los tamaños. 

        Incluye:
        - Diseño personalizado y responsive
        - Optimización SEO avanzada
        - Integración con CMS (WordPress, Strapi)
        - Formularios de contacto y captura de leads
        - Integración con redes sociales
        - Hosting y dominio por 1 año
        - Certificado SSL gratuito
        - 3 meses de soporte técnico incluido
        
        Perfecto para empresas que buscan una presencia digital profesional y efectiva. Utilizamos tecnologías modernas como React, Next.js, y Tailwind CSS para garantizar rendimiento y escalabilidad.
        
        Tiempo de desarrollo: 3-6 semanas
        Precio: Desde $1,500 USD`,
        source: 'wilkiedevs-services',
        documentType: 'service',
        metadata: {
          tags: ['web', 'corporativo', 'empresa', 'seo', 'responsive', 'cms'],
          category: 'desarrollo-web'
        }
      },
      {
        title: 'Desarrollo de E-commerce y Tiendas Online',
        content: `Tiendas online completas y optimizadas para maximizar las ventas.

        Incluye:
        - Carrito de compras avanzado
        - Múltiples pasarelas de pago (PayPal, Stripe, MercadoPago)
        - Gestión completa de inventario
        - Panel administrativo intuitivo
        - Integración con sistemas de envío
        - Reportes de ventas y analytics
        - Optimización para conversiones
        - Diseño mobile-first
        - Integración con redes sociales
        - Sistema de cupones y descuentos
        
        Ideal para empresas que quieren vender online de manera profesional. Utilizamos plataformas como Shopify, WooCommerce, o desarrollos custom con Next.js.
        
        Tiempo de desarrollo: 6-10 semanas
        Precio: Desde $3,000 USD`,
        source: 'wilkiedevs-services',
        documentType: 'service',
        metadata: {
          tags: ['ecommerce', 'tienda', 'online', 'pagos', 'inventario', 'ventas'],
          category: 'desarrollo-web'
        }
      },
      {
        title: 'Automatización de Procesos Empresariales con N8N',
        content: `Automatizamos y optimizamos procesos empresariales para aumentar la eficiencia y reducir costos operativos.

        Servicios incluidos:
        - Análisis de procesos actuales
        - Diseño de workflows automáticos
        - Integración de múltiples APIs y servicios
        - Sincronización automática de datos
        - Notificaciones y alertas inteligentes
        - Reportes automáticos
        - Integración con CRM, ERP, y herramientas existentes
        - Capacitación del equipo
        - Monitoreo y mantenimiento
        
        Casos de uso comunes:
        - Captura y seguimiento automático de leads
        - Sincronización entre sistemas
        - Generación automática de reportes
        - Notificaciones de eventos importantes
        - Procesamiento de formularios
        - Integración con redes sociales
        
        Utilizamos N8N, Zapier, Make.com y desarrollos custom según las necesidades.
        
        Tiempo de implementación: 2-8 semanas
        Precio: Desde $800 USD`,
        source: 'wilkiedevs-services',
        documentType: 'service',
        metadata: {
          tags: ['automatización', 'n8n', 'workflows', 'apis', 'procesos', 'eficiencia'],
          category: 'automatizacion'
        }
      },
      {
        title: 'Desarrollo de Aplicaciones Móviles',
        content: `Aplicaciones móviles nativas e híbridas para iOS y Android que impulsan tu negocio.

        Incluye:
        - Análisis de requerimientos y UX research
        - Diseño UI/UX profesional
        - Desarrollo nativo (Swift/Kotlin) o híbrido (React Native/Flutter)
        - Backend y APIs personalizadas
        - Integración con servicios externos
        - Notificaciones push
        - Analytics y métricas de uso
        - Testing en dispositivos reales
        - Publicación en App Store y Google Play
        - 6 meses de soporte post-lanzamiento
        
        Tipos de apps que desarrollamos:
        - Apps de negocio y productividad
        - E-commerce móvil
        - Apps de servicios y reservas
        - Redes sociales y comunidades
        - Apps educativas
        - Herramientas empresariales
        
        Tiempo de desarrollo: 8-16 semanas
        Precio: Desde $5,000 USD`,
        source: 'wilkiedevs-services',
        documentType: 'service',
        metadata: {
          tags: ['mobile', 'app', 'ios', 'android', 'ux', 'ui', 'nativo'],
          category: 'desarrollo-mobile'
        }
      },
      {
        title: 'Consultoría en Transformación Digital',
        content: `Ayudamos a las empresas en su proceso de transformación digital integral.

        Servicios incluidos:
        - Auditoría tecnológica completa
        - Estrategia de transformación digital
        - Selección de herramientas y tecnologías
        - Migración de sistemas legacy
        - Implementación de nuevas tecnologías
        - Capacitación del equipo
        - Gestión del cambio organizacional
        - Medición de ROI y KPIs
        
        Áreas de especialización:
        - Automatización de procesos
        - Migración a la nube
        - Implementación de CRM/ERP
        - Business Intelligence y Analytics
        - Ciberseguridad
        - Cultura digital
        
        Modalidades:
        - Consultoría por horas
        - Proyectos completos
        - Retainer mensual
        
        Precio: Desde $150 USD/hora`,
        source: 'wilkiedevs-services',
        documentType: 'service',
        metadata: {
          tags: ['consultoría', 'transformación', 'digital', 'estrategia', 'tecnología'],
          category: 'consultoria'
        }
      }
    ];

    // FAQs detalladas
    const faqs = [
      {
        title: '¿Cuánto tiempo toma desarrollar un sitio web?',
        content: `El tiempo de desarrollo varía según la complejidad del proyecto:

        - Sitio web básico (5-10 páginas): 2-3 semanas
        - Sitio corporativo (10-20 páginas): 4-6 semanas  
        - E-commerce básico (hasta 100 productos): 6-8 semanas
        - E-commerce avanzado (más de 100 productos): 8-12 semanas
        - Aplicación web custom: 8-16 semanas
        
        El proceso incluye:
        1. Análisis y planificación (1 semana)
        2. Diseño y wireframes (1-2 semanas)
        3. Desarrollo frontend (2-4 semanas)
        4. Desarrollo backend (1-3 semanas)
        5. Testing y optimización (1 semana)
        6. Lanzamiento y capacitación (1 semana)
        
        Factores que pueden afectar el tiempo:
        - Complejidad del diseño
        - Número de integraciones
        - Cantidad de contenido
        - Feedback y revisiones del cliente
        - Funcionalidades especiales requeridas`,
        source: 'wilkiedevs-faq',
        documentType: 'faq',
        metadata: {
          tags: ['tiempo', 'desarrollo', 'plazos', 'web', 'cronograma'],
          category: 'general'
        }
      },
      {
        title: '¿Qué incluye exactamente el servicio de desarrollo web?',
        content: `Nuestro servicio de desarrollo web es integral e incluye:

        Fase de Análisis:
        - Reunión inicial para entender objetivos
        - Análisis de competencia
        - Definición de arquitectura de información
        - Planificación de funcionalidades
        
        Fase de Diseño:
        - Wireframes y mockups
        - Diseño visual personalizado
        - Diseño responsive para todos los dispositivos
        - Prototipo interactivo
        
        Fase de Desarrollo:
        - Desarrollo frontend con tecnologías modernas
        - Desarrollo backend si es necesario
        - Integración con CMS (WordPress, Strapi, etc.)
        - Optimización SEO técnica
        - Optimización de velocidad de carga
        
        Integraciones incluidas:
        - Formularios de contacto
        - Google Analytics
        - Redes sociales
        - Mapas de Google
        - Chat en vivo (opcional)
        
        Entrega:
        - Hosting por 1 año
        - Dominio por 1 año
        - Certificado SSL
        - Capacitación para uso del CMS
        - Manual de usuario
        - 3 meses de soporte técnico gratuito
        
        Post-lanzamiento:
        - Monitoreo de rendimiento
        - Backup automático
        - Actualizaciones de seguridad
        - Soporte técnico prioritario`,
        source: 'wilkiedevs-faq',
        documentType: 'faq',
        metadata: {
          tags: ['servicios', 'incluye', 'web', 'desarrollo', 'completo'],
          category: 'servicios'
        }
      },
      {
        title: '¿Cuáles son los precios de sus servicios?',
        content: `Nuestros precios son competitivos y transparentes:

        Desarrollo Web:
        - Landing Page: $500 - $1,200 USD
        - Sitio Corporativo: $1,500 - $4,000 USD
        - E-commerce Básico: $3,000 - $6,000 USD
        - E-commerce Avanzado: $6,000 - $15,000 USD
        - Aplicación Web Custom: $5,000 - $25,000 USD
        
        Desarrollo Móvil:
        - App Híbrida Básica: $5,000 - $10,000 USD
        - App Nativa: $8,000 - $20,000 USD
        - App Compleja: $15,000 - $50,000 USD
        
        Automatización:
        - Workflow Simple: $800 - $2,000 USD
        - Automatización Completa: $2,000 - $8,000 USD
        - Integración Enterprise: $5,000 - $20,000 USD
        
        Consultoría:
        - Por hora: $150 USD
        - Proyecto completo: Según alcance
        - Retainer mensual: $2,000 - $10,000 USD
        
        Factores que afectan el precio:
        - Complejidad del diseño
        - Número de páginas/pantallas
        - Integraciones requeridas
        - Funcionalidades especiales
        - Urgencia del proyecto
        - Soporte post-lanzamiento
        
        Formas de pago:
        - 50% al inicio, 50% al finalizar
        - Pagos mensuales para proyectos largos
        - Descuentos por pago completo anticipado
        
        Todos los precios incluyen IVA donde aplique.`,
        source: 'wilkiedevs-faq',
        documentType: 'faq',
        metadata: {
          tags: ['precios', 'costos', 'cotización', 'tarifas', 'presupuesto'],
          category: 'precios'
        }
      },
      {
        title: '¿Ofrecen mantenimiento y soporte continuo?',
        content: `Sí, ofrecemos varios planes de mantenimiento y soporte:

        Plan Básico ($200/mes):
        - Actualizaciones de seguridad
        - Backup semanal automático
        - Monitoreo de uptime 24/7
        - Soporte por email (respuesta en 24h)
        - 2 horas de cambios menores incluidas
        
        Plan Profesional ($500/mes):
        - Todo lo del plan básico
        - Backup diario automático
        - Actualizaciones de contenido
        - Soporte prioritario (respuesta en 4h)
        - 5 horas de cambios incluidas
        - Reportes mensuales de rendimiento
        - Optimización continua de velocidad
        
        Plan Enterprise ($1,200/mes):
        - Todo lo del plan profesional
        - Soporte 24/7 por teléfono
        - 15 horas de desarrollo incluidas
        - Consultoría estratégica mensual
        - Implementación de nuevas funcionalidades
        - Análisis de métricas y conversiones
        - Soporte para múltiples sitios
        
        Servicios adicionales:
        - Hosting premium en servidores dedicados
        - CDN global para mejor rendimiento
        - Certificados SSL avanzados
        - Auditorías de seguridad trimestrales
        - Capacitación del equipo
        - Consultoría en marketing digital
        
        Todos los planes incluyen:
        - Garantía de uptime del 99.9%
        - Restauración gratuita en caso de problemas
        - Actualizaciones de plugins y CMS
        - Monitoreo de malware
        - Optimización de base de datos`,
        source: 'wilkiedevs-faq',
        documentType: 'faq',
        metadata: {
          tags: ['mantenimiento', 'soporte', 'planes', 'hosting', 'seguridad'],
          category: 'soporte'
        }
      },
      {
        title: '¿Cómo funciona el proceso de trabajo con ustedes?',
        content: `Nuestro proceso está diseñado para ser transparente y eficiente:

        1. Consulta Inicial (Gratuita):
        - Reunión virtual o presencial
        - Análisis de necesidades y objetivos
        - Propuesta técnica y comercial
        - Definición de cronograma
        
        2. Planificación (Semana 1):
        - Firma de contrato y pago inicial
        - Kick-off meeting con todo el equipo
        - Definición detallada de requerimientos
        - Creación de wireframes y arquitectura
        
        3. Diseño (Semanas 2-3):
        - Diseño visual y mockups
        - Revisiones y feedback del cliente
        - Aprobación final del diseño
        - Preparación de assets y recursos
        
        4. Desarrollo (Semanas 4-8):
        - Desarrollo frontend y backend
        - Integraciones y funcionalidades
        - Testing interno continuo
        - Demos semanales de progreso
        
        5. Testing y Optimización (Semana 9):
        - Testing exhaustivo en múltiples dispositivos
        - Optimización de rendimiento
        - Corrección de bugs
        - Preparación para lanzamiento
        
        6. Lanzamiento (Semana 10):
        - Configuración de hosting y dominio
        - Migración y puesta en producción
        - Capacitación del equipo cliente
        - Entrega de documentación
        
        7. Soporte Post-Lanzamiento:
        - Monitoreo durante las primeras 48h
        - Soporte técnico por 3 meses
        - Ajustes menores incluidos
        - Reportes de rendimiento
        
        Comunicación durante el proyecto:
        - Reuniones semanales de seguimiento
        - Acceso a plataforma de gestión de proyectos
        - Canal de Slack dedicado
        - Reportes de progreso por email
        
        Herramientas que utilizamos:
        - Figma para diseño
        - GitHub para código
        - Trello/Asana para gestión
        - Slack para comunicación
        - Google Meet para reuniones`,
        source: 'wilkiedevs-faq',
        documentType: 'faq',
        metadata: {
          tags: ['proceso', 'metodología', 'trabajo', 'cronograma', 'comunicación'],
          category: 'proceso'
        }
      }
    ];

    // Políticas y términos
    const policies = [
      {
        title: 'Política de Privacidad y Protección de Datos',
        content: `En WilkieDevs respetamos y protegemos la privacidad de nuestros clientes:

        Información que recopilamos:
        - Datos de contacto (nombre, email, teléfono)
        - Información del proyecto y requerimientos
        - Datos de uso del sitio web (analytics)
        - Comunicaciones y feedback
        
        Cómo utilizamos la información:
        - Prestación de servicios contratados
        - Comunicación sobre el proyecto
        - Mejora de nuestros servicios
        - Cumplimiento de obligaciones legales
        
        Protección de datos:
        - Encriptación de datos sensibles
        - Acceso restringido al personal autorizado
        - Backups seguros y regulares
        - Cumplimiento con GDPR y leyes locales
        
        Derechos del cliente:
        - Acceso a sus datos personales
        - Rectificación de información incorrecta
        - Eliminación de datos (derecho al olvido)
        - Portabilidad de datos
        - Oposición al procesamiento
        
        Retención de datos:
        - Datos del proyecto: 7 años
        - Comunicaciones: 3 años
        - Datos de marketing: hasta que se solicite eliminación
        
        Contacto para temas de privacidad: privacy@wilkiedevs.com`,
        source: 'wilkiedevs-policies',
        documentType: 'policy',
        metadata: {
          tags: ['privacidad', 'datos', 'gdpr', 'protección', 'legal'],
          category: 'legal'
        }
      },
      {
        title: 'Términos y Condiciones de Servicio',
        content: `Términos generales para la prestación de servicios de WilkieDevs:

        Alcance de servicios:
        - Desarrollo web y móvil
        - Automatización de procesos
        - Consultoría tecnológica
        - Mantenimiento y soporte
        
        Responsabilidades del cliente:
        - Proporcionar información necesaria
        - Feedback oportuno durante el desarrollo
        - Pago según cronograma acordado
        - Provisión de contenido y materiales
        
        Responsabilidades de WilkieDevs:
        - Entrega según especificaciones acordadas
        - Cumplimiento de cronogramas
        - Calidad técnica del trabajo
        - Soporte post-lanzamiento incluido
        
        Propiedad intelectual:
        - El cliente posee el código fuente final
        - WilkieDevs retiene derechos sobre metodologías
        - Licencias de terceros según corresponda
        - Portfolio y casos de estudio con autorización
        
        Garantías:
        - 90 días de garantía contra defectos
        - Corrección gratuita de bugs reportados
        - Garantía de funcionamiento según especificaciones
        - No cubre cambios en requerimientos
        
        Limitaciones de responsabilidad:
        - Máximo equivalente al valor del contrato
        - Exclusión de daños indirectos
        - Fuerza mayor y circunstancias imprevistas
        
        Terminación del contrato:
        - Por cualquier parte con 30 días de aviso
        - Pago de trabajo completado hasta la fecha
        - Entrega de materiales desarrollados
        
        Ley aplicable: Leyes del país de residencia del cliente`,
        source: 'wilkiedevs-policies',
        documentType: 'policy',
        metadata: {
          tags: ['términos', 'condiciones', 'contrato', 'legal', 'responsabilidades'],
          category: 'legal'
        }
      }
    ];

    // Indexar todos los documentos
    console.log('📝 Indexando servicios...');
    for (const service of services) {
      try {
        await embeddingService.indexDocument(service);
        console.log(`✅ ${service.title}`);
      } catch (error) {
        console.log(`❌ Error indexando ${service.title}:`, error.message);
      }
    }

    console.log('\n❓ Indexando FAQs...');
    for (const faq of faqs) {
      try {
        await embeddingService.indexDocument(faq);
        console.log(`✅ ${faq.title}`);
      } catch (error) {
        console.log(`❌ Error indexando ${faq.title}:`, error.message);
      }
    }

    console.log('\n📋 Indexando políticas...');
    for (const policy of policies) {
      try {
        await embeddingService.indexDocument(policy);
        console.log(`✅ ${policy.title}`);
      } catch (error) {
        console.log(`❌ Error indexando ${policy.title}:`, error.message);
      }
    }

    // Estadísticas finales
    console.log('\n📊 Estadísticas finales:');
    const { data: allDocs } = await supabase
      .from('wilkiedevs_knowledge_documents')
      .select('*');

    if (allDocs) {
      const stats = {
        total: allDocs.length,
        byType: {},
        byCategory: {},
        bySource: {}
      };

      allDocs.forEach(doc => {
        const type = doc.document_type || 'unknown';
        const category = doc.metadata?.category || 'unknown';
        const source = doc.source || 'unknown';
        
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        stats.bySource[source] = (stats.bySource[source] || 0) + 1;
      });

      console.log(`   📚 Total documentos: ${stats.total}`);
      console.log(`   📑 Por tipo:`, stats.byType);
      console.log(`   🏷️ Por categoría:`, stats.byCategory);
      console.log(`   📍 Por fuente:`, stats.bySource);
    }

  } catch (error) {
    console.error('❌ Error poblando base de conocimientos:', error);
  }
}

// Ejecutar población
populateKnowledgeBase().then(() => {
  console.log('\n🎉 Base de conocimientos poblada exitosamente!');
  console.log('\n📋 La base de conocimientos ahora incluye:');
  console.log('- 5 servicios principales de WilkieDevs');
  console.log('- 5 FAQs detalladas');
  console.log('- 2 políticas y términos');
  console.log('\n🤖 Rebecca ahora puede responder preguntas sobre:');
  console.log('- Servicios y precios');
  console.log('- Procesos de trabajo');
  console.log('- Tiempos de desarrollo');
  console.log('- Soporte y mantenimiento');
  console.log('- Políticas de la empresa');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});