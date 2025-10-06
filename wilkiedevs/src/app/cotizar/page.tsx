'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const services = {
  'landing-page': {
    name: 'Landing Page',
    basePrice: 2000,
    timeline: '2-3 semanas',
    features: [
      'Diseño responsive',
      'Optimización SEO básica',
      'Formulario de contacto',
      'Integración con analytics',
      'Hosting por 1 año'
    ]
  },
  'corporate': {
    name: 'Sitio Corporativo',
    basePrice: 4000,
    timeline: '4-6 semanas',
    features: [
      'Hasta 10 páginas',
      'Panel de administración',
      'Blog integrado',
      'Optimización SEO avanzada',
      'Múltiples formularios',
      'Integración con CRM'
    ]
  },
  'ecommerce': {
    name: 'E-commerce',
    basePrice: 6000,
    timeline: '6-8 semanas',
    features: [
      'Catálogo de productos',
      'Carrito de compras',
      'Pasarela de pagos',
      'Panel de administración',
      'Gestión de inventario',
      'Reportes de ventas'
    ]
  },
  'custom-app': {
    name: 'Aplicación Personalizada',
    basePrice: 10000,
    timeline: '8-12 semanas',
    features: [
      'Desarrollo a medida',
      'Base de datos personalizada',
      'Panel de administración',
      'API REST',
      'Autenticación de usuarios',
      'Integraciones específicas'
    ]
  },
  'automation': {
    name: 'Automatización',
    basePrice: 3000,
    timeline: '3-5 semanas',
    features: [
      'Análisis de procesos',
      'Diseño de workflows',
      'Implementación con n8n',
      'Integraciones múltiples',
      'Capacitación del equipo',
      'Soporte por 3 meses'
    ]
  }
};

const plans = {
  basic: { name: 'Básico', multiplier: 1, features: [] },
  standard: { 
    name: 'Estándar', 
    multiplier: 1.5, 
    features: ['Mantenimiento 3 meses', 'Capacitación incluida', 'Soporte prioritario'] 
  },
  premium: { 
    name: 'Premium', 
    multiplier: 2, 
    features: ['Mantenimiento 6 meses', 'Capacitación avanzada', 'Soporte 24/7', 'Optimizaciones mensuales'] 
  }
};

export default function QuotePage() {
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState('landing-page');
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectDescription: '',
    timeline: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const service = searchParams.get('service');
    const plan = searchParams.get('plan');
    
    if (service && services[service as keyof typeof services]) {
      setSelectedService(service);
    }
    if (plan && plans[plan as keyof typeof plans]) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const currentService = services[selectedService as keyof typeof services];
  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const estimatedPrice = Math.round(currentService.basePrice * currentPlan.multiplier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar a n8n webhook
      const response = await fetch('https://n8n.wilkiedevs.com/webhook/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          projectType: selectedService,
          plan: selectedPlan,
          estimatedPrice,
          service: currentService.name,
          timeline: currentService.timeline
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Error al enviar cotización');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al enviar tu cotización. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Cotización Enviada!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hemos recibido tu solicitud de cotización. Te contactaremos en las próximas 24 horas con una propuesta detallada.
          </p>
          <Link
            href="/"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Solicitar Cotización
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Obtén una cotización personalizada para tu proyecto
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configurador */}
            <div className="space-y-8">
              {/* Selección de Servicio */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Tipo de Proyecto
                </h2>
                <div className="space-y-3">
                  {Object.entries(services).map(([key, service]) => (
                    <label key={key} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="service"
                        value={key}
                        checked={selectedService === key}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Desde ${service.basePrice.toLocaleString()} USD - {service.timeline}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selección de Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Plan de Servicio
                </h2>
                <div className="space-y-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <label key={key} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="plan"
                        value={key}
                        checked={selectedPlan === key}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {plan.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {plan.features.length > 0 ? plan.features.join(', ') : 'Funcionalidades básicas'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Formulario */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Información de Contacto
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción del Proyecto *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                      placeholder="Cuéntanos sobre tu proyecto, objetivos y requerimientos específicos..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Cotización'}
                  </button>
                </form>
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Resumen de Cotización
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CurrencyDollarIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Precio Estimado
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        ${estimatedPrice.toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Tiempo de Desarrollo
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {currentService.timeline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <UserGroupIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Plan Seleccionado
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {currentPlan.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Incluye:
                  </h3>
                  <ul className="space-y-2">
                    {currentService.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {currentPlan.features.map((feature, index) => (
                      <li key={`plan-${index}`} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Nota:</strong> Este es un precio estimado. La cotización final puede variar según los requerimientos específicos de tu proyecto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}