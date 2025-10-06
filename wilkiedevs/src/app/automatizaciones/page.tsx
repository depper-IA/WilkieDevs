import { Metadata } from 'next';
import Link from 'next/link';
import { 
  CogIcon, 
  BoltIcon, 
  ChartBarIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Automatizaciones - WilkieDevs',
  description: 'Automatiza tus procesos de negocio con n8n, Zapier y soluciones personalizadas. Ahorra tiempo y aumenta la eficiencia.',
};

const automationServices = [
  {
    icon: CogIcon,
    title: "Automatización de Procesos",
    description: "Automatizamos tareas repetitivas para que te enfoques en lo importante",
    features: [
      "Análisis de procesos actuales",
      "Diseño de workflows optimizados",
      "Implementación con n8n/Zapier",
      "Monitoreo y optimización continua"
    ],
    price: "Desde $800 USD"
  },
  {
    icon: BoltIcon,
    title: "Integración de Sistemas",
    description: "Conectamos todas tus herramientas para que trabajen en armonía",
    features: [
      "Integración CRM + Email Marketing",
      "Sincronización de datos",
      "APIs personalizadas",
      "Webhooks y triggers automáticos"
    ],
    price: "Desde $600 USD"
  },
  {
    icon: ChartBarIcon,
    title: "Reportes Automáticos",
    description: "Genera reportes y dashboards automáticos con datos en tiempo real",
    features: [
      "Dashboards personalizados",
      "Reportes programados",
      "Alertas inteligentes",
      "Visualización de KPIs"
    ],
    price: "Desde $500 USD"
  }
];

const automationExamples = [
  {
    title: "Lead Capture Automático",
    description: "Captura leads desde tu sitio web y los envía automáticamente a tu CRM con seguimiento por email.",
    steps: [
      "Formulario web captura lead",
      "Datos se envían a CRM",
      "Email de bienvenida automático",
      "Seguimiento programado",
      "Notificación al equipo de ventas"
    ],
    timesSaved: "5 horas/semana",
    roi: "300%"
  },
  {
    title: "Gestión de Inventario",
    description: "Sincroniza inventario entre tienda online, almacén y contabilidad automáticamente.",
    steps: [
      "Venta registrada en tienda",
      "Inventario actualizado automáticamente",
      "Notificación si stock bajo",
      "Orden de compra generada",
      "Actualización en contabilidad"
    ],
    timesSaved: "10 horas/semana",
    roi: "450%"
  },
  {
    title: "Onboarding de Clientes",
    description: "Automatiza todo el proceso de bienvenida y configuración de nuevos clientes.",
    steps: [
      "Cliente se registra",
      "Email de bienvenida enviado",
      "Cuenta configurada automáticamente",
      "Documentos generados",
      "Seguimiento programado"
    ],
    timesSaved: "8 horas/cliente",
    roi: "250%"
  }
];

const benefits = [
  {
    icon: ClockIcon,
    title: "Ahorra Tiempo",
    description: "Reduce hasta 80% el tiempo en tareas repetitivas"
  },
  {
    icon: CheckCircleIcon,
    title: "Reduce Errores",
    description: "Elimina errores humanos con procesos automatizados"
  },
  {
    icon: ChartBarIcon,
    title: "Mejora Eficiencia",
    description: "Optimiza recursos y aumenta la productividad"
  },
  {
    icon: BoltIcon,
    title: "Escalabilidad",
    description: "Crece sin aumentar proporcionalmente los costos operativos"
  }
];

export default function AutomationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Automatiza tu Negocio
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Transforma procesos manuales en workflows automáticos. 
              Ahorra tiempo, reduce errores y enfócate en hacer crecer tu negocio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contacto"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors inline-flex items-center shadow-lg"
              >
                Automatizar Ahora
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="#ejemplos"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
              >
                Ver Ejemplos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué Automatizar?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              La automatización no es solo tecnología, es una estrategia para hacer tu negocio más eficiente y rentable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Servicios de Automatización
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ofrecemos soluciones completas de automatización adaptadas a las necesidades específicas de tu negocio.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {automationServices.map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-400">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="text-2xl font-bold text-primary mb-4">
                    {service.price}
                  </div>
                  <Link
                    href="/contacto"
                    className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center block"
                  >
                    Solicitar Cotización
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="ejemplos" className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ejemplos de Automatización
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre cómo nuestros clientes han transformado sus procesos y los resultados que han obtenido.
            </p>
          </div>

          <div className="space-y-12">
            {automationExamples.map((example, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {example.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {example.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {example.timesSaved}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Tiempo ahorrado
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {example.roi}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ROI promedio
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Flujo del Proceso:
                    </h4>
                    <div className="space-y-3">
                      {example.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                            {stepIndex + 1}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Herramientas que Utilizamos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Trabajamos con las mejores herramientas de automatización del mercado para garantizar resultados óptimos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "n8n", description: "Automatización open-source", logo: "🔧" },
              { name: "Zapier", description: "Conecta 5000+ aplicaciones", logo: "⚡" },
              { name: "Make", description: "Automatización visual", logo: "🎯" },
              { name: "Custom APIs", description: "Soluciones personalizadas", logo: "🔗" }
            ].map((tool, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{tool.logo}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para Automatizar tu Negocio?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Agenda una consulta gratuita y descubre cómo la automatización puede transformar tu empresa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors inline-flex items-center shadow-lg"
            >
              Consulta Gratuita
            </Link>
            <a
              href="https://calendly.com/wilkiedevs/automatizacion"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            >
              Agendar Llamada
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}