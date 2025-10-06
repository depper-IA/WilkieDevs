import Link from 'next/link'
import Image from 'next/image'

const services = [
  {
    slug: 'desarrollo-web',
    title: 'Desarrollo Web',
    description: 'Sitios web modernos, responsivos y optimizados para SEO',
    icon: '💻',
    price: 'Desde $2,000 USD',
    features: ['Diseño responsivo', 'SEO optimizado', 'CMS personalizado', 'Soporte 24/7']
  },
  {
    slug: 'automatizacion',
    title: 'Automatización IA',
    description: 'Automatiza procesos empresariales con inteligencia artificial',
    icon: '🤖',
    price: 'Desde $1,500 USD',
    features: ['Workflows N8N', 'Chatbots IA', 'Integración APIs', 'Reportes automáticos']
  },
  {
    slug: 'apps-moviles',
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas para iOS y Android',
    icon: '📱',
    price: 'Desde $5,000 USD',
    features: ['iOS & Android', 'UI/UX moderno', 'Backend integrado', 'App Store ready']
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce',
    description: 'Tiendas online completas con gestión de inventario',
    icon: '🛒',
    price: 'Desde $3,000 USD',
    features: ['Catálogo productos', 'Pagos seguros', 'Gestión pedidos', 'Analytics']
  }
]

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Nuestros <span className="text-gradient">Servicios</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transformamos ideas en soluciones digitales que impulsan tu negocio hacia el éxito
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.slug} className="card-wilkie p-8 hover:scale-105 transition-all duration-300">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-2xl font-bold text-primary">{service.price}</div>
              </div>
              
              <div className="space-y-3 mb-8">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  href={`/servicios/${service.slug}`}
                  className="btn-primary w-full block"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Ofrecemos soluciones personalizadas para cada negocio. Cuéntanos tu idea y la convertiremos en realidad.
          </p>
          <Link href="/contacto" className="btn-primary">
            Solicitar Cotización Personalizada
          </Link>
        </div>
      </div>
    </div>
  )
}