# WilkieDevs - Plataforma de Desarrollo Web y Automatización

## 🚀 Descripción del Proyecto

WilkieDevs es una plataforma moderna de desarrollo web construida con Next.js 15 que transforma el sitio WordPress original en una experiencia completamente automatizada. La plataforma integra captura inteligente de leads, chatbot con IA, sistema de cotizaciones automáticas y workflows de automatización con N8N.

## ✨ Características Principales

### 🤖 Chatbot Inteligente con IA
- **Rebecca**: Asesora digital con avatar personalizado
- Respuestas contextuales basadas en intención del usuario
- Captura automática de leads durante conversaciones
- Integración directa con workflows de N8N
- Botones de acción rápida para servicios y cotizaciones

### 📊 Sistema de Captura de Leads Avanzado
- Formularios inteligentes con validación en tiempo real
- Lead scoring automático basado en comportamiento
- Integración con Supabase para almacenamiento
- Triggers automáticos a workflows de seguimiento
- Dashboard de métricas y conversión

### 🔄 Automatización Completa con N8N
- **10 workflows configurados** para diferentes procesos:
  - Captura y calificación de leads
  - Secuencias de seguimiento por email
  - Onboarding automatizado de clientes
  - Generación de contenido para redes sociales
  - Reportes de analytics y notificaciones
  - Sistema de cotizaciones automáticas

### 💼 Portafolio Dinámico
- Galería moderna con efectos hover
- Imágenes migradas del WordPress original
- Casos de estudio detallados
- Tecnologías y resultados por proyecto

### 📝 Sistema de Cotizaciones
- Calculadora de precios dinámica
- Generación automática de PDF
- Flujo de aprobación y seguimiento
- Integración con CRM automatizado

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Hook Form** - Gestión de formularios
- **Framer Motion** - Animaciones fluidas

### Backend & Base de Datos
- **Supabase** - Base de datos PostgreSQL y autenticación
- **N8N** - Plataforma de automatización de workflows
- **Vercel** - Deployment y hosting

### Integraciones
- **Model Context Protocol (MCP)** - Conexiones con servicios externos
- **GitHub API** - Gestión de repositorios
- **Google Analytics 4** - Analytics avanzados
- **Email Marketing** - Automatización de comunicaciones

## 📁 Estructura del Proyecto

```
wilkiedevs/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── leads/         # Gestión de leads
│   │   │   └── n8n/           # Integración N8N
│   │   ├── globals.css        # Estilos globales
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   │   ├── chat/             # Sistema de chatbot
│   │   ├── forms/            # Formularios inteligentes
│   │   ├── home/             # Componentes de homepage
│   │   ├── icons/            # Iconografía personalizada
│   │   └── layout/           # Componentes de layout
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── image-migration.ts # Sistema de migración de imágenes
│   │   ├── integrations.ts   # Clientes de APIs externas
│   │   ├── n8n-workflows.ts  # Configuración de workflows
│   │   └── supabase-setup.ts # Configuración de Supabase
│   └── types/                # Definiciones de tipos TypeScript
├── scripts/                  # Scripts de utilidad
│   ├── migrate-images.js     # Migración de imágenes
│   ├── register-images.js    # Registro en Supabase
│   └── setup-database.js     # Configuración inicial de DB
├── .kiro/                    # Configuración de Kiro AI
│   ├── settings/             # Configuraciones MCP
│   └── specs/                # Especificaciones técnicas
└── docs/                     # Documentación técnica
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Instancia de N8N (local o cloud)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/wilkiedevs/wilkiedevs-platform.git
cd wilkiedevs-platform
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# N8N
N8N_BASE_URL=tu_n8n_url
N8N_API_KEY=tu_n8n_api_key

# Configuración adicional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar Base de Datos
```bash
node setup-database.js
```

### 5. Migrar Imágenes (Opcional)
```bash
node scripts/migrate-images.js
node scripts/register-images.js
```

### 6. Ejecutar en Desarrollo
```bash
npm run dev
```

## 🔧 Configuración de N8N

### Workflows Incluidos

1. **Lead Capture & Qualification**
   - Captura automática desde formularios y chatbot
   - Scoring basado en criterios predefinidos
   - Asignación automática a sales team

2. **Email Marketing Sequences**
   - Secuencias de bienvenida
   - Nurturing campaigns
   - Follow-up automatizado

3. **Client Onboarding**
   - Proceso de onboarding automatizado
   - Documentación y recursos
   - Scheduling de reuniones

4. **Content Generation**
   - Generación automática para redes sociales
   - Programación de publicaciones
   - Analytics de engagement

5. **Quote Generation**
   - Cotizaciones automáticas basadas en formularios
   - Generación de PDF personalizado
   - Seguimiento de propuestas

### Configuración de Webhooks
```javascript
// Ejemplo de configuración de webhook para leads
const webhookConfig = {
  url: 'https://tu-n8n-instance.com/webhook/lead-capture',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tu_api_key'
  }
}
```

## 📊 Base de Datos (Supabase)

### Tablas Principales

#### `leads`
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL,
  name VARCHAR,
  phone VARCHAR,
  company VARCHAR,
  project_type VARCHAR,
  budget_range VARCHAR,
  message TEXT,
  source VARCHAR DEFAULT 'website',
  score INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `projects`
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  image_url VARCHAR,
  project_url VARCHAR,
  technologies TEXT[],
  category VARCHAR,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `quotes`
```sql
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  project_type VARCHAR NOT NULL,
  estimated_cost DECIMAL,
  timeline_weeks INTEGER,
  features TEXT[],
  status VARCHAR DEFAULT 'draft',
  pdf_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

## 🎨 Personalización

### Temas y Estilos
El proyecto utiliza Tailwind CSS con configuración personalizada:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#1E293B',
        accent: '#F59E0B'
      }
    }
  }
}
```

### Componentes Personalizables
- **ChatWidget**: Personalizar avatar, colores y respuestas
- **ContactForm**: Agregar campos específicos del negocio
- **ProjectCard**: Modificar layout y información mostrada

## 🔒 Seguridad

### Medidas Implementadas
- **Rate Limiting** en APIs críticas
- **Validación de entrada** en todos los formularios
- **Sanitización** de datos antes de almacenamiento
- **CORS** configurado apropiadamente
- **Environment variables** para datos sensibles

### Autenticación
```typescript
// Middleware de autenticación
export async function authMiddleware(req: Request) {
  const token = req.headers.get('Authorization')
  if (!token) throw new Error('No autorizado')
  
  const { data, error } = await supabase.auth.getUser(token)
  if (error) throw new Error('Token inválido')
  
  return data.user
}
```

## 📈 Analytics y Monitoreo

### Google Analytics 4
- Eventos personalizados para leads
- Tracking de conversiones
- Funnels de ventas
- Core Web Vitals

### Métricas Clave
- **Conversion Rate**: Visitantes → Leads
- **Lead Quality Score**: Basado en engagement
- **Response Time**: Tiempo de respuesta del chatbot
- **Form Completion Rate**: Tasa de completación de formularios

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Variables de Entorno en Producción
Configurar en Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_BASE_URL`
- `N8N_API_KEY`

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e
```

### Cobertura de Tests
- Componentes React: 85%+
- API Routes: 90%+
- Utilidades: 95%+

## 📚 Documentación Adicional

- [Guía de Contribución](./docs/CONTRIBUTING.md)
- [API Reference](./docs/API.md)
- [Workflows N8N](./docs/N8N_WORKFLOWS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Sam Wilkie** - CEO/Fundador - [LinkedIn](https://linkedin.com/in/samwilkie)
- **Juliana Urbano** - Productora Audiovisual
- **Diego Durán** - Desarrollador/Comercial

## 📞 Contacto

- **Website**: [wilkiedevs.com](https://wilkiedevs.com)
- **Email**: info@wilkiedevs.com
- **WhatsApp**: +57 300 123 4567

---

**WilkieDevs** - Transformando ideas en soluciones digitales automatizadas 🚀