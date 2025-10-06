// Script para crear el workflow de Rebecca basado en el JSON proporcionado
const n8nConfig = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.wilkiedevs.com',
  apiKey: process.env.N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NGUxZTYyYi1kY2M0LTRiZGUtOWFjZS02OTBmMjAxMGIyMDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU3NzM2NTI1fQ.ofJd3fVNzbroaMP3Kh9W76u4Ao4yfbCs7uKCA3Q4auU'
};

// Workflow basado en tu JSON pero adaptado para WilkieDevs
const rebeccaWorkflow = {
  "name": "[WILKIEDEVS] Rebecca Chatbot - Complete System",
  "nodes": [
    {
      "parameters": {
        "modelName": "models/gemini-2.0-flash-lite",
        "options": {
          "temperature": 0.2
        }
      },
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "typeVersion": 1,
      "position": [592, 1424],
      "id": "ed1ecd62-8575-4642-8b83-bd359c0dc00a",
      "name": "Google Gemini Chat Model",
      "credentials": {
        "googlePalmApi": {
          "id": "t38zPMWleOvlSpPc",
          "name": "Que movida cu"
        }
      }
    },
    {
      "parameters": {},
      "type": "@n8n/n8n-nodes-langchain.memoryRedisChat",
      "typeVersion": 1.5,
      "position": [1088, 976],
      "id": "d9497905-5faf-489d-a9ac-429b7fa2a3cf",
      "name": "Redis Chat Memory",
      "credentials": {
        "redis": {
          "id": "C5t2uHF2Ai0jH4Vd",
          "name": "Redis account"
        }
      }
    },
    {
      "parameters": {
        "mode": "retrieve-as-tool",
        "tableName": {
          "__rl": true,
          "value": "wilkiedevs_knowledge_documents",
          "mode": "list",
          "cachedResultName": "wilkiedevs_knowledge_documents"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
      "typeVersion": 1.3,
      "position": [1328, 1008],
      "id": "d322874a-9f9b-4d2f-b776-ee7712f59acd",
      "name": "Supabase Vector Store",
      "credentials": {
        "supabaseApi": {
          "id": "bfLKR2L5JcKUgwe3",
          "name": "Supabase account"
        }
      }
    },
    {
      "parameters": {
        "inputText": "={{ $json.chatInput }}",
        "categories": {
          "categories": [
            {
              "category": "consulta_faqs",
              "description": "El usuario pregunta sobre los servicios de WilkieDevs, precios, tiempos, procesos, información general de la empresa. Ejemplos: 'qué servicios ofrecen', 'cuánto cuesta un sitio web', 'cómo trabajan', 'qué incluye el servicio'."
            },
            {
              "category": "captacion_leads",
              "description": "El usuario expresa interés en contratar un servicio, solicitar cotización, quiere automatización, desarrollo web, o está dispuesto a proporcionar sus datos de contacto. Ejemplos: 'necesito un sitio web', 'quiero automatizar procesos', 'me interesan sus servicios', 'pueden enviarme una cotización'."
            },
            {
              "category": "saludos_generales",
              "description": "El usuario inicia la conversación con un saludo general o hace comentarios que no requieren una acción específica. Ejemplos: 'hola', 'qué tal', 'buenos días', 'gracias'."
            }
          ]
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.textClassifier",
      "typeVersion": 1.1,
      "position": [512, 896],
      "id": "9a889554-eade-44ec-935c-e628acb9a4f5",
      "name": "Text Classifier"
    },
    {
      "parameters": {
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "typeVersion": 1.3,
      "position": [240, 912],
      "id": "5c463979-0b2f-4fd1-ba72-12740c95b334",
      "name": "When chat message received",
      "webhookId": "rebecca-wilkiedevs-chat"
    },
    {
      "parameters": {},
      "type": "@n8n/n8n-nodes-langchain.memoryRedisChat",
      "typeVersion": 1.5,
      "position": [912, 1520],
      "id": "a2e58589-3d63-4fa2-a46f-389f0d1c69e4",
      "name": "Redis Chat Memory1",
      "credentials": {
        "redis": {
          "id": "C5t2uHF2Ai0jH4Vd",
          "name": "Redis account"
        }
      }
    },
    {
      "parameters": {
        "mode": "retrieve-as-tool",
        "toolDescription": "Herramienta para buscar información sobre servicios, precios y procesos de WilkieDevs",
        "tableName": {
          "__rl": true,
          "value": "wilkiedevs_knowledge_documents",
          "mode": "list",
          "cachedResultName": "wilkiedevs_knowledge_documents"
        },
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
      "typeVersion": 1.3,
      "position": [1200, 1504],
      "id": "a847f31f-3e4f-4dd1-a9c8-7488be2f0413",
      "name": "Supabase Vector Store1",
      "credentials": {
        "supabaseApi": {
          "id": "bfLKR2L5JcKUgwe3",
          "name": "Supabase account"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "# CONTEXTO\nEres Rebecca, la asistente virtual de WilkieDevs, una agencia experta en desarrollo web, automatización y soluciones tecnológicas. Tu misión es ayudar a los usuarios con información sobre servicios y captar leads interesados.\n\n# REGLA PRINCIPAL\nTu objetivo es proporcionar información precisa sobre los servicios de WilkieDevs y obtener datos de contacto de usuarios interesados.\n\n# DIRECTIVAS\n1. **Usa la herramienta de búsqueda**: Siempre busca información en la base de conocimientos antes de responder sobre servicios, precios o procesos.\n2. **Solicita información clave**: Cuando un usuario exprese interés, solicita amablemente su **nombre**, **email**, y descripción de su **necesidad**.\n3. **Sé específica**: Proporciona información detallada sobre servicios, precios y tiempos cuando esté disponible en la base de conocimientos.\n4. **No inventes**: Nunca inventes precios específicos o detalles técnicos que no estén en la base de conocimientos.\n5. **Captura leads**: Una vez recopilada la información, informa que un especialista se pondrá en contacto pronto.\n\n# SERVICIOS DE WILKIEDEVS\n- Desarrollo Web (sitios corporativos, landing pages)\n- E-commerce (tiendas online completas)\n- Automatización de Procesos (N8N, APIs, workflows)\n- Aplicaciones Móviles (iOS y Android)\n- Consultoría en Transformación Digital\n\n# FECHA Y HORA ACTUAL\nLa fecha y hora actual es: {{$now}}\n\n# EJEMPLO\n- **Usuario:** Necesito un sitio web para mi empresa\n- **Tu acción:** Buscar información sobre desarrollo web y solicitar datos\n- **Respuesta:** ¡Perfecto! Te ayudo con el desarrollo web. Según nuestra información, desarrollamos sitios corporativos profesionales desde $1,500 USD con tiempos de 4-6 semanas. Para darte una cotización personalizada, ¿podrías decirme tu nombre, email y qué tipo de empresa tienes?",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 2.2,
      "position": [912, 1152],
      "id": "7322872f-6fea-4bb1-be09-72ab4e967bce",
      "name": "Captar Leads"
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "# ROL DEL ASISTENTE\nEres Rebecca, asistente de IA profesional para WilkieDevs. Tu misión es asesorar a los clientes con la mayor precisión y profesionalidad posible.\n\n# HERRAMIENTAS\nTienes acceso a una herramienta de búsqueda que contiene información sobre servicios, precios, procesos y FAQs de WilkieDevs.\n\n# DIRECTRICES DE RESPUESTA\n1. **Usa únicamente la herramienta de búsqueda**: Tu única fuente de verdad es la información que te proporcione la herramienta de búsqueda en la base de conocimientos.\n2. **Precisión**: Responde las preguntas de los usuarios de forma concisa y directa, basándote estrictamente en el contenido recuperado.\n3. **No inventes información**: Jamás inventes o infieras información que no esté explícitamente en la base de conocimientos.\n4. **Fuera de dominio**: Si el usuario pregunta algo que no se encuentra en la base de conocimientos, responde amablemente que esa información no está disponible y ofrece conectar con el equipo.\n\n# FECHA Y HORA ACTUAL\nLa fecha y hora actual es: {{$now}}\n\n# EJEMPLO DE INTERACCIÓN\n- **Usuario:** ¿Qué servicios ofrecen?\n- **Tu acción:** Usar la herramienta de búsqueda para buscar \"servicios\".\n- **Respuesta (basada en búsqueda):** Según nuestra información, WilkieDevs ofrece desarrollo web, e-commerce, automatización de procesos, aplicaciones móviles y consultoría en transformación digital.\n\n- **Usuario:** ¿Pueden ayudarme con mi jardín?\n- **Tu acción:** Identificar que la pregunta está fuera del dominio.\n- **Respuesta:** Lo siento, mi especialidad es en servicios tecnológicos de WilkieDevs. Para consultas fuera de nuestros servicios, te recomiendo contactar directamente con nuestro equipo.",
        "options": {}
      },
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 2.2,
      "position": [1008, 736],
      "id": "92d5f9b7-0eae-47ec-9a7a-3c251d3f8cc2",
      "name": "FAQs"
    }
  ],
  "connections": {
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "FAQs",
            "type": "ai_languageModel",
            "index": 0
          },
          {
            "node": "Text Classifier",
            "type": "ai_languageModel",
            "index": 0
          },
          {
            "node": "Captar Leads",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Redis Chat Memory": {
      "ai_memory": [
        [
          {
            "node": "FAQs",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Supabase Vector Store": {
      "ai_tool": [
        [
          {
            "node": "FAQs",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Text Classifier": {
      "main": [
        [
          {
            "node": "FAQs",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Captar Leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "When chat message received": {
      "main": [
        [
          {
            "node": "Text Classifier",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Redis Chat Memory1": {
      "ai_memory": [
        [
          {
            "node": "Captar Leads",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Supabase Vector Store1": {
      "ai_tool": [
        [
          {
            "node": "Captar Leads",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "tags": ["WILKIEDEVS", "REBECCA", "CHATBOT"],
  "active": false,
  "settings": {
    "executionOrder": "v1"
  }
};

async function createRebeccaWorkflow() {
  console.log('🤖 Creando workflow de Rebecca en N8N...\n');

  try {
    // 1. Crear el workflow
    console.log('➕ Creando workflow...');
    const createResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      },
      body: JSON.stringify(rebeccaWorkflow)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Error creando workflow: ${createResponse.status} - ${errorText}`);
    }

    const createdWorkflow = await createResponse.json();
    const workflowId = createdWorkflow.data.id;
    console.log(`✅ Workflow creado exitosamente (ID: ${workflowId})`);

    // 2. Activar el workflow
    console.log('\n🚀 Activando workflow...');
    const activateResponse = await fetch(`${n8nConfig.apiUrl}/api/v1/workflows/${workflowId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': n8nConfig.apiKey
      }
    });

    if (!activateResponse.ok) {
      console.warn('⚠️ No se pudo activar automáticamente el workflow');
      const errorText = await activateResponse.text();
      console.log(`   Error: ${errorText}`);
    } else {
      console.log('✅ Workflow activado exitosamente');
    }

    // 3. Obtener información del webhook
    console.log('\n📡 Información del webhook:');
    const webhookId = 'rebecca-wilkiedevs-chat';
    console.log(`   Webhook ID: ${webhookId}`);
    console.log(`   URL: https://n8n.wilkiedevs.com/webhook/${webhookId}`);

    // 4. Probar el webhook
    console.log('\n🧪 Probando webhook...');
    const testResponse = await fetch(`https://n8n.wilkiedevs.com/webhook/${webhookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatInput: 'Hola Rebecca, ¿qué servicios ofrecen?',
        sessionId: 'test-session-creation',
        userId: 'test-user'
      })
    });

    console.log(`   Status: ${testResponse.status}`);
    
    if (testResponse.ok) {
      const responseData = await testResponse.json();
      console.log('✅ ¡Webhook funcionando correctamente!');
      console.log(`   Respuesta: ${JSON.stringify(responseData, null, 2)}`);
    } else {
      console.log('❌ Webhook no responde aún (puede necesitar unos segundos)');
      const errorText = await testResponse.text();
      console.log(`   Error: ${errorText}`);
    }

    // 5. Actualizar nuestro sistema con el nuevo webhook
    console.log('\n🔧 Actualizando sistema local...');
    console.log(`   Nuevo webhook ID: ${webhookId}`);
    console.log(`   Actualiza el código para usar: https://n8n.wilkiedevs.com/webhook/${webhookId}`);

    return webhookId;

  } catch (error) {
    console.error('❌ Error creando workflow:', error.message);
    throw error;
  }
}

// Ejecutar creación
createRebeccaWorkflow().then((webhookId) => {
  console.log('\n🎉 Workflow de Rebecca creado exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Actualizar el código para usar el nuevo webhook ID');
  console.log('2. Probar el sistema completo');
  console.log('3. Integrar el chatbot en el sitio web');
  console.log(`\n🔗 Webhook URL: https://n8n.wilkiedevs.com/webhook/${webhookId}`);
  process.exit(0);
}).catch(error => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});