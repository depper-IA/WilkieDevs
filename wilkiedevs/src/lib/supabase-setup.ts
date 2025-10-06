// Script para crear las tablas de WilkieDevs en Supabase
import { supabase } from './integrations';

const createTablesSQL = `
-- Tabla para leads capturados del sitio
CREATE TABLE IF NOT EXISTS wilkiedevs_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  service_interest TEXT,
  source VARCHAR(100), -- 'website', 'chatbot', 'social', etc.
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  score INTEGER DEFAULT 0, -- Lead scoring
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para cotizaciones generadas
CREATE TABLE IF NOT EXISTS wilkiedevs_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES wilkiedevs_leads(id),
  project_type VARCHAR(100) NOT NULL,
  requirements TEXT NOT NULL,
  features JSONB, -- Array of selected features
  base_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  estimated_hours INTEGER,
  pdf_url TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  type VARCHAR(50) NOT NULL, -- 'blog', 'instagram', 'twitter'
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

-- Tabla para logs del sistema
CREATE TABLE IF NOT EXISTS wilkiedevs_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level VARCHAR(20) NOT NULL, -- 'info', 'warn', 'error'
  message TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para gestión de imágenes migradas
CREATE TABLE IF NOT EXISTS wilkiedevs_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL UNIQUE,
  supabase_url TEXT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  alt_text TEXT,
  usage_context VARCHAR(100), -- 'logo', 'hero', 'project', 'avatar', etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_email ON wilkiedevs_leads(email);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_status ON wilkiedevs_leads(status);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_source ON wilkiedevs_leads(source);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_quotes_lead_id ON wilkiedevs_quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_quotes_status ON wilkiedevs_quotes(status);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_type ON wilkiedevs_content(type);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_published ON wilkiedevs_content(status);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_logs_level ON wilkiedevs_logs(level);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_logs_created_at ON wilkiedevs_logs(created_at);

-- RLS (Row Level Security) policies
ALTER TABLE wilkiedevs_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo por ahora, refinar después)
CREATE POLICY "Allow all operations on wilkiedevs_leads" ON wilkiedevs_leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on wilkiedevs_quotes" ON wilkiedevs_quotes FOR ALL USING (true);
CREATE POLICY "Allow all operations on wilkiedevs_sales" ON wilkiedevs_sales FOR ALL USING (true);
CREATE POLICY "Allow all operations on wilkiedevs_content" ON wilkiedevs_content FOR ALL USING (true);
CREATE POLICY "Allow all operations on wilkiedevs_logs" ON wilkiedevs_logs FOR ALL USING (true);
`;

export async function setupSupabaseTables(): Promise<boolean> {
    try {
        console.log('🔧 Configurando tablas de Supabase...');

        // Ejecutar SQL usando el cliente Supabase
        const { error } = await supabase.client.rpc('exec_sql', {
            sql: createTablesSQL
        });

        if (error) {
            console.error('❌ Error creando tablas:', error);
            return false;
        }

        console.log('✅ Tablas de WilkieDevs creadas exitosamente');
        return true;
    } catch (error) {
        console.error('❌ Error de configuración:', error);
        return false;
    }
}

export async function testSupabaseConnection(): Promise<boolean> {
    try {
        console.log('🔍 Probando conexión con Supabase...');

        const isConnected = await supabase.testConnection();

        if (isConnected) {
            console.log('✅ Conexión con Supabase exitosa');
        } else {
            console.log('❌ Error de conexión con Supabase');
        }

        return isConnected;
    } catch (error) {
        console.error('❌ Error probando conexión:', error);
        return false;
    }
}