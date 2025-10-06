-- Crear tablas para WilkieDevs en Supabase

-- Tabla para leads
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

-- Tabla para cotizaciones
CREATE TABLE IF NOT EXISTS wilkiedevs_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES wilkiedevs_leads(id),
  project_type VARCHAR(100) NOT NULL,
  requirements TEXT NOT NULL,
  total_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para contenido
CREATE TABLE IF NOT EXISTS wilkiedevs_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500),
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs
CREATE TABLE IF NOT EXISTS wilkiedevs_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE wilkiedevs_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilkiedevs_logs ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo
CREATE POLICY "Allow all on wilkiedevs_leads" ON wilkiedevs_leads FOR ALL USING (true);
CREATE POLICY "Allow all on wilkiedevs_quotes" ON wilkiedevs_quotes FOR ALL USING (true);
CREATE POLICY "Allow all on wilkiedevs_content" ON wilkiedevs_content FOR ALL USING (true);
CREATE POLICY "Allow all on wilkiedevs_logs" ON wilkiedevs_logs FOR ALL USING (true);