// Script para configurar las tablas de WilkieDevs en Supabase
const SUPABASE_URL = 'https://ziglshuhhtsthwedrous.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ2xzaHVoaHRzdGh3ZWRyb3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDczOTcsImV4cCI6MjA3MzUyMzM5N30.X_TT0-sA2y1Z5-BeizOxCMYaZraPM2IQo1-rqDMsF08';

// SQL para crear las tablas de WilkieDevs
const createTablesSQL = `
-- Tabla para leads capturados del sitio
CREATE TABLE IF NOT EXISTS wilkiedevs_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service_interest TEXT,
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para cotizaciones generadas
CREATE TABLE IF NOT EXISTS wilkiedevs_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES wilkiedevs_leads(id),
  project_type VARCHAR(100) NOT NULL,
  requirements TEXT,
  estimated_cost DECIMAL(10,2),
  pdf_url TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para ventas completadas
CREATE TABLE IF NOT EXISTS wilkiedevs_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES wilkiedevs_quotes(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  project_start_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para contenido automatizado
CREATE TABLE IF NOT EXISTS wilkiedevs_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'blog', 'instagram', 'twitter', etc.
  title VARCHAR(500),
  content TEXT NOT NULL,
  platform VARCHAR(50),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs del sistema
CREATE TABLE IF NOT EXISTS wilkiedevs_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level VARCHAR(20) NOT NULL, -- 'info', 'warn', 'error'
  message TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_email ON wilkiedevs_leads(email);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_status ON wilkiedevs_leads(status);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_quotes_lead_id ON wilkiedevs_quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_type ON wilkiedevs_content(type);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_published ON wilkiedevs_content(published);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_logs_level ON wilkiedevs_logs(level);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_logs_created_at ON wilkiedevs_logs(created_at);
`;

async function setupSupabaseTables() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        sql: createTablesSQL
      })
    });

    if (response.ok) {
      console.log('✅ Tablas de WilkieDevs creadas exitosamente en Supabase');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Error creando tablas:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

// Función para probar la conexión
async function testConnection() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/wilkiedevs_leads?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      console.log('✅ Conexión con Supabase exitosa');
      return true;
    } else {
      console.log('❌ Error de conexión con Supabase');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Ejecutar setup
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupSupabaseTables, testConnection };
} else {
  // Ejecutar en browser/node
  testConnection().then(connected => {
    if (connected) {
      setupSupabaseTables();
    }
  });
}