'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSammyAvatar, useHeroBackground } from '@/hooks/useMigratedImage'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState({
    founded: 0,
    projects: 0,
    videos: 0,
    clients: 0
  })
  
  // Usar imágenes migradas
  const { imageUrl: sammyUrl, isLoading: sammyLoading } = useSammyAvatar()
  const { imageUrl: heroBackgroundUrl } = useHeroBackground()

  useEffect(() => {
    setIsVisible(true)
    
    // Animación de contadores
    const targets = { founded: 2020, projects: 150, videos: 80, clients: 50 }
    const duration = 2000
    const steps = 60
    const stepTime = duration / steps

    Object.keys(targets).forEach((key) => {
      const target = targets[key as keyof typeof targets]
      const increment = target / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, stepTime)
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* Imagen de fondo del sitio original */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-red-900/80 mix-blend-multiply" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenido principal */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="space-y-4">
              <p className="text-white/80 uppercase tracking-wider text-sm font-medium">
                SITIOS WEB PERSONALIZADOS
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Creación
                <br />
                digital a tu
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  medida
                </span>
              </h1>
            </div>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-lg">
              Transformamos tu negocio con soluciones tecnológicas avanzadas, automatización inteligente 
              y desarrollo web personalizado.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/servicios"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
              >
                Ver Servicios
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contacto"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300"
              >
                CONTACTANOS
              </Link>
            </div>

            {/* Contadores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{counters.founded}</div>
                <div className="text-sm text-white/70">Fundado</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{counters.projects}+</div>
                <div className="text-sm text-white/70">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{counters.videos}+</div>
                <div className="text-sm text-white/70">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{counters.clients}+</div>
                <div className="text-sm text-white/70">Comerciales</div>
              </div>
            </div>
          </div>

          {/* Personaje Sammy del sitio original */}
          <div className={`relative h-[600px] ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="relative w-full h-full flex items-end justify-center">
              {/* Imagen de Sammy migrada */}
              <div className="relative">
                {sammyUrl && !sammyLoading ? (
                  <Image
                    src={sammyUrl}
                    alt="Sammy - Mascota WilkieDevs"
                    width={400}
                    height={500}
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    <svg className="w-20 h-20 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                {/* Globo de diálogo */}
                <div className="absolute top-10 right-10 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="text-gray-800 font-bold">¡HOLA!</div>
                  <div className="absolute bottom-0 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center gap-6 mt-16">
          <a href="https://instagram.com/wilkiedevs" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001z"/>
            </svg>
          </a>
          <a href="https://youtube.com/wilkiedevs" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://facebook.com/wilkiedevs" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}