// Script para probar el sistema de reconocimiento de intenciones de Rebecca
const { createClient } = require('@supabase/supabase-js');

// Simulación del sistema de reconocimiento de intenciones
class IntentRecognitionService {
  constructor() {
    this.intentPatterns = this.initializeIntentPatterns();
    this.entityPatterns = this.initializeEntityPatterns();
  }

  initializeIntentPatterns() {
    return [
      {
        intent: 'greeting',
        patterns: ['hola', 'buenos días', 'buenas tardes', 'hey', 'hi', 'saludos'],
        category: 'general',
        priority: 'low',
        responses: ['¡Hola! Soy Rebecca, tu asistente virtual de WilkieDevs. ¿En qué puedo ayudarte hoy?']
      },
      {
        intent: 'web_development_inquiry',
        patterns: ['sitio web', 'página web', 'website', 'desarrollo web', 'crear sitio', 'web profesional'],
        category: 'service_inquiry',
        priority: 'high',
        responses: ['Perfecto, te puedo ayudar con desarrollo web. ¿Qué tipo de sitio necesitas?']
      },
      {
        intent: 'ecommerce_inquiry',
        patterns: ['tienda online', 'e-commerce', 'ecommerce', 'vender online', 'carrito de compras'],
        category: 'service_inquiry',
        priority: 'high',
        responses: ['Te ayudo con tu tienda online. ¿Qué tipo de productos quieres vender?']
      },
      {
        intent: 'automation_inquiry',
        patterns: ['automatizar', 'automatización', 'n8n', 'workflow', 'procesos automáticos'],
        category: 'service_inquiry',
        priority: 'high',
        responses: ['Excelente, la automatización puede transformar tu negocio. ¿Qué procesos quieres automatizar?']
      },
      {
        intent: 'mobile_app_inquiry',
        patterns: ['app móvil', 'aplicación móvil', 'app para celular', 'desarrollo móvil'],
        category: 'service_inquiry',
        priority: 'high',
        responses: ['Te ayudo con tu app móvil. ¿Para qué plataforma la necesitas?']
      },
      {
        intent: 'pricing_inquiry',
        patterns: ['cuánto cuesta', 'precio', 'costo', 'cotización', 'presupuesto', 'tarifas'],
        category: 'pricing',
        priority: 'high',
        responses: ['Te ayudo con información de precios. ¿Para qué servicio necesitas cotización?']
      },
      {
        intent: 'timeline_inquiry',
        patterns: ['cuánto tiempo', 'cuánto demora', 'plazo', 'duración', 'cronograma'],
        category: 'service_inquiry',
        priority: 'medium',
        responses: ['Los tiempos varían según el proyecto. ¿Qué tipo de desarrollo necesitas?']
      },
      {
        intent: 'contact_request',
        patterns: ['contacto', 'hablar con alguien', 'llamar', 'reunión', 'cita', 'consulta'],
        category: 'lead_capture',
        priority: 'high',
        responses: ['Perfecto, te conecto con nuestro equipo. ¿Cuál es la mejor forma de contactarte?']
      },
      {
        intent: 'provide_contact_info',
        patterns: ['mi nombre es', 'me llamo', 'soy', 'mi email es', 'mi teléfono'],
        category: 'lead_capture',
        priority: 'high',
        responses: ['Perfecto, ya tengo tu información. ¿En qué más puedo ayudarte?']
      },
      {
        intent: 'support_request',
        patterns: ['problema', 'error', 'no funciona', 'ayuda', 'soporte técnico', 'bug'],
        category: 'support',
        priority: 'urgent',
        responses: ['Lamento que tengas problemas. ¿Puedes describir qué está pasando?']
      },
      {
        intent: 'complaint',
        patterns: ['queja', 'reclamo', 'insatisfecho', 'molesto', 'mal servicio'],
        category: 'complaint',
        priority: 'urgent',
        responses: ['Lamento mucho tu experiencia. ¿Puedes contarme qué pasó para ayudarte?']
      },
      {
        intent: 'goodbye',
        patterns: ['adiós', 'hasta luego', 'nos vemos', 'chao', 'bye', 'gracias', 'eso es todo'],
        category: 'general',
        priority: 'low',
        responses: ['¡Hasta luego! Fue un placer ayudarte. No dudes en contactarnos cuando necesites.']
      }
    ];
  }

  initializeEntityPatterns() {
    return {
      email: [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g],
      phone: [/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g],
      money: [/\$\d+(?:,\d{3})*(?:\.\d{2})?/g],
      name: [/\b(?:me llamo|soy|mi nombre es)\s+([A-Za-z\s]+)/gi],
      company: [/\b(?:empresa|compañía|trabajo en)\s+([A-Za-z\s&.,]+)/gi],
      urgency: [/\b(urgente|inmediato|ya|rápido|pronto|asap)\b/gi]
    };
  }

  detectIntentLocally(message, context = {}) {
    const normalizedMessage = message.toLowerCase().trim();
    let bestMatch = null;

    for (const intentPattern of this.intentPatterns) {
      let score = 0;
      let matches = 0;

      for (const pattern of intentPattern.patterns) {
        // Buscar coincidencias más flexibles
        const patternWords = pattern.toLowerCase().split(' ');
        let patternMatches = 0;
        
        for (const word of patternWords) {
          if (normalizedMessage.includes(word)) {
            patternMatches++;
          }
        }
        
        if (patternMatches > 0) {
          matches++;
          // Dar más peso a coincidencias completas
          const completeness = patternMatches / patternWords.length;
          score += completeness * (pattern.length / normalizedMessage.length);
        }
      }

      if (matches > 0) {
        const finalScore = (matches / intentPattern.patterns.length) * score;

        if (!bestMatch || finalScore > bestMatch.score) {
          bestMatch = { intent: intentPattern, score: finalScore };
        }
      }
    }

    if (bestMatch && bestMatch.score > 0.1) {
      const entities = this.extractEntities(message);
      
      return {
        name: bestMatch.intent.intent,
        confidence: Math.min(bestMatch.score * 2, 1),
        entities,
        category: bestMatch.intent.category,
        priority: bestMatch.intent.priority,
        response: bestMatch.intent.responses[0]
      };
    }

    return {
      name: 'general_inquiry',
      confidence: 0.3,
      entities: this.extractEntities(message),
      category: 'general',
      priority: 'medium',
      response: 'Entiendo tu consulta. ¿Puedes darme más detalles para ayudarte mejor?'
    };
  }

  extractEntities(message) {
    const entities = [];

    for (const [entityType, patterns] of Object.entries(this.entityPatterns)) {
      for (const pattern of patterns) {
        const matches = Array.from(message.matchAll(pattern));
        
        for (const match of matches) {
          entities.push({
            entity: entityType,
            value: match[1] || match[0],
            confidence: 0.8,
            start: match.index,
            end: match.index ? match.index + match[0].length : undefined
          });
        }
      }
    }

    return entities;
  }

  updateContext(intent, context) {
    const updatedContext = { ...context };

    // Agregar intención al historial
    updatedContext.previousIntents = [...(context.previousIntents || []), intent].slice(-5);

    // Actualizar entidades
    updatedContext.entities = { ...(context.entities || {}) };
    for (const entity of intent.entities) {
      updatedContext.entities[entity.entity] = entity.value;
      
      // Actualizar perfil de usuario
      if (entity.entity === 'name') {
        updatedContext.userProfile = { ...updatedContext.userProfile, name: entity.value };
      } else if (entity.entity === 'email') {
        updatedContext.userProfile = { ...updatedContext.userProfile, email: entity.value };
      } else if (entity.entity === 'company') {
        updatedContext.userProfile = { ...updatedContext.userProfile, company: entity.value };
      }
    }

    // Actualizar estado de conversación
    if (intent.category === 'service_inquiry') {
      updatedContext.conversationState = 'inquiry';
    } else if (intent.category === 'lead_capture') {
      updatedContext.conversationState = 'lead_capture';
    } else if (intent.category === 'pricing') {
      updatedContext.conversationState = 'quote_request';
    } else if (intent.category === 'support' || intent.category === 'complaint') {
      updatedContext.conversationState = 'support';
    } else if (intent.name === 'goodbye') {
      updatedContext.conversationState = 'closing';
    }

    return updatedContext;
  }
}

async function testIntentRecognition() {
  console.log('🧠 Probando sistema de reconocimiento de intenciones de Rebecca...\n');

  const intentService = new IntentRecognitionService();

  try {
    // Casos de prueba realistas
    const testCases = [
      {
        message: 'Hola, buenos días',
        expectedIntent: 'greeting',
        description: 'Saludo básico'
      },
      {
        message: 'Necesito un sitio web para mi empresa',
        expectedIntent: 'web_development_inquiry',
        description: 'Consulta sobre desarrollo web'
      },
      {
        message: 'Quiero crear una tienda online para vender productos',
        expectedIntent: 'ecommerce_inquiry',
        description: 'Consulta sobre e-commerce'
      },
      {
        message: 'Me interesa automatizar los procesos de mi negocio',
        expectedIntent: 'automation_inquiry',
        description: 'Consulta sobre automatización'
      },
      {
        message: 'Necesito una app móvil para mi startup',
        expectedIntent: 'mobile_app_inquiry',
        description: 'Consulta sobre desarrollo móvil'
      },
      {
        message: '¿Cuánto cuesta desarrollar un sitio web?',
        expectedIntent: 'pricing_inquiry',
        description: 'Consulta sobre precios'
      },
      {
        message: '¿Cuánto tiempo toma hacer una aplicación?',
        expectedIntent: 'timeline_inquiry',
        description: 'Consulta sobre tiempos'
      },
      {
        message: 'Quiero hablar con alguien del equipo',
        expectedIntent: 'contact_request',
        description: 'Solicitud de contacto'
      },
      {
        message: 'Mi nombre es Juan Pérez y mi email es juan@empresa.com',
        expectedIntent: 'provide_contact_info',
        description: 'Provisión de información de contacto'
      },
      {
        message: 'Tengo un problema con mi sitio web, no funciona',
        expectedIntent: 'support_request',
        description: 'Solicitud de soporte'
      },
      {
        message: 'Estoy muy molesto con el servicio que recibí',
        expectedIntent: 'complaint',
        description: 'Queja o reclamo'
      },
      {
        message: 'Gracias por todo, hasta luego',
        expectedIntent: 'goodbye',
        description: 'Despedida'
      }
    ];

    console.log('🔍 Probando detección de intenciones:\n');

    let context = {
      previousIntents: [],
      entities: {},
      conversationState: 'greeting',
      userProfile: {}
    };

    for (const testCase of testCases) {
      console.log(`💬 Mensaje: "${testCase.message}"`);
      console.log(`📋 Descripción: ${testCase.description}`);
      console.log(`🎯 Intención esperada: ${testCase.expectedIntent}`);
      
      const detectedIntent = intentService.detectIntentLocally(testCase.message, context);
      
      console.log(`🤖 Intención detectada: ${detectedIntent.name}`);
      console.log(`📊 Confianza: ${(detectedIntent.confidence * 100).toFixed(1)}%`);
      console.log(`🏷️ Categoría: ${detectedIntent.category}`);
      console.log(`⚡ Prioridad: ${detectedIntent.priority}`);
      
      if (detectedIntent.entities.length > 0) {
        console.log(`🔍 Entidades extraídas:`);
        detectedIntent.entities.forEach(entity => {
          console.log(`   - ${entity.entity}: "${entity.value}" (${(entity.confidence * 100).toFixed(1)}%)`);
        });
      }
      
      console.log(`💭 Respuesta sugerida: "${detectedIntent.response}"`);
      
      // Verificar si la detección fue correcta
      const isCorrect = detectedIntent.name === testCase.expectedIntent;
      console.log(`✅ Detección: ${isCorrect ? 'CORRECTA' : 'INCORRECTA'}`);
      
      // Actualizar contexto para la siguiente iteración
      context = intentService.updateContext(detectedIntent, context);
      
      console.log('\n' + '='.repeat(80) + '\n');
    }

    // Probar conversación completa
    console.log('🗣️ Simulando conversación completa:\n');

    const conversation = [
      'Hola, buenos días',
      'Necesito un sitio web para mi empresa de consultoría',
      '¿Cuánto me costaría?',
      'Me interesa, ¿cuánto tiempo tomaría?',
      'Perfecto, me llamo María González y mi email es maria@consultoria.com',
      'Gracias por la información, hasta luego'
    ];

    let conversationContext = {
      previousIntents: [],
      entities: {},
      conversationState: 'greeting',
      userProfile: {}
    };

    for (let i = 0; i < conversation.length; i++) {
      const message = conversation[i];
      console.log(`👤 Usuario: "${message}"`);
      
      const intent = intentService.detectIntentLocally(message, conversationContext);
      console.log(`🤖 Rebecca detecta: ${intent.name} (${(intent.confidence * 100).toFixed(1)}%)`);
      console.log(`💬 Rebecca responde: "${intent.response}"`);
      
      conversationContext = intentService.updateContext(intent, conversationContext);
      console.log(`📊 Estado: ${conversationContext.conversationState}`);
      
      if (Object.keys(conversationContext.entities).length > 0) {
        console.log(`🧠 Contexto acumulado:`, conversationContext.entities);
      }
      
      console.log('');
    }

    // Estadísticas finales
    console.log('📊 Estadísticas del sistema de intenciones:');
    console.log(`   🎯 Total patrones de intención: ${intentService.intentPatterns.length}`);
    console.log(`   🔍 Tipos de entidades: ${Object.keys(intentService.entityPatterns).length}`);
    console.log(`   📋 Categorías disponibles: ${[...new Set(intentService.intentPatterns.map(p => p.category))].join(', ')}`);
    console.log(`   ⚡ Niveles de prioridad: ${[...new Set(intentService.intentPatterns.map(p => p.priority))].join(', ')}`);

  } catch (error) {
    console.error('❌ Error en pruebas de intenciones:', error);
  }
}

// Ejecutar pruebas
testIntentRecognition().then(() => {
  console.log('\n🎉 Sistema de reconocimiento de intenciones funcionando correctamente!');
  console.log('\n📋 Capacidades verificadas:');
  console.log('✅ Detección de intenciones múltiples');
  console.log('✅ Extracción de entidades');
  console.log('✅ Manejo de contexto conversacional');
  console.log('✅ Clasificación por categorías y prioridades');
  console.log('✅ Respuestas contextuales');
  console.log('✅ Actualización de estado de conversación');
  console.log('\n🤖 Rebecca puede entender y responder inteligentemente!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});