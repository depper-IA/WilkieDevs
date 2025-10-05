'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const automations = [
  {
    title: 'Web Scraping y Automatización Web',
    description: 'Extracción y procesamiento automático de datos web',
    benefits: ['Monitoreo de precios', 'Extracción de leads', 'Actualización de catálogos'],
    image: '/images/web-automation.webp',
    href: '/automatizaciones/web',
  },
  {
    title: 'Marketing Automatizado',
    description: 'Automatización de campañas y procesos de marketing',
    benefits: ['Email marketing', 'Social media', 'Google Ads'],
    image: '/images/marketing-automation.webp',
    href: '/automatizaciones/marketing',
  },
  {
    title: 'Ventas y CRM',
    description: 'Optimización y automatización del proceso de ventas',
    benefits: ['Seguimiento de leads', 'Pipeline automation', 'Reportes automáticos'],
    image: '/images/sales-automation.webp',
    href: '/automatizaciones/ventas',
  },
  {
    title: 'WhatsApp y Redes Sociales',
    description: 'Automatización de mensajería y redes sociales',
    benefits: ['Respuestas automáticas', 'Campañas WhatsApp', 'Gestión de redes'],
    image: '/images/social-automation.webp',
    href: '/automatizaciones/redes',
  },
]

export default function Automations() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % automations.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary dark:text-text-light mb-4">
            Automatización Inteligente
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Optimiza tus procesos empresariales con nuestras soluciones de automatización
            impulsadas por IA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Showcase de Automatizaciones */}
          <div className="relative h-[400px] lg:h-[600px]">
            {automations.map((automation, index) => (
              <div
                key={automation.title}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === activeIndex
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-8'
                }`}
                style={{ zIndex: index === activeIndex ? 1 : 0 }}
              >
                <div className="relative h-full rounded-2xl overflow-hidden">
                  <Image
                    src={automation.image}
                    alt={automation.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{automation.title}</h3>
                    <p className="text-lg text-gray-200 mb-4">
                      {automation.description}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {automation.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                        >
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contenido y CTA */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-secondary dark:text-text-light">
                Tu Negocio en Piloto Automático
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Automatizamos tus procesos repetitivos para que puedas enfocarte en lo que
                realmente importa: hacer crecer tu negocio.
              </p>
              <ul className="space-y-3">
                {[
                  'Reduce costos operativos hasta un 70%',
                  'Elimina errores humanos y mejora la precisión',
                  'Escala tus operaciones sin aumentar personal',
                  'Integración con más de 1000+ aplicaciones',
                ].map((item) => (
                  <li key={item} className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-accent mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/automatizaciones"
                className="btn-primary inline-flex items-center text-lg"
              >
                Explorar Automatizaciones
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
              <Link
                href="/contacto"
                className="btn-secondary inline-flex items-center text-lg"
              >
                Solicitar Demo
              </Link>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center lg:justify-start gap-2 mt-8">
              {automations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeIndex
                      ? 'bg-primary'
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-primary/50'
                  }`}
                  aria-label={`Ver automatización ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}