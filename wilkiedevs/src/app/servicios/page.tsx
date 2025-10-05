import Image from 'next/image'
import Link from 'next/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import type { Service } from '@/types/services'

// TODO: Integrar con backend/CMS
const getServices = async (): Promise<Service[]> => {
  // Simulación de servicios
  return [
    {
      id: '1',
      slug: 'desarrollo-web',
      name: 'Desarrollo Web',
      description: 'Creamos sitios web modernos, aplicaciones web y e-commerce optimizados para convertir',
      longDescription: `Desarrollo web profesional con las últimas tecnologías`,
      icon: 'web',
      image: '/images/services/web-development.webp',
      features: [
        'Diseño web responsive y moderno',
        'Optimización SEO y rendimiento',
        'E-commerce y pasarelas de pago',
        'Integraciones API y automatización',
      ],
      technologies: ['Next.js', 'React', 'TailwindCSS', 'Node.js'],
      plans: [
        {
          id: 'web-basic',
          name: 'Básico',
          description: 'Para pequeños negocios',
          price: { amount: 999, currency: 'USD' },
          features: [
            { id: '1', name: 'Diseño Responsive', description: 'Adaptable a todos los dispositivos', included: true },
          ],
          recommended: false
        }
      ],
      faqs: [
        {
          question: '¿Cuánto tiempo toma desarrollar un sitio web?',
          answer: 'El tiempo varía según la complejidad del proyecto'
        }
      ]
    },
    {
      id: '2',
      slug: 'inteligencia-artificial',
      name: 'Inteligencia Artificial',
      description: 'Implementamos soluciones de IA para automatizar procesos y mejorar la toma de decisiones',
      longDescription: `Soluciones de IA avanzadas para tu negocio`,
      icon: 'ai',
      image: '/images/services/ai-solutions.webp',
      features: [
        'Chatbots y asistentes virtuales',
        'Procesamiento de lenguaje natural',
        'Análisis predictivo',
        'Automatización inteligente',
      ],
      technologies: ['OpenAI', 'Python', 'TensorFlow', 'PyTorch'],
      plans: [
        {
          id: 'ai-basic',
          name: 'Básico',
          description: 'Para comenzar con IA',
          price: { amount: 1999, currency: 'USD' },
          features: [
            { id: '1', name: 'Chatbot Básico', description: 'Asistente virtual simple', included: true },
          ],
          recommended: false
        }
      ],
      faqs: [
        {
          question: '¿Qué tipos de IA ofrecen?',
          answer: 'Ofrecemos múltiples soluciones de IA según tus necesidades'
        }
      ]
    },
    {
      id: '3',
      slug: 'apis-integraciones',
      name: 'APIs e Integraciones',
      description: 'Desarrollamos APIs robustas y conectamos sistemas para automatizar flujos de trabajo',
      longDescription: `Integración y desarrollo de APIs profesionales`,
      icon: 'api',
      image: '/images/services/api-integration.webp',
      features: [
        'APIs REST y GraphQL',
        'Webhooks y eventos',
        'Integraciones con SaaS',
        'Microservicios',
      ],
      technologies: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
      plans: [
        {
          id: 'api-basic',
          name: 'Básico',
          description: 'APIs simples',
          price: { amount: 1499, currency: 'USD' },
          features: [
            { id: '1', name: 'API REST', description: 'Endpoints básicos', included: true },
          ],
          recommended: false
        }
      ],
      faqs: [
        {
          question: '¿Qué tipos de APIs desarrollan?',
          answer: 'Desarrollamos APIs REST, GraphQL y más'
        }
      ]
    },
    {
      id: '4',
      slug: 'automatizacion',
      name: 'Automatización',
      description: 'Automatizamos procesos repetitivos para aumentar la productividad de tu negocio',
      longDescription: `Automatización de procesos empresariales`,
      icon: 'automation',
      image: '/images/services/automation.webp',
      features: [
        'Automatización de marketing',
        'Integración de sistemas',
        'Flujos de trabajo personalizados',
        'RPA (Robotic Process Automation)',
      ],
      technologies: ['n8n', 'Zapier', 'Make', 'UiPath'],
      plans: [
        {
          id: 'auto-basic',
          name: 'Básico',
          description: 'Automatizaciones simples',
          price: { amount: 799, currency: 'USD' },
          features: [
            { id: '1', name: 'Flujo básico', description: 'Automatización simple', included: true },
          ],
          recommended: false
        }
      ],
      faqs: [
        {
          question: '¿Qué procesos pueden automatizar?',
          answer: 'Podemos automatizar casi cualquier proceso repetitivo'
        }
      ]
    },
  ]
}

export const metadata = {
  title: 'Servicios - WilkieDevs',
  description: 'Desarrollo web, inteligencia artificial, APIs y automatización para impulsar tu negocio',
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Nuestros Servicios
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Soluciones tecnológicas innovadoras para impulsar el crecimiento de tu negocio
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {services.map((service) => (
          <Link 
            key={service.id} 
            href={`/servicios/${service.slug}`}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative w-full aspect-video">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <ServiceIcon name={service.icon} className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">{service.name}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {service.description}
              </p>
              <div className="space-y-4">
                <h3 className="font-semibold">Características principales:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-4">Tecnologías:</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-secondary/10 dark:bg-secondary/20 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-6">
          ¿No encuentras lo que buscas?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Contáctanos para discutir tu proyecto y crear una solución personalizada
        </p>
        <Link
          href="/contacto"
          className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Contactar
        </Link>
      </div>
    </div>
  )
}