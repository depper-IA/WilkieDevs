import Hero from '@/components/home/Hero'
import InteractiveServices from '@/components/home/InteractiveServices'
import About from '@/components/home/About'
import Projects from '@/components/home/Projects'
import Team from '@/components/home/Team'
import CaseStudies from '@/components/home/CaseStudies'

export default function Home() {
  return (
    <>
      <Hero />
      <InteractiveServices />
      <About />
      <Projects />
      <Team />
      <CaseStudies />
      
      {/* Sección CTA Final */}
      <section className="py-20 bg-primary dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para transformar tu negocio?
            </h2>
            <p className="text-xl text-gray-100">
              Agenda una demostración gratuita y descubre cómo podemos ayudarte a automatizar 
              y optimizar tus procesos empresariales.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contacto"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                Solicitar Demo
              </a>
              <a
                href="/servicios"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md text-lg font-medium transition-colors"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
