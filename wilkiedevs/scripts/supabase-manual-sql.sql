-- SQL para ejecutar manualmente en Supabase SQL Editor
-- Copia y pega este código en https://supabase.com/dashboard/project/ziglshuhhtsthwedrous/sql
-- IMPORTANTE: Usa prefijo wilkiedevs_ para evitar conflictos con otros proyectos

-- 1. Tabla wilkiedevs_content (para contenido automatizado)
CREATE TABLE IF NOT EXISTS wilkiedevs_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'blog', 'instagram', 'twitter', 'linkedin'
    title VARCHAR(500),
    content TEXT NOT NULL,
    excerpt TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    tags TEXT[],
    platform VARCHAR(50),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    published_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft',
    performance_metrics JSONB, -- Views, clicks, engagement
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para wilkiedevs_content
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_type ON wilkiedevs_content(type);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_published ON wilkiedevs_content(status);

-- RLS para wilkiedevs_content
ALTER TABLE wilkiedevs_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_content" ON wilkiedevs_content FOR ALL USING (true);

-- 2. Tabla wilkiedevs_conversations (para conversaciones del chatbot Rebecca)
CREATE TABLE IF NOT EXISTS wilkiedevs_conversations (
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

-- Índices para wilkiedevs_conversations
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_conversations_session_id ON wilkiedevs_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_conversations_user_id ON wilkiedevs_conversations(user_id);

-- RLS para wilkiedevs_conversations
ALTER TABLE wilkiedevs_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_conversations" ON wilkiedevs_conversations FOR ALL USING (true);

-- 3. Tabla wilkiedevs_chat_messages (para mensajes del chatbot Rebecca)
CREATE TABLE IF NOT EXISTS wilkiedevs_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES wilkiedevs_conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
    message_type VARCHAR(50) DEFAULT 'text',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para wilkiedevs_chat_messages
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_chat_messages_conversation_id ON wilkiedevs_chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_chat_messages_created_at ON wilkiedevs_chat_messages(created_at);

-- RLS para wilkiedevs_chat_messages
ALTER TABLE wilkiedevs_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_chat_messages" ON wilkiedevs_chat_messages FOR ALL USING (true);

-- 4. Tabla wilkiedevs_chat_user_profiles (para perfiles de usuarios del chat Rebecca)
CREATE TABLE IF NOT EXISTS wilkiedevs_chat_user_profiles (
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

-- Índices para wilkiedevs_chat_user_profiles
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_chat_user_profiles_identifier ON wilkiedevs_chat_user_profiles(user_identifier);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_chat_user_profiles_email ON wilkiedevs_chat_user_profiles(email);

-- RLS para wilkiedevs_chat_user_profiles
ALTER TABLE wilkiedevs_chat_user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_chat_user_profiles" ON wilkiedevs_chat_user_profiles FOR ALL USING (true);

-- 5. Tabla wilkiedevs_knowledge_documents (para documentos de conocimiento del RAG)
CREATE TABLE IF NOT EXISTS wilkiedevs_knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source VARCHAR(255),
    document_type VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para wilkiedevs_knowledge_documents
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_knowledge_documents_source ON wilkiedevs_knowledge_documents(source);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_knowledge_documents_type ON wilkiedevs_knowledge_documents(document_type);

-- RLS para wilkiedevs_knowledge_documents
ALTER TABLE wilkiedevs_knowledge_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_knowledge_documents" ON wilkiedevs_knowledge_documents FOR ALL USING (true);

-- 6. Tabla wilkiedevs_faq_entries (para preguntas frecuentes de Rebecca)
CREATE TABLE IF NOT EXISTS wilkiedevs_faq_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    keywords TEXT[],
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para wilkiedevs_faq_entries
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_faq_entries_category ON wilkiedevs_faq_entries(category);

-- RLS para wilkiedevs_faq_entries
ALTER TABLE wilkiedevs_faq_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_faq_entries" ON wilkiedevs_faq_entries FOR ALL USING (true);

-- 7. Tabla wilkiedevs_chat_analytics (para analíticas del chatbot Rebecca)
CREATE TABLE IF NOT EXISTS wilkiedevs_chat_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES wilkiedevs_conversations(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Índices para wilkiedevs_chat_analytics
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_chat_analytics_conversation_id ON wilkiedevs_chat_analytics(conversation_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_chat_analytics_event_type ON wilkiedevs_chat_analytics(event_type);

-- RLS para wilkiedevs_chat_analytics
ALTER TABLE wilkiedevs_chat_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_chat_analytics" ON wilkiedevs_chat_analytics FOR ALL USING (true);

-- 8. Tabla wilkiedevs_intent_logs (para logs de intenciones del chatbot Rebecca)
CREATE TABLE IF NOT EXISTS wilkiedevs_intent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES wilkiedevs_conversations(id) ON DELETE CASCADE,
    intent_name VARCHAR(100),
    confidence DECIMAL(3,2),
    entities JSONB,
    response_generated TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para wilkiedevs_intent_logs
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_intent_logs_conversation_id ON wilkiedevs_intent_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_intent_logs_intent_name ON wilkiedevs_intent_logs(intent_name);

-- RLS para wilkiedevs_intent_logs
ALTER TABLE wilkiedevs_intent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on wilkiedevs_intent_logs" ON wilkiedevs_intent_logs FOR ALL USING (true);

-- Verificar que todas las tablas de WilkieDevs se crearon correctamente
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'wilkiedevs_%'
ORDER BY table_name;