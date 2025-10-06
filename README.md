# WilkieDevs - Plataforma de Automatización Web

> Sitio web corporativo con automatización inteligente, sistema de cotizaciones y generación de contenido automático.

## 🚀 Descripción del Proyecto

WilkieDevs es una plataforma web moderna que combina servicios de auditoría, desarrollo web y automatización. El sitio incluye:

- **Chatbot Inteligente** para captura de leads 24/7
- **Sistema de Cotizaciones** automático con generación de PDF
- **Blog Monetizable** con SEO automático y Google Ads
- **Generación de Contenido** automático para redes sociales
- **Servicios de Automatización N8N** como producto
- **Integración completa** con Supabase y N8N

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Styling utility-first
- **React Hook Form** - Gestión de formularios
- **Framer Motion** - Animaciones fluidas

### Backend & Database
- **Supabase** - Base de datos PostgreSQL y Auth
- **N8N** - Automatización de workflows
- **Vercel** - Hosting y deployment
- **API Routes** - Backend integrado con Next.js

### Integraciones
- **Google Analytics 4** - Analytics avanzado
- **Google Ads** - Monetización del blog
- **Instagram API** - Publicación automática
- **PDF Generation** - Cotizaciones automáticas

## 📁 Estructura del Proyecto

```
WilkieDEVS/
├── .kiro/                          # Configuración Kiro IDE
│   ├── settings/                   # Configuración MCP
│   └── specs/                      # Especificaciones del proyecto
│       └── wilkiedevs-enhancement/
│           ├── requirements.md     # Requerimientos detallados
│           ├── design.md          # Diseño técnico
│           └── tasks.md           # Plan de implementación
├── wilkiedevs/                    # Aplicación Next.js
│   ├── src/
│   │   ├── app/                   # App Router (Next.js 15)
│   │   ├── components/            # Componentes React
│   │   ├── lib/                   # Utilidades y configuración
│   │   └── types/                 # Tipos TypeScript
│   ├── public/                    # Assets estáticos
│   └── package.json
├── scripts/                       # Scripts de configuración
└── database/                      # Esquemas de base de datos
```

## 🎯 Estado Actual del Proyecto

### ✅ Completado
- [x] Estructura base Next.js + TypeScript + Tailwind
- [x] Configuración de colores corporativos (#A10010, #595959, #61CE70)
- [x] Fuente Roboto configurada
- [x] Layout principal (Header + Footer)
- [x] Página Home con secciones principales
- [x] Sistema de temas claro/oscuro
- [x] Configuración MCP para Supabase y N8N
- [x] Especificación completa (Requirements + Design + Tasks)

### 🚧 En Desarrollo
- [ ] Sistema de chatbot inteligente
- [ ] Calculadora de cotizaciones
- [ ] CMS para blog
- [ ] Generador de contenido automático
- [ ] Integración completa N8N

## 📋 Plan de Implementación

El proyecto sigue un plan de implementación de **40+ tareas** organizadas en **10 fases**:

1. **Infraestructura Base** - Configurar integraciones
2. **Sistema de Leads** - Captura y gestión
3. **Chatbot Inteligente** - IA para conversión
4. **Sistema de Cotizaciones** - Calculadora + PDF
5. **CMS y Blog** - Monetizable con Google Ads
6. **Contenido Automático** - Generación para redes
7. **Servicios N8N** - Portfolio de automatizaciones
8. **Analytics y SEO** - Optimización completa
9. **Deployment** - CI/CD automatizado
10. **Optimización Final** - Performance y monitoreo

Ver detalles completos en: `.kiro/specs/wilkiedevs-enhancement/tasks.md`

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta Supabase
- Instancia N8N (opcional)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/WilkieDevs.git
cd WilkieDevs
```

2. **Instalar dependencias**
```bash
cd wilkiedevs
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔧 Configuración

### Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# N8N (opcional)
N8N_API_URL=tu_n8n_url
N8N_API_KEY=tu_n8n_api_key

# Google Analytics
NEXT_PUBLIC_GA_ID=tu_ga_id

# Otros servicios
OPENAI_API_KEY=tu_openai_key
```

### Base de Datos

Las tablas de Supabase se crean automáticamente con:

```bash
node scripts/setup-supabase.js
```

## 📊 Métricas y Analytics

### Métricas Clave
- **Lead Generation**: Conversión por fuente de tráfico
- **Quote Conversion**: Tasa de cotización → venta
- **Content Performance**: Blog → Lead conversion
- **Automation ROI**: Efectividad de workflows N8N

### Dashboards
- Google Analytics 4 con eventos custom
- Supabase Analytics para base de datos
- Vercel Analytics para performance
- N8N monitoring para automatizaciones

## 🤝 Contribución

### Flujo de Desarrollo

1. **Crear rama feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

2. **Desarrollar y commitear**
```bash
git add .
git commit -m "feat: descripción de la funcionalidad"
```

3. **Push y Pull Request**
```bash
git push origin feature/nueva-funcionalidad
```

### Convenciones de Commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Tareas de mantenimiento

## 📝 Documentación

### Especificaciones Técnicas
- **Requirements**: `.kiro/specs/wilkiedevs-enhancement/requirements.md`
- **Design**: `.kiro/specs/wilkiedevs-enhancement/design.md`
- **Tasks**: `.kiro/specs/wilkiedevs-enhancement/tasks.md`

### APIs y Integraciones
- **Supabase Client**: `src/lib/integrations.ts`
- **N8N Client**: `src/lib/integrations.ts`
- **Tipos TypeScript**: `src/types/`

## 🔒 Seguridad

- **HTTPS** obligatorio en producción
- **Rate limiting** en APIs
- **Validación** de entrada en frontend y backend
- **GDPR compliance** para captura de datos
- **Encriptación** de datos sensibles

## 📈 Roadmap

### Fase 1 (Actual)
- [x] Configuración base
- [ ] Sistema de leads
- [ ] Chatbot básico

### Fase 2 (Próxima)
- [ ] Sistema de cotizaciones
- [ ] CMS básico
- [ ] Integración N8N

### Fase 3 (Futuro)
- [ ] IA avanzada
- [ ] Multi-idioma
- [ ] App móvil

## 📞 Contacto

- **Website**: [wilkiedevs.com](https://wilkiedevs.com)
- **Email**: contacto@wilkiedevs.com
- **GitHub**: [github.com/tu-usuario/WilkieDevs](https://github.com/tu-usuario/WilkieDevs)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ por el equipo WilkieDevs**