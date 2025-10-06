# Guía de Contribución - WilkieDevs Platform

## 🤝 Bienvenido a WilkieDevs

Gracias por tu interés en contribuir al proyecto WilkieDevs. Esta guía te ayudará a entender cómo puedes participar en el desarrollo de nuestra plataforma.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Features](#solicitar-features)

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de la participación en nuestro proyecto una experiencia libre de acoso para todos, independientemente de la edad, tamaño corporal, discapacidad visible o invisible, etnia, características sexuales, identidad y expresión de género, nivel de experiencia, educación, estatus socioeconómico, nacionalidad, apariencia personal, raza, religión o identidad y orientación sexual.

### Comportamiento Esperado

- Usar un lenguaje acogedor e inclusivo
- Ser respetuoso con diferentes puntos de vista y experiencias
- Aceptar críticas constructivas de manera elegante
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

### Comportamiento Inaceptable

- Uso de lenguaje o imágenes sexualizadas y atención sexual no deseada
- Trolling, comentarios insultantes/despectivos y ataques personales o políticos
- Acoso público o privado
- Publicar información privada de otros sin permiso explícito
- Otra conducta que podría considerarse inapropiada en un entorno profesional

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

Valoramos todos los tipos de contribuciones:

- **🐛 Reportar bugs**: Ayúdanos a identificar y corregir problemas
- **💡 Sugerir features**: Propón nuevas funcionalidades
- **📝 Mejorar documentación**: Ayuda a hacer la documentación más clara
- **🔧 Contribuir código**: Implementa fixes o nuevas features
- **🎨 Mejorar UI/UX**: Propón mejoras de diseño
- **🧪 Escribir tests**: Ayuda a mejorar la cobertura de tests

### Primeros Pasos

1. **Fork el repositorio**
2. **Clona tu fork localmente**
3. **Configura el entorno de desarrollo**
4. **Crea una rama para tu contribución**
5. **Haz tus cambios**
6. **Ejecuta los tests**
7. **Envía un Pull Request**

## ⚙️ Configuración del Entorno

### Prerrequisitos

- **Node.js** 18.0.0 o superior
- **npm** 8.0.0 o superior
- **Git** 2.0.0 o superior

### Instalación

```bash
# 1. Fork y clona el repositorio
git clone https://github.com/tu-usuario/wilkiedevs-platform.git
cd wilkiedevs-platform

# 2. Instala dependencias
npm install

# 3. Copia el archivo de configuración
cp .env.example .env.local

# 4. Configura las variables de entorno
# Edita .env.local con tus credenciales

# 5. Ejecuta el proyecto en desarrollo
npm run dev
```

### Variables de Entorno Requeridas

```env
# Supabase (obligatorio para desarrollo)
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# N8N (opcional para desarrollo)
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=tu_n8n_api_key

# Desarrollo
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Configuración de Base de Datos

```bash
# Ejecutar migraciones de desarrollo
npm run db:setup

# Poblar con datos de prueba
npm run db:seed
```

## 📏 Estándares de Código

### Estructura de Archivos

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (routes)/          # Rutas agrupadas
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Input, etc.)
│   ├── forms/            # Formularios específicos
│   ├── layout/           # Componentes de layout
│   └── [feature]/        # Componentes por feature
├── hooks/                # Custom React hooks
├── lib/                  # Utilidades y configuraciones
├── types/                # Definiciones TypeScript
└── utils/                # Funciones utilitarias
```

### Convenciones de Nomenclatura

#### Archivos y Carpetas
```bash
# Componentes React - PascalCase
ContactForm.tsx
ChatWidget.tsx

# Hooks - camelCase con prefijo 'use'
useMigratedImage.ts
useLeadCapture.ts

# Utilidades - camelCase
formatCurrency.ts
validateEmail.ts

# Tipos - PascalCase con sufijo 'Type'
LeadType.ts
ProjectType.ts

# Constantes - UPPER_SNAKE_CASE
API_ENDPOINTS.ts
DEFAULT_VALUES.ts
```

#### Variables y Funciones
```typescript
// Variables - camelCase
const leadData = {...}
const isLoading = false

// Funciones - camelCase
function handleSubmit() {}
const calculatePrice = () => {}

// Componentes - PascalCase
function ContactForm() {}
const ChatWidget = () => {}

// Tipos e Interfaces - PascalCase
interface LeadData {}
type ProjectStatus = 'active' | 'completed'

// Constantes - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.wilkiedevs.com'
const MAX_RETRY_ATTEMPTS = 3
```

### Estilo de Código

#### TypeScript
```typescript
// ✅ Bueno - Tipos explícitos
interface LeadFormData {
  name: string
  email: string
  projectType: ProjectType
  budget?: BudgetRange
}

function createLead(data: LeadFormData): Promise<Lead> {
  return leadService.create(data)
}

// ❌ Malo - Tipos implícitos
function createLead(data: any) {
  return leadService.create(data)
}
```

#### React Components
```typescript
// ✅ Bueno - Componente funcional con tipos
interface ContactFormProps {
  onSubmit: (data: LeadFormData) => void
  isLoading?: boolean
}

export function ContactForm({ onSubmit, isLoading = false }: ContactFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    projectType: 'website'
  })

  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  )
}

// ❌ Malo - Sin tipos
export function ContactForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({})
  // ...
}
```

#### CSS/Tailwind
```typescript
// ✅ Bueno - Clases organizadas y legibles
<div className="
  flex flex-col items-center justify-center
  w-full max-w-md mx-auto
  p-6 bg-white rounded-lg shadow-lg
  dark:bg-gray-800 dark:shadow-gray-700
">

// ❌ Malo - Clases desordenadas
<div className="flex w-full flex-col bg-white p-6 items-center dark:bg-gray-800 justify-center max-w-md rounded-lg mx-auto shadow-lg dark:shadow-gray-700">
```

### Linting y Formatting

El proyecto usa ESLint y Prettier para mantener consistencia:

```bash
# Verificar linting
npm run lint

# Corregir problemas automáticamente
npm run lint:fix

# Formatear código
npm run format

# Verificar tipos TypeScript
npm run type-check
```

### Configuración ESLint

**.eslintrc.json**:
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

## 🔄 Proceso de Pull Request

### Antes de Enviar

1. **Asegúrate de que tu código pase todos los tests**
```bash
npm run test
npm run lint
npm run type-check
```

2. **Actualiza la documentación si es necesario**

3. **Agrega tests para nuevas funcionalidades**

4. **Verifica que no hay conflictos con main**

### Formato del Pull Request

#### Título
Usa el formato: `tipo(scope): descripción`

```
feat(chatbot): agregar respuestas automáticas basadas en IA
fix(forms): corregir validación de email en ContactForm
docs(api): actualizar documentación de endpoints
```

#### Descripción
```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🔄 Tipo de Cambio
- [ ] Bug fix (cambio que corrige un problema)
- [ ] Nueva feature (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Documentación

## 🧪 Testing
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración agregados/actualizados
- [ ] Tests manuales realizados

## 📋 Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas complejas
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente
```

### Revisión de Código

#### Como Autor
- Responde a comentarios de manera constructiva
- Realiza cambios solicitados promptamente
- Mantén el PR actualizado con main

#### Como Revisor
- Sé constructivo y específico en tus comentarios
- Enfócate en la funcionalidad, legibilidad y mantenibilidad
- Aprueba cuando el código cumple los estándares

### Criterios de Aprobación

Un PR será aprobado cuando:
- ✅ Pase todos los tests automatizados
- ✅ Tenga al menos una aprobación de revisor
- ✅ No tenga conflictos con main
- ✅ Siga las convenciones de código
- ✅ Incluya documentación actualizada
- ✅ Tenga cobertura de tests adecuada

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Verifica que no sea un duplicado**
2. **Reproduce el bug en la última versión**
3. **Recopila información del entorno**

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del problema.

## 🔄 Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hacia '...'
4. Ve el error

## ✅ Comportamiento Esperado
Descripción de lo que esperabas que pasara.

## 📱 Capturas de Pantalla
Si aplica, agrega capturas para explicar el problema.

## 🖥️ Información del Entorno
- OS: [ej. iOS, Windows, Linux]
- Navegador: [ej. Chrome, Safari, Firefox]
- Versión: [ej. 22]
- Dispositivo: [ej. iPhone 12, Desktop]

## 📋 Información Adicional
Cualquier otro contexto sobre el problema.
```

## 💡 Solicitar Features

### Template de Feature Request

```markdown
## 🚀 Feature Request

### 📝 Descripción
Descripción clara de la funcionalidad que te gustaría ver.

### 🎯 Problema que Resuelve
¿Qué problema resuelve esta feature? ¿Por qué es útil?

### 💭 Solución Propuesta
Descripción de cómo te gustaría que funcionara.

### 🔄 Alternativas Consideradas
Otras soluciones o features que has considerado.

### 📋 Información Adicional
Cualquier otro contexto, capturas o ejemplos.
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### Escribir Tests

#### Tests Unitarios
```typescript
// __tests__/utils/formatCurrency.test.ts
import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
  })

  it('should handle zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })
})
```

#### Tests de Componentes
```typescript
// __tests__/components/ContactForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from '@/components/forms/ContactForm'

describe('ContactForm', () => {
  it('should render form fields', () => {
    render(<ContactForm onSubmit={jest.fn()} />)
    
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('should call onSubmit with form data', async () => {
    const mockSubmit = jest.fn()
    render(<ContactForm onSubmit={mockSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Juan Pérez' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Juan Pérez',
      // ...
    })
  })
})
```

## 📚 Recursos Adicionales

### Documentación
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Herramientas Recomendadas
- **VS Code** con extensiones:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - GitLens

### Comunidad
- **Discord**: [Únete a nuestro servidor](https://discord.gg/wilkiedevs)
- **GitHub Discussions**: Para preguntas y discusiones
- **Email**: dev@wilkiedevs.com para consultas específicas

## 🙏 Reconocimientos

Agradecemos a todos los contribuidores que han ayudado a hacer de WilkieDevs una mejor plataforma:

- **Sam Wilkie** - Fundador y arquitecto principal
- **Juliana Urbano** - Diseño y experiencia de usuario
- **Diego Durán** - Desarrollo y testing

---

¡Gracias por contribuir a WilkieDevs! 🚀