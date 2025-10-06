// Script para probar la conexión con Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuración directa de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ziglshuhhtsthwedrous.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    console.log('🔍 Probando conexión con Supabase...');
    
    try {
        // Probar conexión básica
        const { data: testData, error: testError } = await supabase
            .from('wilkiedevs_leads')
            .select('count')
            .limit(1);
        
        if (!testError) {
            console.log('✅ Conexión con Supabase exitosa');
            
            // Verificar tablas existentes
            console.log('\n📋 Verificando tablas existentes...');
            
            const tables = ['wilkiedevs_leads', 'wilkiedevs_quotes', 'wilkiedevs_content', 'wilkiedevs_conversations', 'wilkiedevs_chat_messages', 'wilkiedevs_chat_user_profiles', 'wilkiedevs_knowledge_documents', 'wilkiedevs_faq_entries'];
            
            for (const table of tables) {
                try {
                    const { data, error } = await supabase
                        .from(table)
                        .select('*')
                        .limit(1);
                    
                    if (!error) {
                        const { count } = await supabase
                            .from(table)
                            .select('*', { count: 'exact', head: true });
                        console.log(`✅ Tabla '${table}': ${count || 0} registros`);
                    } else {
                        console.log(`❌ Tabla '${table}': ${error.message}`);
                    }
                } catch (error) {
                    console.log(`❌ Tabla '${table}': Error - ${error.message}`);
                }
            }
            
            // Probar inserción de un lead de prueba
            console.log('\n🧪 Probando inserción de lead de prueba...');
            
            const testLead = {
                name: 'Test Connection',
                email: 'test@connection.com',
                source: 'connection_test',
                status: 'new'
            };
            
            const { data: insertedLead, error: insertError } = await supabase
                .from('wilkiedevs_leads')
                .insert(testLead)
                .select()
                .single();
            
            if (!insertError && insertedLead) {
                console.log('✅ Lead de prueba insertado correctamente:', insertedLead.id);
                
                // Limpiar el lead de prueba
                const { error: deleteError } = await supabase
                    .from('wilkiedevs_leads')
                    .delete()
                    .eq('id', insertedLead.id);
                
                if (!deleteError) {
                    console.log('🧹 Lead de prueba eliminado');
                } else {
                    console.log('⚠️ Error eliminando lead de prueba:', deleteError.message);
                }
            } else {
                console.log('❌ Error insertando lead de prueba:', insertError?.message);
            }
            
        } else {
            console.log('❌ Error de conexión con Supabase:', testError.message);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

// Ejecutar prueba
testSupabaseConnection().then(() => {
    console.log('\n🏁 Prueba de conexión completada');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});