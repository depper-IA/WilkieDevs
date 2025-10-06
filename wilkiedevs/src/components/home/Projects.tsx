'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const projects = [
  {
    title: 'La Montaña Agromercados',
    description: 'Vitrina Virtual - Mostrario de Sedes y Ofertas',
    country: 'Colombia 🇨🇴',
    status: 'online',
    duration: '2-4 Semanas',
    type: 'Vitrina Virtual',
    url: 'lamontana-agromercados.com',
    image: 'https://wilkiedevs.com/wp-content/uploads/2025/01/la-montana-agromercados.jpg',
    technologies: ['WordPress', 'WooCommerce', 'SEO', 'Responsive'],
    href: '/portfolio/la-montana-agromercados'
  },
  {
    title: 'E4U Worldwide Corp',
    description: 'Sitio corporativo internacional con múltiples servicios',
    country: 'USA 🇺🇸',
    status: 'online',
    type: 'Corporativo',
    url: 'e4u-worldwide.com',
    image: 'https://wilkiedevs.com/wp-content/uploads/2024/11/e4u-worldwide.jpg',
    technologies: ['WordPress', 'Multilingual', 'SEO', 'Corporate'],
    href: '/portfolio/e4u-worldwide'
  },
  {
    title: 'LW Language School',
    description: 'Plataforma Virtual Educativa para enseñanza de idiomas',
    country: 'Costa Rica 🇨🇷',
    status: 'online',
    type: 'Plataforma Virtual',
    url: 'lwlanguageschool.com',
    image: 'https://wilkiedevs.com/wp-content/uploads/2024/09/lw-language-school.jpg',
    technologies: ['WordPress', 'LMS', 'E-learning', 'Responsive'],
    href: '/portfolio/lw-language-school'
  },
  {
    title: 'Condominio La Mariana',
    description: 'Sitio web arquitectónico con galería y información de proyecto',
    country: 'Colombia 🇨🇴',
    status: 'online',
    type: 'Arquitectura',
    url: 'lamariana.com.co',
    image: 'https://wilkiedevs.com/wp-content/uploads/2024/06/condominio-la-mariana.jpg',
    technologies: ['WordPress', 'Gallery', 'Architecture', 'SEO'],
    href: '/portfolio/condominio-la-mariana'
  },
  {
    title: 'Precision Wrapz',
    description: 'Sitio web para empresa de wrapping automotriz',
    country: 'Canadá 🇨🇦',
    status: 'online',
    type: 'Corporativo',
    url: 'precisionwrapz.com',
    image: 'https://wilkiedevs.com/wp-content/uploads/2024/04/precision-wrapz.jpg',
    technologies: ['WordPress', 'Portfolio', 'Automotive', 'Gallery'],
    href: '/portfolio/precision-wrapz'
  },
  {
    title: 'Grupo Metric',
    description: 'Sitio corporativo para grupo empresarial',
    country: 'Colombia 🇨🇴',
    status: 'online',
    type: 'Corporativo',
    url: 'grupometric.com.co',
    image: 'https://wilkiedevs.com/wp-content/uploads/2024/05/grupo-metric.jpg',
    technologies: ['WordPress', 'Corporate', 'Multi-site', 'SEO'],
    href: '/portfolio/grupo-metric'
  }
]

export default function Projects() {
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
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Número de sección */}
        <div className="flex items-center mb-8">
          <span className="text-6xl font-bold text-primary/20 mr-4">03.</span>
          <div>
            <h2 className="text-4xl font-bold text-secondary dark:text-text-light">
              Últimos Proyectos
            </h2>
            <div className="h-1 w-16 bg-primary mt-2" />
          </div>
        </div>

        {/* Proyecto destacado */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-secondary dark:text-text-light mb-8">Proyecto destacado</h3>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Imagen destacada */}
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <Image
                  src={projects[0].image}
                  alt={projects[0].title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    Online
                  </div>
                  <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-medium">
                    {projects[0].country}
                  </div>
                </div>
              </div>
              
              {/* Contenido destacado */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h4 className="text-3xl font-bold text-secondary dark:text-text-light mb-4">
                  {projects[0].title}
                </h4>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {projects[0].description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{projects[0].duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{projects[0].type}</span>
                  </div>
                </div>
                
                <Link
                  href={projects[0].href}
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Ver detalles
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de proyectos */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-secondary dark:text-text-light mb-8">Conoce nuestra gran variedad de Proyectos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(1).map((project, index) => (
              <div
                key={project.title}
                className="animate-on-scroll group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Link href={project.href}>
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
                    {/* Imagen del proyecto */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <div className="bg-accent/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Online
                        </div>
                        <div className="bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full text-xs font-medium">
                          {project.country}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-secondary dark:text-text-light mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      
                      {project.url && (
                        <div className="text-sm text-primary mb-3 font-mono">
                          {project.url}
                        </div>
                      )}
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      {/* Tipo de proyecto */}
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{project.type}</span>
                      </div>
                      
                      {/* Tecnologías */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Call to action */}
                      <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80">
                        Ver proyecto
                        <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Ver más proyectos */}
        <div className="text-center">
          <Link
            href="/proyectos"
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Ver todos los proyectos
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}