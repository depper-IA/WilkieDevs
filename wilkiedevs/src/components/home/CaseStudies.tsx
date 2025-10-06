'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const caseStudies = [
  {
    title: 'Automatización de Ventas B2B',
    client: 'Empresa Industrial',
    description:
      'Implementamos un sistema automatizado de seguimiento de leads y cotizaciones que redujo el ciclo de ventas en un 60%.',
    metrics: ['60% menos tiempo', '40% más conversiones', '300+ leads/mes'],
    image: '/images/case-study-1.webp',
    href: '/casos-exito/ventas-b2b',
  },
  {
    title: 'E-commerce Omnicanal',
    client: 'Retail Nacional',
    description:
      'Desarrollamos una plataforma integrada con marketplaces y redes sociales que aumentó las ventas online en un 200%.',
    metrics: ['200% más ventas', '45% reducción costos', '99.9% uptime'],
    image: '/images/case-study-2.webp',
    href: '/casos-exito/ecommerce',
  },
  {
    title: 'Chatbot IA para Atención',
    client: 'Empresa de Servicios',
    description:
      'Implementamos un sistema de atención 24/7 con IA que resuelve el 80% de las consultas sin intervención humana.',
    metrics: ['80% autoservicio', '-65% tiempo respuesta', '95% satisfacción'],
    image: '/images/case-study-3.webp',
    href: '/casos-exito/chatbot-ia',
  },
]

export default function CaseStudies() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentSlide((current) => (current + 1) % caseStudies.length)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }, [isAnimating])

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary dark:text-text-light mb-4">
            Casos de Éxito
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre cómo ayudamos a nuestros clientes a transformar sus negocios
            con tecnología y automatización
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Slider */}
          <div className="overflow-hidden relative rounded-2xl shadow-xl">
            {caseStudies.map((study, index) => (
              <div
                key={study.title}
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-full absolute top-0'
                }`}
                style={{ zIndex: index === currentSlide ? 1 : 0 }}
              >
                <div className="grid md:grid-cols-2 bg-white dark:bg-gray-900">
                  {/* Imagen */}
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Contenido */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-secondary dark:text-text-light mb-2">
                          {study.title}
                        </h3>
                        <p className="text-primary dark:text-accent">{study.client}</p>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300">
                        {study.description}
                      </p>

                      <div className="space-y-3">
                        {study.metrics.map((metric) => (
                          <div
                            key={metric}
                            className="flex items-center text-gray-600 dark:text-gray-300"
                          >
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
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                            {metric}
                          </div>
                        ))}
                      </div>

                      <Link
                        href={study.href}
                        className="inline-flex items-center text-primary dark:text-accent hover:opacity-80 transition-opacity"
                      >
                        Ver caso completo
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
                </div>
              </div>
            ))}
          </div>

          {/* Controles */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentSlide(index)
                    setTimeout(() => setIsAnimating(false), 500)
                  }
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-primary dark:bg-accent'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label={`Ir al caso ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}