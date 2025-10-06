#!/usr/bin/env node

/**
 * Script para configurar las tablas del chatbot en Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ziglshuhhtsthwedrous.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const chatbotTables = [
  {
    name: 'conversations',
    sql: `
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        session_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        started_at TIMESTAMP DEFAULT NOW(),
        ended_at TIMESTAMP,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
    `
  },
  {
    name: 'chat_messages',
    sql: `
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
        message_type VARCHAR(50) DEFAULT 'text',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
    `
  },
  {
    name: 'chat_user_profiles',
    sql: `
      CREATE TABLE IF NOT EXISTS chat_user_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_identifier VARCHAR(255) UNIQUE,
        name VARCHAR(255),
        email VARCHAR(255),
        preferences JSONB,
        conversation_count INTEGER DEFAULT 0,
        last_interaction TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_chat_user_profiles_identifier ON chat_user_profiles(user_identifier);
      CREATE INDEX IF NOT EXISTS idx_chat_user_profiles_email ON chat_user_profiles(email);
    `
  },
  {
    name: 'knowledge_documents',
    sql: `
      CREATE TABLE IF NOT EXISTS knowledge_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(255),
        document_type VARCHAR(100),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_knowledge_documents_source ON knowledge_documents(source);
      CREATE INDEX IF NOT EXISTS idx_knowledge_documents_type ON knowledge_documents(document_type);
    `
  },
  {
    name: 'faq_entries',
    sql: `
      CREATE TABLE IF NOT EXISTS faq_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100),
        keywords TEXT[],
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_faq_entries_category ON faq_entries(category);
    `
  },
  {
    name: 'chat_analytics',
    sql: `
      CREATE TABLE IF NOT EXISTS chat_analytics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        timestamp TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_chat_analytics_conversation_id ON chat_analytics(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_chat_analytics_event_type ON chat_analytics(event_type);
    `
  },
  {
    name: 'intent_logs',
    sql: `
      CREATE TABLE IF NOT EXISTS intent_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
        intent_name VARCHAR(100),
        confidence DECIMAL(3,2),
        entities JSONB,
        response_generated TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_intent_logs_conversation_id ON intent_logs(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_intent_logs_intent_name ON intent_logs(intent_name);
    `
  }
];

async function createTable(table) {
  try {
    console.log(`📝 Creando tabla ${table.name}...`);
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: table.sql
    });

    if (error) {
      console.log(`⚠️  Error con RPC para ${table.name}, intentando método alternativo...`);
      // El error es esperado si no tenemos permisos RPC, pero las tablas pueden crearse manualmente
      return false;
    } else {
      console.log(`✅ Tabla ${table.name} configurada`);
      return true;
    }
  } catch (error) {
    console.log(`⚠️  Error creando ${table.name}:`, error.message);
    return false;
  }
}

async function insertSampleData() {
  try {
    console.log('🧪 Insertando datos de prueba...');

    // Crear conversación de prueba
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        session_id: 'test-session-' + Date.now(),
        status: 'active',
        metadata: { source: 'test', userAgent: 'test-script' }
      })
      .select()
      .single();

    if (convError) {
      console.log('❌ Error creando conversación de prueba:', convError.message);
      return false;
    }

    // Crear mensajes de prueba
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert([
        {
          conversation_id: conversation.id,
          content: 'Hola, necesito información sobre sus servicios',
          sender: 'user',
          message_type: 'text'
        },
        {
          conversation_id: conversation.id,
          content: '¡Hola! Soy Rebecca, tu asistente virtual. Te puedo ayudar con información sobre desarrollo web, automatización y más. ¿En qué servicio estás interesado?',
          sender: 'assistant',
          message_type: 'text'
        }
      ]);

    if (msgError) {
      console.log('❌ Error creando mensajes de prueba:', msgError.message);
      return false;
    }

    // Crear entrada FAQ de prueba
    const { error: faqError } = await supabase
      .from('faq_entries')
      .insert({
        question: '¿Qué servicios ofrecen?',
        answer: 'Ofrecemos desarrollo web, automatización con IA, e-commerce, y marketing digital automatizado.',
        category: 'servicios',
        keywords: ['servicios', 'desarrollo', 'automatización', 'web']
      });

    if (faqError) {
      console.log('❌ Error creando FAQ de prueba:', faqError.message);
      return false;
    }

    console.log(`✅ Datos de prueba insertados: ${conversation.id}`);
    return true;

  } catch (error) {
    console.log('❌ Error insertando datos de prueba:', error.message);
    return false;
  }
}

async function main() {
  console.log('🤖 Configurando base de datos del chatbot Rebecca...');

  let tablesCreated = 0;
  let tablesFailed = 0;

  // Crear todas las tablas
  for (const table of chatbotTables) {
    const success = await createTable(table);
    if (success) {
      tablesCreated++;
    } else {
      tablesFailed++;
    }
  }

  if (tablesFailed > 0) {
    console.log('\n⚠️  Algunas tablas necesitan creación manual en Supabase SQL Editor:');
    console.log('\n-- SQL PARA EJECUTAR MANUALMENTE:');
    chatbotTables.forEach(table => {
      console.log(`\n-- Tabla: ${table.name}`);
      console.log(table.sql);
    });
  }

  // Probar inserción de datos
  const dataInserted = await insertSampleData();

  console.log('\n📊 Resumen:');
  console.log(`✅ Tablas creadas: ${tablesCreated}`);
  console.log(`❌ Tablas fallidas: ${tablesFailed}`);
  console.log(`🧪 Datos de prueba: ${dataInserted ? 'Insertados' : 'Fallidos'}`);

  if (tablesCreated > 0 || dataInserted) {
    console.log('\n🎉 Base de datos del chatbot configurada!');
    console.log('🚀 Listo para implementar el sistema de IA y RAG.');
  } else {
    console.log('\n⚠️  Configuración manual requerida en Supabase.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };