# N8N Workflows - WilkieDevs Platform

## 🔄 Workflows Configurados

### 1. Lead Capture & Qualification

**ID**: `lead-capture-qualification`
**Trigger**: Webhook desde formularios y chatbot
**Descripción**: Procesa nuevos leads, los califica y asigna automáticamente.

#### Flujo del Workflow:
1. **Webhook Trigger** - Recibe datos del lead
2. **Data Validation** - Valida y limpia los datos
3. **Lead Scoring** - Calcula puntuación basada en criterios
4. **Database Insert** - Guarda en Supabase
5. **Slack Notification** - Notifica al equipo de ventas
6. **Email Sequence** - Inicia secuencia de bienvenida

#### Configuración:
```json
{
  "webhook": {
    "url": "/webhook/lead-capture",
    "method": "POST",
    "authentication": "none"
  },
  "scoring_criteria": {
    "budget_range": {
      "1000-3000": 20,
      "3000-5000": 40,
      "5000-10000": 60,
      "10000+": 80
    },
    "project_type": {
      "landing-page": 30,
      "corporate": 50,
      "ecommerce": 70,
      "custom-app": 90
    },
    "company_size": {
      "startup": 40,
      "small": 60,
      "medium": 80,
      "enterprise": 100
    }
  }
}
```

### 2. Email Marketing Sequences

**ID**: `email-marketing-sequences`
**Trigger**: Lead status change
**Descripción**: Gestiona secuencias automáticas de email marketing.

#### Secuencias Disponibles:

##### Welcome Series (5 emails)
1. **Email 1** - Bienvenida y presentación (inmediato)
2. **Email 2** - Casos de éxito y portafolio (día 2)
3. **Email 3** - Proceso de trabajo (día 5)
4. **Email 4** - Testimonios de clientes (día 8)
5. **Email 5** - Call to action para reunión (día 12)

##### Nurturing Campaign (8 emails)
1. **Email 1** - Tendencias en desarrollo web (semanal)
2. **Email 2** - Tips de optimización (semanal)
3. **Email 3** - Caso de estudio detallado (semanal)
4. **Email 4** - Herramientas recomendadas (semanal)
5. **Email 5** - ROI de automatización (semanal)
6. **Email 6** - Checklist de proyecto (semanal)
7. **Email 7** - Comparativa de tecnologías (semanal)
8. **Email 8** - Propuesta personalizada (semanal)

#### Templates de Email:
```html
<!-- Welcome Email Template -->
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <header style="background: #3B82F6; color: white; padding: 20px; text-align: center;">
    <img src="{{logo_url}}" alt="WilkieDevs" style="height: 40px;">
    <h1>¡Bienvenido a WilkieDevs!</h1>
  </header>
  
  <main style="padding: 30px;">
    <p>Hola {{lead_name}},</p>
    
    <p>Gracias por tu interés en nuestros servicios de desarrollo web. 
    Estamos emocionados de ayudarte a transformar tu idea en una solución digital exitosa.</p>
    
    <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>¿Qué sigue?</h3>
      <ul>
        <li>Revisaremos tu solicitud en las próximas 24 horas</li>
        <li>Te enviaremos una propuesta personalizada</li>
        <li>Programaremos una reunión para discutir detalles</li>
      </ul>
    </div>
    
    <a href="{{calendar_link}}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Programar Reunión
    </a>
  </main>
  
  <footer style="background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280;">
    <p>WilkieDevs - Transformando ideas en soluciones digitales</p>
    <p>Si no deseas recibir estos emails, <a href="{{unsubscribe_link}}">cancela tu suscripción</a></p>
  </footer>
</div>
```

### 3. Client Onboarding Automation

**ID**: `client-onboarding`
**Trigger**: Contract signed / Payment received
**Descripción**: Automatiza el proceso de onboarding de nuevos clientes.

#### Pasos del Onboarding:
1. **Welcome Package** - Envío de documentos y accesos
2. **Project Kickoff** - Programación de reunión inicial
3. **Requirements Gathering** - Formularios de requerimientos
4. **Timeline Setup** - Creación de cronograma en Notion/Asana
5. **Communication Channels** - Setup de Slack/Discord
6. **Progress Tracking** - Configuración de reportes semanales

#### Documentos Automáticos:
- Contrato de servicios
- Guía de onboarding
- Checklist de requerimientos
- Cronograma de proyecto
- Información de contactos

### 4. Content Generation & Social Media

**ID**: `content-generation-social`
**Trigger**: Scheduled (daily/weekly)
**Descripción**: Genera y publica contenido automáticamente en redes sociales.

#### Tipos de Contenido:
1. **Tips de Desarrollo** - Consejos técnicos diarios
2. **Casos de Éxito** - Historias de clientes semanales
3. **Tendencias Tech** - Noticias de la industria
4. **Behind the Scenes** - Contenido del equipo
5. **Promociones** - Ofertas especiales mensuales

#### Plataformas Integradas:
- **Instagram** - Posts e historias
- **LinkedIn** - Artículos profesionales
- **Twitter/X** - Updates rápidos
- **Facebook** - Posts promocionales
- **YouTube** - Videos tutoriales

#### Configuración de Contenido:
```json
{
  "content_calendar": {
    "monday": {
      "type": "tip",
      "platforms": ["linkedin", "twitter"],
      "template": "tip_monday"
    },
    "wednesday": {
      "type": "case_study",
      "platforms": ["instagram", "linkedin"],
      "template": "case_study"
    },
    "friday": {
      "type": "behind_scenes",
      "platforms": ["instagram", "facebook"],
      "template": "team_content"
    }
  },
  "hashtags": {
    "desarrollo_web": ["#DesarrolloWeb", "#WebDevelopment", "#NextJS"],
    "automatizacion": ["#Automatización", "#N8N", "#Workflows"],
    "casos_exito": ["#CasosDeÉxito", "#ClientesWilkie", "#Testimonios"]
  }
}
```

### 5. Quote Generation & Follow-up

**ID**: `quote-generation-followup`
**Trigger**: Quote request from website
**Descripción**: Genera cotizaciones automáticas y gestiona seguimiento.

#### Proceso de Cotización:
1. **Data Collection** - Recopila información del formulario
2. **Price Calculation** - Calcula precio basado en criterios
3. **PDF Generation** - Genera PDF personalizado
4. **Email Delivery** - Envía cotización por email
5. **Follow-up Schedule** - Programa seguimientos automáticos
6. **Conversion Tracking** - Rastrea aceptación/rechazo

#### Criterios de Pricing:
```json
{
  "base_prices": {
    "landing-page": 1500,
    "corporate": 3000,
    "ecommerce": 5000,
    "custom-app": 8000
  },
  "multipliers": {
    "features": {
      "cms": 1.2,
      "ecommerce": 1.5,
      "api_integration": 1.3,
      "custom_design": 1.4,
      "mobile_app": 2.0
    },
    "timeline": {
      "rush": 1.5,
      "normal": 1.0,
      "flexible": 0.9
    },
    "complexity": {
      "simple": 0.8,
      "medium": 1.0,
      "complex": 1.3,
      "enterprise": 1.8
    }
  }
}
```

### 6. Customer Support Automation

**ID**: `customer-support`
**Trigger**: Support ticket creation
**Descripción**: Automatiza respuestas de soporte y escalación.

#### Flujo de Soporte:
1. **Ticket Classification** - Clasifica por tipo y urgencia
2. **Auto-Response** - Respuesta automática inicial
3. **Knowledge Base** - Busca soluciones en KB
4. **Escalation Rules** - Escala según criterios
5. **SLA Tracking** - Monitorea tiempos de respuesta
6. **Satisfaction Survey** - Envía encuesta post-resolución

### 7. Analytics & Reporting

**ID**: `analytics-reporting`
**Trigger**: Scheduled (daily/weekly/monthly)
**Descripción**: Genera reportes automáticos de métricas clave.

#### Reportes Generados:
1. **Daily Dashboard** - Métricas diarias
2. **Weekly Performance** - Resumen semanal
3. **Monthly Business Review** - Análisis mensual
4. **Lead Quality Report** - Análisis de leads
5. **Conversion Funnel** - Métricas de conversión

#### Métricas Tracked:
- Leads generados por fuente
- Tasa de conversión por canal
- Tiempo promedio de respuesta
- Valor promedio de proyecto
- Satisfacción del cliente (NPS)
- ROI de campañas de marketing

### 8. Project Management Integration

**ID**: `project-management`
**Trigger**: Project milestone completion
**Descripción**: Integra con herramientas de gestión de proyectos.

#### Integraciones:
- **Notion** - Documentación y wikis
- **Asana** - Gestión de tareas
- **Slack** - Comunicación del equipo
- **GitHub** - Gestión de código
- **Figma** - Diseños y prototipos

### 9. Invoice & Payment Automation

**ID**: `invoice-payment`
**Trigger**: Project milestone / Payment due
**Descripción**: Automatiza facturación y seguimiento de pagos.

#### Proceso de Facturación:
1. **Invoice Generation** - Genera factura automática
2. **Payment Link** - Crea link de pago seguro
3. **Email Delivery** - Envía factura por email
4. **Payment Reminders** - Recordatorios automáticos
5. **Payment Processing** - Procesa pagos recibidos
6. **Receipt Generation** - Genera recibo automático

### 10. Backup & Monitoring

**ID**: `backup-monitoring`
**Trigger**: Scheduled (hourly/daily)
**Descripción**: Monitorea sistemas y genera backups automáticos.

#### Monitoreo Incluido:
- **Website Uptime** - Disponibilidad del sitio
- **Database Health** - Estado de Supabase
- **API Performance** - Tiempos de respuesta
- **Error Tracking** - Errores y excepciones
- **Security Alerts** - Intentos de acceso sospechosos

## 🛠️ Configuración de Workflows

### Variables de Entorno N8N:
```env
# Supabase
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# Slack
SLACK_WEBHOOK=tu_slack_webhook
SLACK_TOKEN=tu_slack_token

# Social Media
INSTAGRAM_TOKEN=tu_instagram_token
LINKEDIN_TOKEN=tu_linkedin_token
TWITTER_API_KEY=tu_twitter_key
```

### Instalación de Workflows:
```bash
# Importar workflows desde JSON
curl -X POST http://tu-n8n-instance:5678/api/v1/workflows/import \
  -H "Content-Type: application/json" \
  -d @workflows/lead-capture.json

# Activar workflow
curl -X POST http://tu-n8n-instance:5678/api/v1/workflows/1/activate
```

## 📊 Métricas y Monitoreo

### KPIs por Workflow:
- **Lead Capture**: Tasa de conversión, tiempo de procesamiento
- **Email Marketing**: Open rate, click rate, unsubscribe rate
- **Onboarding**: Tiempo de completación, satisfacción
- **Content**: Engagement rate, reach, conversiones
- **Support**: Tiempo de respuesta, resolución, satisfacción

### Alertas Configuradas:
- Workflow failure > 3 veces en 1 hora
- Lead processing time > 5 minutos
- Email bounce rate > 5%
- API response time > 2 segundos
- Database connection errors