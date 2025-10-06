// Script para crear tablas en Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://ziglshuhhtsthwedrous.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

async function createTables() {
  console.log('🔧 Configurando base de datos WilkieDevs...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Crear tabla leads
  try {
    console.log('📝 Creando tabla wilkiedevs_leads...');
    const { error: leadsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS wilkiedevs_leads (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          company VARCHAR(255),
          service_interest TEXT,
          source VARCHAR(100),
          status VARCHAR(50) DEFAULT 'new',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE wilkiedevs_leads ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow all on wilkiedevs_leads" ON wilkiedevs_leads;
        CREATE POLICY "Allow all on wilkiedevs_leads" ON wilkiedevs_leads FOR ALL USING (true);
      `
    });
    
    if (leadsError) {
      console.log('⚠️  Error con RPC, intentando método alternativo...');
      
      // Método alternativo: crear tabla directamente
      const { error: createError } = await supabase
        .from('wilkiedevs_leads')
        .select('*')
        .limit(1);
        
      if (createError && createError.code === 'PGRST116') {
        console.log('❌ Tabla no existe y no se puede crear automáticamente');
        console.log('📋 Ejecuta este SQL manualmente en Supabase Dashboard:');
        console.log(`
CREATE TABLE wilkiedevs_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service_interest TEXT,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE wilkiedevs_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on wilkiedevs_leads" ON wilkiedevs_leads FOR ALL USING (true);
        `);
        return false;
      }
    }
    
    console.log('✅ Tabla wilkiedevs_leads configurada');
    
    // Probar inserción de datos de prueba
    console.log('🧪 Probando inserción de datos...');
    const { data: testLead, error: insertError } = await supabase
      .from('wilkiedevs_leads')
      .insert({
        name: 'Test Lead',
        email: 'test@wilkiedevs.com',
        source: 'setup_script'
      })
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Error insertando datos de prueba:', insertError.message);
      return false;
    }
    
    console.log('✅ Datos de prueba insertados:', testLead.id);
    
    // Limpiar datos de prueba
    await supabase
      .from('wilkiedevs_leads')
      .delete()
      .eq('id', testLead.id);
    
    console.log('🎉 Base de datos configurada correctamente!');
    return true;
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
    return false;
  }
}

createTables().then(success => {
  if (success) {
    console.log('\n🚀 ¡Listo para comenzar el desarrollo!');
  } else {
    console.log('\n⚠️  Configuración manual requerida');
  }
});