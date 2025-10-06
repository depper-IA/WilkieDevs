// Script para verificar la estructura de la tabla conversations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ziglshuhhtsthwedrous.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConversationsStructure() {
    console.log('🔍 Verificando estructura de la tabla conversations...');
    
    try {
        // Intentar obtener información de la tabla conversations
        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .limit(1);
        
        if (!error) {
            console.log('✅ Tabla conversations existe');
            console.log('📋 Datos de ejemplo:', data);
            
            // Intentar insertar un registro de prueba para ver la estructura
            const testConversation = {
                session_id: 'test-session-' + Date.now(),
                status: 'active'
            };
            
            const { data: insertedData, error: insertError } = await supabase
                .from('conversations')
                .insert(testConversation)
                .select()
                .single();
            
            if (!insertError && insertedData) {
                console.log('✅ Estructura de conversations:');
                console.log('   - ID tipo:', typeof insertedData.id);
                console.log('   - ID valor:', insertedData.id);
                console.log('   - Campos disponibles:', Object.keys(insertedData));
                
                // Limpiar el registro de prueba
                await supabase
                    .from('conversations')
                    .delete()
                    .eq('id', insertedData.id);
                
                console.log('🧹 Registro de prueba eliminado');
            } else {
                console.log('❌ Error insertando en conversations:', insertError?.message);
            }
        } else {
            console.log('❌ Error accediendo a conversations:', error.message);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    }
}

checkConversationsStructure().then(() => {
    console.log('\n🏁 Verificación completada');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});