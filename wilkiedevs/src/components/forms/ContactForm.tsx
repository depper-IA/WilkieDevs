'use client'

import { useState } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  budget: string
}

interface FormErrors {
  [key: string]: string
}

const services = [
  'Desarrollo Web',
  'Automatización IA',
  'Apps Móviles',
  'E-commerce',
  'Tours Virtuales 360°',
  'Producción Audiovisual',
  'Consultoría Tech',
  'Marketing Digital'
]

const budgetRanges = [
  'Menos de $1,000 USD',
  '$1,000 - $5,000 USD',
  '$5,000 - $10,000 USD',
  '$10,000 - $25,000 USD',
  'Más de $25,000 USD',
  'Prefiero discutirlo'
]

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    if (!formData.service) {
      newErrors.service = 'Por favor selecciona un servicio'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({}) // Limpiar errores previos

    try {
      // Preparar datos para la API
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        service_interest: formData.service,
        message: formData.message.trim(),
        budget: formData.budget || undefined,
        source: 'contact-form'
      }

      // Enviar a API de leads
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
          budget: ''
        })

        // Mostrar mensaje personalizado si es actualización
        if (result.isUpdate) {
          console.log('Lead actualizado exitosamente')
        }
      } else {
        // Manejar errores específicos de la API
        if (response.status === 429) {
          setErrors({ submit: 'Has enviado demasiadas solicitudes. Por favor espera un minuto antes de intentar de nuevo.' })
        } else if (response.status === 400 && result.errors) {
          // Mostrar errores de validación específicos
          const fieldErrors: FormErrors = {}
          result.errors.forEach((error: string) => {
            if (error.includes('nombre')) fieldErrors.name = error
            else if (error.includes('email')) fieldErrors.email = error
            else if (error.includes('teléfono')) fieldErrors.phone = error
            else fieldErrors.submit = error
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ submit: result.message || 'Error al enviar el formulario. Por favor intenta de nuevo.' })
        }
      }
    } catch (error) {
      console.error('Error enviando formulario:', error)
      setErrors({ 
        submit: 'Error de conexión. Verifica tu internet e intenta de nuevo.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-secondary dark:text-white mb-4">
          ¡Mensaje enviado exitosamente!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Gracias por contactarnos. Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Información personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              dark:bg-gray-800 dark:text-white dark:border-gray-600
              ${errors.name ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="Tu nombre completo"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              dark:bg-gray-800 dark:text-white dark:border-gray-600
              ${errors.email ? 'border-red-500' : 'border-gray-300'}
            `}
            placeholder="tu@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="+57 300 123 4567"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Empresa
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            placeholder="Nombre de tu empresa"
          />
        </div>
      </div>

      {/* Servicio de interés */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Servicio de interés *
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            dark:bg-gray-800 dark:text-white dark:border-gray-600
            ${errors.service ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          <option value="">Selecciona un servicio</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service && <p className="mt-1 text-sm text-red-500">{errors.service}</p>}
      </div>

      {/* Presupuesto */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Presupuesto estimado
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
        >
          <option value="">Selecciona un rango (opcional)</option>
          {budgetRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            dark:bg-gray-800 dark:text-white dark:border-gray-600 resize-none
            ${errors.message ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder="Cuéntanos sobre tu proyecto, objetivos, timeline, o cualquier detalle que consideres importante..."
        />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        <p className="mt-1 text-sm text-gray-500">
          {formData.message.length}/500 caracteres
        </p>
      </div>

      {/* Error de envío */}
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
        </div>
      )}

      {/* Botón de envío */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando mensaje...
            </>
          ) : (
            <>
              Enviar mensaje
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Al enviar este formulario, aceptas que nos pongamos en contacto contigo para discutir tu proyecto.
      </p>
    </form>
  )
}