# Configuración de N8N para WilkieDevs

## 🎯 Objetivo

Configurar workflows de N8N con el tag **WILKIEDEVS** siguiendo las mejores prácticas del video de referencia: [N8N Best Practices](https://www.youtube.com/watch?v=SF8Ddp0RaF8&t=9331s)

## 🏷️ Estándares de Workflows

### Tags Obligatorios
Todos los workflows deben incluir:
- `WILKIEDEVS` (tag principal)
- `chatbot` (para workflows del chatbot)
- `rebecca` (específico para el chatbot Rebecca)

### Esquema de Colores
```javascript
const WILKIEDEVS_COLORS = {
  primary: '#3B82F6',      // Azul principal
  secondary: '#1E293B',    // Gris oscuro
  accent: '#F59E0B',       // Amarillo/naranja
  success: '#10B981',      // Verde
  warning: '#F59E0B',      // Amarillo
  error: '#EF4444',        // Rojo
  info: '#06B6D4'          // Cyan
}
```

### Nomenclatura de Nodos
- **Webhooks**: 🤖 Rebecca Webhook
- **Validación**: ✅ Validar Datos
- **Procesamiento**: 🔄 Procesar Lead
- **Base de datos**: 💾 Guardar en Supabase
- **Notificaciones**: 🔔 Notificar Equipo
- **Email**: 📧 Email de Bienvenida
- **Esperas**: ⏰ Esperar 2h
- **Respuestas**: 📤 Respuesta

## 🚀 Configuración Automática

### 1. Ejecutar Script de Configuración
```bash
cd wilkiedevs
node scripts/setup-n8n-workflows.js
```

### 2. Verificar Workflows Creados
Los siguientes workflows serán creados automáticamente:

#### 📊 Rebecca Chatbot - Lead Capture
- **Webhook**: `/webhook/rebecca-lead-capture`
- **Función**: Captura y procesa leads del chatbot
- **Características**:
  - Validación de datos
  - Lead scoring automático
  - Notificaciones a Slack
  - Email de bienvenida
  - Seguimiento automático

#### 🧠 Rebecca - Response Intelligence
- **Webhook**: `/webhook/rebecca-response`
- **Función**: Sistema inteligente de respuestas
- **Características**:
  - Detección de intención
  - Respuestas contextuales
  - Acciones sugeridas
  - Análisis de confianza

## 🔧 Configuración Manual

### 1. Credenciales Requeridas

#### Supabase
```json
{
  "name": "Supabase WilkieDevs",
  "type": "supabaseApi",
  "data": {
    "host": "https://ziglshuhhtsthwedrους.supabase.co",
    "serviceRole": "tu_service_role_key"
  }
}
```

#### SMTP (Email)
```json
{
  "name": "SMTP WilkieDevs",
  "type": "smtp",
  "data": {
    "user": "info@wilkie-design.com",
    "password": "tu_app_password",
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false
  }
}
```

#### Slack (Notificaciones)
```json
{
  "name": "Slack WilkieDevs",
  "type": "slackApi",
  "data": {
    "accessToken": "xoxb-tu-slack-token"
  }
}
```

### 2. Variables de Entorno N8N
```env
# En tu instancia de N8N
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=tu_password_seguro

# Webhook Security
N8N_WEBHOOK_TUNNEL_URL=https://n8n.wilkiedevs.com
N8N_WEBHOOK_URL=https://n8n.wilkiedevs.com

# Database
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=tu_db_password

# Encryption
N8N_ENCRYPTION_KEY=tu_encryption_key_32_chars
```

## 📋 Workflows Disponibles

### 1. Lead Capture & Qualification
- **ID**: `rebecca-lead-capture`
- **Trigger**: Webhook desde chatbot
- **Acciones**:
  - Validar datos del lead
  - Calcular score automático
  - Guardar en Supabase
  - Notificar equipo si es lead de calidad
  - Enviar email de bienvenida
  - Programar seguimiento

### 2. Response Intelligence
- **ID**: `rebecca-response-intelligence`
- **Trigger**: Webhook desde chatbot
- **Acciones**:
  - Analizar mensaje del usuario
  - Detectar intención
  - Generar respuesta contextual
  - Sugerir acciones
  - Retornar respuesta estructurada

### 3. Email Marketing Sequences
- **ID**: `email-marketing-sequences`
- **Trigger**: Cambio de estado de lead
- **Acciones**:
  - Secuencia de bienvenida (5 emails)
  - Nurturing campaign (8 emails)
  - Seguimiento personalizado

### 4. Quote Generation & Follow-up
- **ID**: `quote-generation-followup`
- **Trigger**: Solicitud de cotización
- **Acciones**:
  - Calcular precio automático
  - Generar PDF personalizado
  - Enviar por email
  - Programar seguimientos

## 🔍 Testing y Debugging

### 1. Probar Webhooks
```bash
# Test Lead Capture
curl -X POST https://n8n.wilkiedevs.com/webhook/rebecca-lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "projectType": "website",
    "message": "Test message",
    "intent": "pricing"
  }'

# Test Response Intelligence
curl -X POST https://n8n.wilkiedevs.com/webhook/rebecca-response \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Quiero saber precios",
    "context": {}
  }'
```

### 2. Verificar Logs
```bash
# Ver logs de N8N
docker logs n8n-container

# Ver execuciones en N8N UI
# https://n8n.wilkiedevs.com/executions
```

### 3. Monitoreo de Workflows
- **Execuciones exitosas**: Verde ✅
- **Execuciones fallidas**: Rojo ❌
- **Execuciones en progreso**: Azul 🔄

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Webhook no responde
```bash
# Verificar que N8N esté ejecutándose
curl https://n8n.wilkiedevs.com/healthz

# Verificar workflow activo
curl -H "X-N8N-API-KEY: tu_api_key" \
  https://n8n.wilkiedevs.com/api/v1/workflows
```

#### 2. Error de credenciales
- Verificar credenciales en N8N UI
- Probar conexión individual
- Revisar permisos de API keys

#### 3. Error de Supabase
- Verificar URL y keys
- Comprobar permisos de tabla
- Revisar políticas RLS

#### 4. Error de Email
- Verificar credenciales SMTP
- Comprobar límites de envío
- Revisar configuración de seguridad

## 📊 Métricas y Analytics

### KPIs a Monitorear
- **Tasa de conversión de leads**: Visitantes → Leads
- **Tiempo de respuesta**: Chatbot → Respuesta
- **Score promedio de leads**: Calidad de leads
- **Tasa de apertura de emails**: Engagement
- **Tiempo de seguimiento**: Velocidad de respuesta

### Dashboards Recomendados
1. **Lead Analytics**: Conversiones, scores, fuentes
2. **Chatbot Performance**: Respuestas, intenciones, satisfacción
3. **Email Marketing**: Aperturas, clicks, conversiones
4. **Workflow Health**: Execuciones, errores, tiempos

## 🔄 Mantenimiento

### Tareas Semanales
- [ ] Revisar execuciones fallidas
- [ ] Verificar métricas de performance
- [ ] Actualizar templates de email
- [ ] Revisar logs de errores

### Tareas Mensuales
- [ ] Optimizar workflows lentos
- [ ] Actualizar respuestas del chatbot
- [ ] Revisar y mejorar lead scoring
- [ ] Backup de configuraciones

### Actualizaciones
- Mantener N8N actualizado
- Revisar nuevos nodos disponibles
- Optimizar workflows existentes
- Implementar nuevas funcionalidades

---

**Documentación creada por**: WilkieDevs Team  
**Última actualización**: Enero 2025  
**Versión**: 1.0