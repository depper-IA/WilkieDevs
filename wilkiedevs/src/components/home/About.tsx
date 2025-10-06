'use client'

import { useEffect } from 'react'
import Link from 'next/link'

const specialties = [
  'Diseño web adaptado a los móviles',
  'Automatización con IA y N8N',
  'Desarrollo de tiendas virtuales',
  'Marketing digital automatizado',
  'Integración de redes sociales',
  'Consultoría gratuita'
]

export default function About() {
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
          <span className="text-6xl font-bold text-primary/20 mr-4">02.</span>
          <div>
            <h2 className="text-4xl font-bold text-secondary dark:text-text-light">
              Somos especialistas
            </h2>
            <div className="h-1 w-16 bg-primary mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenido */}
          <div className="animate-on-scroll space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-secondary dark:text-text-light">
              En construir sitios web personalizados con automatización inteligente
            </h3>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              El core business de nuestra agencia digital es implementar estrategias y técnicas 
              para que tu empresa aumente las ventas a través de tu propia página web gracias a 
              un buen posicionamiento en internet y automatización inteligente.
            </p>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Nos preocupamos por conocer el funcionamiento de tu negocio y con base en esto 
              lograr un proyecto exitoso que combine desarrollo web moderno con automatización 
              de procesos usando IA y herramientas como N8N.
            </p>

            {/* Lista de especialidades */}
            <ul className="space-y-3">
              {specialties.map((specialty, index) => (
                <li 
                  key={specialty}
                  className="flex items-center text-gray-700 dark:text-gray-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full mr-4 flex-shrink-0" />
                  <span>{specialty}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link
                href="/contacto"
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Quiero Saber más
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="animate-on-scroll">
            <div className="relative">
              {/* Imagen principal */}
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 h-96">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-20 h-20 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                {/* Elementos flotantes */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-bold text-primary">100%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Automatizado</div>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-bold text-accent">24/7</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Disponible</div>
                </div>
                
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <div className="text-sm font-bold text-secondary dark:text-white">IA + N8N</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Powered</div>
                </div>
              </div>
              
              {/* Decoración */}
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}