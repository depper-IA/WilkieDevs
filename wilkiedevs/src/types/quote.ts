export interface QuoteFormData {
  // Información del cliente
  fullName: string
  email: string
  phone: string
  company: string

  // Detalles del proyecto
  serviceType: string
  selectedPlan: string
  projectTimeline: string
  budget: {
    min: number
    max: number
  }

  // Requerimientos específicos
  requirements: {
    web?: {
      type: 'informativa' | 'ecommerce' | 'aplicacion' | 'landing'
      features: string[]
      design: 'template' | 'custom'
      pages: number
      languages: string[]
      hosting: boolean
    }
    ai?: {
      type: 'chatbot' | 'analisis' | 'vision' | 'custom'
      features: string[]
      dataSource: 'existente' | 'nueva' | 'mixta'
      integration: boolean
    }
    api?: {
      type: 'rest' | 'graphql' | 'websocket'
      endpoints: number
      auth: boolean
      documentation: boolean
      testing: boolean
    }
    automation?: {
      type: 'marketing' | 'ventas' | 'operaciones' | 'custom'
      processes: string[]
      systems: string[]
      frequency: 'diaria' | 'semanal' | 'mensual' | 'tiempo-real'
    }
  }

  // Información adicional
  additionalInfo: string
  attachments?: File[]
  
  // Preferencias de contacto
  preferredContact: 'email' | 'phone' | 'whatsapp'
  timezone: string
  bestTimeToContact?: string
}

export interface QuoteResponse {
  id: string
  createdAt: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  estimatedCost: {
    min: number
    max: number
    currency: string
  }
  estimatedDuration: {
    min: number
    max: number
    unit: 'days' | 'weeks' | 'months'
  }
  nextSteps: string[]
  assignedTo?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface QuoteStep {
  id: string
  title: string
  description: string
  fields: QuoteField[]
  validationSchema: any // Yup schema
}

export interface QuoteField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'file' | 'range'
  placeholder?: string
  options?: {
    value: string | number
    label: string
    description?: string
    icon?: string
  }[]
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  dependsOn?: {
    field: string
    value: any
  }
  tooltip?: string
}