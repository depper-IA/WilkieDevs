# API Reference - WilkieDevs Platform

## Endpoints Disponibles

### 🎯 Leads API

#### POST /api/leads
Crear un nuevo lead en el sistema.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "phone": "+57 300 123 4567",
  "company": "Empresa XYZ",
  "projectType": "ecommerce",
  "budgetRange": "5000-10000",
  "message": "Necesito una tienda online",
  "source": "chatbot"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-del-lead",
    "score": 85,
    "status": "new",
    "createdAt": "2025-01-10T10:30:00Z"
  }
}
```

**Códigos de Estado:**
- `201`: Lead creado exitosamente
- `400`: Datos inválidos
- `429`: Rate limit excedido
- `500`: Error interno del servidor

#### GET /api/leads
Obtener lista de leads (requiere autenticación).

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20)
- `status`: Filtrar por estado (new, contacted, qualified, converted)
- `source`: Filtrar por fuente (website, chatbot, form)

**Response:**
```json
{
  "success": true,
  "data": {
    "leads": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### 🤖 N8N Integration API

#### POST /api/n8n/trigger
Disparar workflows de N8N.

**Request Body:**
```json
{
  "workflowId": "lead-capture",
  "data": {
    "leadId": "uuid-del-lead",
    "triggerType": "new_lead",
    "metadata": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "execution-uuid",
    "status": "running"
  }
}
```

#### GET /api/n8n/workflows
Listar workflows disponibles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lead-capture",
      "name": "Lead Capture & Qualification",
      "active": true,
      "description": "Procesa nuevos leads y los califica automáticamente"
    }
  ]
}
```

### 💰 Quotes API

#### POST /api/quotes
Generar cotización automática.

**Request Body:**
```json
{
  "leadId": "uuid-del-lead",
  "projectType": "ecommerce",
  "features": ["payment-gateway", "inventory", "admin-panel"],
  "timeline": "8-weeks",
  "complexity": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "quoteId": "quote-uuid",
    "estimatedCost": 8500,
    "timelineWeeks": 8,
    "pdfUrl": "https://storage.url/quote.pdf"
  }
}
```

## Autenticación

### API Keys
Para endpoints administrativos, usar header de autorización:
```
Authorization: Bearer tu_api_key
```

### Rate Limiting
- **Leads API**: 100 requests/hora por IP
- **N8N API**: 50 requests/hora por API key
- **Quotes API**: 20 requests/hora por IP

## Webhooks

### Lead Created
Se dispara cuando se crea un nuevo lead.

**Payload:**
```json
{
  "event": "lead.created",
  "data": {
    "id": "lead-uuid",
    "email": "email@domain.com",
    "score": 85,
    "source": "chatbot"
  },
  "timestamp": "2025-01-10T10:30:00Z"
}
```

### Quote Generated
Se dispara cuando se genera una cotización.

**Payload:**
```json
{
  "event": "quote.generated",
  "data": {
    "quoteId": "quote-uuid",
    "leadId": "lead-uuid",
    "amount": 8500,
    "pdfUrl": "https://storage.url/quote.pdf"
  },
  "timestamp": "2025-01-10T10:30:00Z"
}
```

## Códigos de Error

### 400 - Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email es requerido",
    "details": {
      "field": "email",
      "value": null
    }
  }
}
```

### 429 - Rate Limit Exceeded
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas solicitudes. Intenta en 1 hora.",
    "retryAfter": 3600
  }
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor",
    "requestId": "req-uuid"
  }
}
```

## SDKs y Ejemplos

### JavaScript/TypeScript
```typescript
import { WilkieDevsAPI } from '@wilkiedevs/api-client'

const client = new WilkieDevsAPI({
  apiKey: 'tu_api_key',
  baseUrl: 'https://wilkiedevs.com/api'
})

// Crear lead
const lead = await client.leads.create({
  name: 'Juan Pérez',
  email: 'juan@empresa.com',
  projectType: 'ecommerce'
})

// Generar cotización
const quote = await client.quotes.generate({
  leadId: lead.id,
  projectType: 'ecommerce',
  features: ['payment-gateway', 'inventory']
})
```

### cURL Examples
```bash
# Crear lead
curl -X POST https://wilkiedevs.com/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@empresa.com",
    "projectType": "ecommerce"
  }'

# Disparar workflow N8N
curl -X POST https://wilkiedevs.com/api/n8n/trigger \
  -H "Authorization: Bearer tu_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "lead-capture",
    "data": {"leadId": "uuid-del-lead"}
  }'
```

## Testing

### Endpoints de Testing
- `GET /api/health` - Health check
- `POST /api/test-n8n` - Probar conexión N8N
- `GET /api/test-supabase` - Probar conexión Supabase

### Datos de Prueba
```json
{
  "testLead": {
    "name": "Test User",
    "email": "test@wilkiedevs.com",
    "projectType": "landing-page",
    "budgetRange": "1000-3000"
  }
}
```