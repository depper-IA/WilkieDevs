// Script para crear las tablas faltantes en Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ziglshuhhtsthwedrous.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMissingTables() {
    console.log('🔧 Creando tablas faltantes en Supabase...');
    
    // Tabla wilkiedevs_content
    console.log('\n📝 Creando tabla wilkiedevs_content...');
    try {
        const { error: contentError } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS wilkiedevs_content (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    type VARCHAR(50) NOT NULL,
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
                    performance_metrics JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                
                CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_type ON wilkiedevs_content(type);
                CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_published ON wilkiedevs_content(status);
                
                ALTER TABLE wilkiedevs_content ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "Allow all operations on wilkiedevs_content" ON wilkiedevs_content FOR ALL USING (true);
            `
        });
        
        if (contentError) {
            console.log('⚠️ Error con RPC para wilkiedevs_content:', contentError.message);
        } else {
            console.log('✅ Tabla wilkiedevs_content creada');
        }
    } catch (error) {
        console.log('❌ Error creando wilkiedevs_content:', error.message);
    }
    
    // Tabla chat_messages
    console.log('\n📝 Creando tabla chat_messages...');
    try {
        const { error: messagesError } = await supabase.rpc('exec_sql', {
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
                
                ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "Allow all operations on chat_messages" ON chat_messages FOR ALL USING (true);
            `
        });
        
        if (messagesError) {
            console.log('⚠️ Error con RPC para chat_messages:', messagesError.message);
        } else {
            console.log('✅ Tabla chat_messages creada');
        }
    } catch (error) {
        console.log('❌ Error creando chat_messages:', error.message);
    }
    
    // Tabla chat_user_profiles
    console.log('\n📝 Creando tabla chat_user_profiles...');
    try {
        const { error: profilesError } = await supabase.rpc('exec_sql', {
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
                
                ALTER TABLE chat_user_profiles ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "Allow all operations on chat_user_profiles" ON chat_user_profiles FOR ALL USING (true);
            `
        });
        
        if (profilesError) {
            console.log('⚠️ Error con RPC para chat_user_profiles:', profilesError.message);
        } else {
            console.log('✅ Tabla chat_user_profiles creada');
        }
    } catch (error) {
        console.log('❌ Error creando chat_user_profiles:', error.message);
    }
    
    // Verificar tablas creadas
    console.log('\n🔍 Verificando tablas creadas...');
    const tables = ['wilkiedevs_content', 'chat_messages', 'chat_user_profiles'];
    
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(1);
            
            if (!error) {
                console.log(`✅ Tabla '${table}': Accesible`);
            } else {
                console.log(`❌ Tabla '${table}': ${error.message}`);
            }
        } catch (error) {
            console.log(`❌ Tabla '${table}': Error - ${error.message}`);
        }
    }
}

createMissingTables().then(() => {
    console.log('\n🏁 Proceso completado');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});