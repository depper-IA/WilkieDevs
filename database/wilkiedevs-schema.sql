-- WilkieDevs Database Schema
-- Tablas específicas para el sitio web WilkieDevs

-- Tabla para leads capturados del sitio
CREATE TABLE IF NOT EXISTS wilkiedevs_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    service_interest TEXT,
    source VARCHAR(100) DEFAULT 'website',
    message TEXT,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para cotizaciones generadas
CREATE TABLE IF NOT EXISTS wilkiedevs_quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES wilkiedevs_leads(id),
    project_type VARCHAR(100) NOT NULL, -- 'wordpress', 'loveable', 'custom', 'automation'
    requirements JSONB,
    estimated_cost DECIMAL(10,2),
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
    project_end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para contenido automatizado
CREATE TABLE IF NOT EXISTS wilkiedevs_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'blog', 'instagram', 'facebook', 'twitter'
    title VARCHAR(500),
    content TEXT NOT NULL,
    platform VARCHAR(50),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    hashtags TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs del sistema
CREATE TABLE IF NOT EXISTS wilkiedevs_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'debug'
    message TEXT NOT NULL,
    context JSONB,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuraciones del sitio
CREATE TABLE IF NOT EXISTS wilkiedevs_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_email ON wilkiedevs_leads(email);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_status ON wilkiedevs_leads(status);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_leads_created_at ON wilkiedevs_leads(created_at);

CREATE INDEX IF NOT EXISTS idx_wilkiedevs_quotes_lead_id ON wilkiedevs_quotes(lead_id);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_quotes_status ON wilkiedevs_quotes(status);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_quotes_project_type ON wilkiedevs_quotes(project_type);

CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_type ON wilkiedevs_content(type);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_published ON wilkiedevs_content(published);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_content_scheduled_date ON wilkiedevs_content(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_wilkiedevs_logs_level ON wilkiedevs_logs(level);
CREATE INDEX IF NOT EXISTS idx_wilkiedevs_logs_created_at ON wilkiedevs_logs(created_at);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wilkiedevs_leads_updated_at BEFORE UPDATE ON wilkiedevs_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wilkiedevs_quotes_updated_at BEFORE UPDATE ON wilkiedevs_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wilkiedevs_sales_updated_at BEFORE UPDATE ON wilkiedevs_sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wilkiedevs_settings_updated_at BEFORE UPDATE ON wilkiedevs_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuraciones iniciales
INSERT INTO wilkiedevs_settings (key, value, description) VALUES
('site_name', '"WilkieDevs"', 'Nombre del sitio web'),
('contact_email', '"info@wilkiedevs.com"', 'Email de contacto principal'),
('n8n_webhook_url', '""', 'URL del webhook de N8N para automatizaciones'),
('chatbot_enabled', 'true', 'Estado del chatbot'),
('auto_content_enabled', 'true', 'Generación automática de contenido habilitada')
ON CONFLICT (key) DO NOTHING;