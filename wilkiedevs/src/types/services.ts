export interface ServiceFeature {
  id: string
  name: string
  description: string
  included: boolean
}

export interface ServicePlan {
  id: string
  name: string
  description: string
  price: {
    amount: number
    currency: string
    period?: string
  }
  features: ServiceFeature[]
  recommended?: boolean
}

export interface Service {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  icon: string
  image: string
  features: string[]
  technologies: string[]
  plans: ServicePlan[]
  faqs: {
    question: string
    answer: string
  }[]
}

export interface QuoteField {
  id: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number'
  label: string
  name: string
  placeholder?: string
  options?: {
    value: string
    label: string
    price?: number
  }[]
  required?: boolean
  dependsOn?: {
    field: string
    value: string | string[]
  }
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface QuoteStep {
  id: string
  title: string
  description: string
  fields: QuoteField[]
}

export interface QuoteFormData {
  serviceType: string
  projectDetails: {
    title: string
    description: string
    deadline?: string
    budget?: number
  }
  requirements: {
    features: string[]
    design: {
      type: string
      references?: string[]
    }
    technology: string[]
  }
  clientInfo: {
    name: string
    email: string
    phone?: string
    company?: string
    country: string
  }
}

export interface QuoteResult {
  id: string
  timestamp: string
  serviceType: string
  estimatedPrice: {
    min: number
    max: number
    currency: string
  }
  timeframe: {
    min: number
    max: number
    unit: 'days' | 'weeks' | 'months'
  }
  formData: QuoteFormData
  notes?: string
}

export interface APIIntegration {
  id: string
  name: string
  description: string
  icon: string
  category: string
  basePrice: number
  features: string[]
}

export interface AutomationType {
  id: string
  name: string
  description: string
  icon: string
  benefits: string[]
  useCases: string[]
  integrations: APIIntegration[]
  basePrice: number
}