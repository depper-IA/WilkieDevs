'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    id: 'tours-360',
    title: 'Tour Virtuales 360°',
    description: 'Aproveche el fantástico mundo de la Realidad Virtual 360° como uno de los formatos más poderosos de la comunicación actual en los METAVERSOS.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
      </svg>
    ),
    cta: 'Vive la experiencia',
    href: '/servicios/tours-360'
  },
  {
    id: 'desarrollo-web',
    title: 'Desarrollo Web',
    description: 'Sitios webs personalizados al alcance de tu bolsillo con el mejor equipo de desarrollo.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    cta: 'Haz clic aquí',
    href: '/servicios/desarrollo-web'
  },
  {
    id: 'fotografia',
    title: 'Fotografía',
    description: 'Nos encargamos de capturar tus mejores momentos en sensacionales fotos y videos',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    cta: 'Ver Portfolio',
    href: '/servicios/fotografia'
  },
  {
    id: 'audiovisual',
    title: 'Producción Audiovisual',
    description: 'Servicio integral de producción audiovisual, desde la filmación hasta la edición final.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    cta: 'Ver Portfolio',
    href: '/servicios/audiovisual'
  }
]

export default function InteractiveServices() {
  const [activeService, setActiveService] = useState(services[0].id)

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      {/* Fondo con imagen de oficina moderna */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/2024/bg.webp")',
          filter: 'grayscale(100%) brightness(0.3)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Número de sección */}
        <div className="flex items-center mb-8">
          <span className="text-6xl font-bold text-white/20 mr-4">01.</span>
          <div>
            <h2 className="text-4xl font-bold text-white">
              Servicios
            </h2>
            <div className="h-1 w-16 bg-primary mt-2" />
          </div>
        </div>

        <div className="text-center mb-16">
          <Link
            href="/servicios"
            className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            Ver todos los servicios
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid de servicios interactivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`
                relative group cursor-pointer transition-all duration-500 transform
                ${activeService === service.id 
                  ? 'scale-105 z-10' 
                  : 'hover:scale-102'
                }
              `}
              onMouseEnter={() => setActiveService(service.id)}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`
                bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 h-80
                transition-all duration-500 group-hover:bg-white/20
                ${activeService === service.id 
                  ? 'bg-white/20 shadow-2xl shadow-primary/20' 
                  : ''
                }
              `}>
                {/* Icono */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300
                  ${activeService === service.id 
                    ? 'bg-primary text-white' 
                    : 'bg-white/20 text-white group-hover:bg-primary group-hover:text-white'
                  }
                `}>
                  {service.icon}
                </div>

                {/* Contenido */}
                <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                  {service.title}
                </h3>
                
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Call to Action */}
                <Link
                  href={service.href}
                  className={`
                    inline-flex items-center gap-2 text-sm font-medium transition-all duration-300
                    ${activeService === service.id 
                      ? 'text-primary' 
                      : 'text-white/80 group-hover:text-white'
                    }
                  `}
                >
                  {service.cta}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                {/* Indicador activo */}
                {activeService === service.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de navegación */}
        <div className="flex justify-center mt-12 gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${activeService === service.id 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  )
}