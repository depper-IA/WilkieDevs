'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido principal */}
          <div className={`space-y-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-secondary dark:text-text-light">
              Automatización Web y{' '}
              <span className="text-primary">Desarrollo Inteligente</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Transformamos tu negocio con soluciones tecnológicas avanzadas y automatización inteligente.
              Descubre el poder de la IA aplicada a tu empresa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/servicios"
                className="btn-primary text-lg font-medium inline-flex items-center"
              >
                Explorar Servicios
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="/contacto"
                className="btn-secondary text-lg font-medium"
              >
                Solicitar Demo
              </Link>
            </div>
          </div>

          {/* Avatares animados */}
          <div className={`relative h-[500px] ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            {/* Rebecca */}
            <div className="absolute left-0 bottom-0 w-3/5">
              <Image
                src="/images/rebecca-avatar.png"
                alt="Rebecca - Asesora Digital"
                width={300}
                height={500}
                className="object-contain"
                priority
              />
            </div>
            {/* Sammy */}
            <div className="absolute right-0 bottom-0 w-2/5">
              <Image
                src="/images/sammy-avatar.png"
                alt="Sammy - Asistente Virtual"
                width={200}
                height={400}
                className="object-contain"
                priority
              />
            </div>
            {/* Elementos decorativos */}
            <div className="absolute -z-10 w-full h-full">
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>

        {/* Badge flotante */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <span className="animate-pulse">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
            </span>
            <span className="text-sm font-medium">
              Asistentes IA disponibles 24/7
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}