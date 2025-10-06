// Script simple para probar Supabase
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ziglshuhhtsthwedrous.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

async function testSupabase() {
  console.log('🔍 Probando conexión Supabase...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Probar conexión básica
    const { data, error } = await supabase
      .from('wilkiedevs_leads')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('⚠️  Tabla wilkiedevs_leads no existe, necesitamos crearla');
      return false;
    } else if (error) {
      console.log('❌ Error:', error.message);
      return false;
    } else {
      console.log('✅ Conexión exitosa, tabla existe');
      return true;
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return false;
  }
}

testSupabase().then(success => {
  if (success) {
    console.log('🎉 Supabase configurado correctamente');
  } else {
    console.log('🔧 Necesitamos configurar las tablas');
  }
});