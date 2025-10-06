'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  WebIcon,
  AutomationIcon,
  AIIcon,
  MobileIcon,
  APIIcon,
  ConsultingIcon,
  MarketingIcon,
  WhatsAppIcon,
} from '@/components/icons/ServiceIcons'

const services = [
  {
    Icon: WebIcon,
    title: 'Desarrollo Web',
    description: 'Creamos sitios web modernos, aplicaciones web y e-commerce optimizados para convertir',
    features: ['Next.js', 'WordPress', 'WooCommerce', 'E-commerce'],
    href: '/servicios#web',
  },
  {
    Icon: AutomationIcon,
    title: 'Automatización',
    description: 'Automatizamos tus procesos de negocio, marketing y ventas para maximizar tu eficiencia',
    features: ['n8n', 'Make', 'Zapier', 'Power Automate'],
    href: '/servicios#automatizacion',
  },
  {
    Icon: AIIcon,
    title: 'Servicios IA',
    description: 'Implementamos soluciones de IA para chatbots, análisis de datos y automatización inteligente',
    features: ['ChatGPT', 'LangChain', 'Claude', 'Custom AI'],
    href: '/servicios#ia',
  },
  {
    Icon: MobileIcon,
    title: 'Apps Móviles',
    description: 'Desarrollamos aplicaciones móviles nativas y multiplataforma con las últimas tecnologías',
    features: ['React Native', 'Flutter', 'iOS', 'Android'],
    href: '/servicios#apps',
  },
  {
    Icon: APIIcon,
    title: 'APIs y Backend',
    description: 'Creamos APIs robustas y sistemas backend escalables para tus aplicaciones',
    features: ['REST', 'GraphQL', 'Node.js', 'Python'],
    href: '/servicios#apis',
  },
  {
    Icon: ConsultingIcon,
    title: 'Consultoría Tech',
    description: 'Asesoramos en transformación digital, arquitectura de sistemas y estrategia tecnológica',
    features: ['Arquitectura', 'DevOps', 'Cloud', 'Seguridad'],
    href: '/servicios#consultoria',
  },
  {
    Icon: MarketingIcon,
    title: 'Marketing Digital',
    description: 'Optimizamos tu presencia digital con estrategias de marketing automatizadas',
    features: ['SEO', 'SEM', 'Social Media', 'Email'],
    href: '/servicios#marketing',
  },
  {
    Icon: WhatsAppIcon,
    title: 'WhatsApp Business',
    description: 'Implementamos soluciones de WhatsApp Business API con automatizaciones inteligentes',
    features: ['WhatsApp API', 'Chatbots', 'CRM', 'Automatización'],
    href: '/servicios#whatsapp',
  },
]

export default function Services() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    })

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Número de sección */}
        <div className="flex items-center mb-8">
          <span className="text-6xl font-bold text-primary/20 mr-4">01.</span>
          <div>
            <h2 className="text-4xl font-bold text-secondary dark:text-text-light">
              Servicios
            </h2>
            <div className="h-1 w-16 bg-primary mt-2" />
          </div>
        </div>

        <div className="text-center mb-16">
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Soluciones tecnológicas integrales para potenciar tu negocio con automatización, 
            IA y desarrollo personalizado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="animate-on-scroll"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Link href={service.href}>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 h-full flex flex-col">
                  <div className="text-primary dark:text-accent mb-4">
                    <service.Icon />
                  </div>
                  <h3 className="text-xl font-bold text-secondary dark:text-text-light mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {service.description}
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <ul className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/servicios"
            className="btn-primary inline-flex items-center text-lg"
          >
            Ver todos los servicios
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}