import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServiceDetail from '@/components/services/ServiceDetail'
import type { Service } from '@/types/services'

interface Props {
  params: {
    slug: string
  }
}

// TODO: Integrar con backend/CMS
const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  // Simulación de servicio
  const service: Service = {
    id: '1',
    slug: 'desarrollo-web',
    name: 'Desarrollo Web',
    description: 'Creamos sitios web modernos, aplicaciones web y e-commerce optimizados para convertir',
    longDescription: `
      <h2>Desarrollo Web Profesional</h2>
      <p>Creamos soluciones web a medida utilizando las últimas tecnologías y mejores prácticas del mercado. Nuestro enfoque se centra en crear experiencias digitales excepcionales que impulsen el crecimiento de tu negocio.</p>

      <h3>¿Por qué elegirnos?</h3>
      <ul>
        <li>Experiencia en múltiples tecnologías y frameworks</li>
        <li>Diseño centrado en el usuario y la conversión</li>
        <li>Optimización SEO y rendimiento desde el inicio</li>
        <li>Soporte y mantenimiento continuo</li>
      </ul>

      <h3>Nuestro Proceso</h3>
      <ol>
        <li>Análisis y planificación detallada</li>
        <li>Diseño UX/UI personalizado</li>
        <li>Desarrollo e implementación</li>
        <li>Testing y optimización</li>
        <li>Lanzamiento y soporte</li>
      </ol>

      <h3>Tecnologías que utilizamos</h3>
      <p>Trabajamos con las últimas tecnologías del mercado para asegurar que tu proyecto esté preparado para el futuro:</p>
      <ul>
        <li>Next.js y React para aplicaciones web modernas</li>
        <li>WordPress y WooCommerce para CMS y e-commerce</li>
        <li>Node.js y Python para backend y APIs</li>
        <li>AWS y Vercel para hosting y despliegue</li>
      </ul>
    `,
    icon: 'web',
    image: '/images/services/web-development.webp',
    features: [
      'Diseño web responsive y moderno',
      'Optimización SEO y rendimiento',
      'E-commerce y pasarelas de pago',
      'Integraciones API y automatización',
      'CMS personalizado y fácil de usar',
      'Hosting y mantenimiento incluido',
    ],
    technologies: [
      'Next.js',
      'React',
      'TailwindCSS',
      'Node.js',
      'WordPress',
      'WooCommerce',
      'Python',
      'AWS',
    ],
    plans: [
      {
        id: 'web-basic',
        name: 'Básico',
        description: 'Ideal para pequeños negocios',
        price: {
          amount: 999,
          currency: 'USD',
        },
        features: [
          {
            id: '1',
            name: 'Diseño Responsive',
            description: 'Adaptable a todos los dispositivos',
            included: true,
          },
          {
            id: '2',
            name: 'SEO Básico',
            description: 'Optimización básica para buscadores',
            included: true,
          },
          {
            id: '3',
            name: 'CMS Personalizado',
            description: 'Sistema de gestión de contenidos',
            included: true,
          },
          {
            id: '4',
            name: 'Hosting Premium',
            description: 'Alojamiento de alto rendimiento',
            included: false,
          },
        ],
        recommended: false,
      },
      {
        id: 'web-pro',
        name: 'Profesional',
        description: 'Para empresas en crecimiento',
        price: {
          amount: 1999,
          currency: 'USD',
        },
        features: [
          {
            id: '1',
            name: 'Todo lo del plan Básico',
            description: 'Incluye todas las características básicas',
            included: true,
          },
          {
            id: '2',
            name: 'E-commerce Integrado',
            description: 'Tienda online completa',
            included: true,
          },
          {
            id: '3',
            name: 'SEO Avanzado',
            description: 'Optimización completa para buscadores',
            included: true,
          },
          {
            id: '4',
            name: 'Integraciones API',
            description: 'Conexión con servicios externos',
            included: true,
          },
        ],
        recommended: true,
      },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo toma desarrollar un sitio web?',
        answer: 'El tiempo de desarrollo varía según la complejidad del proyecto. Un sitio web básico puede estar listo en 2-4 semanas, mientras que proyectos más complejos pueden tomar 2-3 meses.',
      },
      {
        question: '¿Qué necesito para empezar?',
        answer: 'Para comenzar, necesitamos tener una reunión inicial para entender tus objetivos, recopilar requisitos y definir el alcance del proyecto. También es útil tener contenido y material gráfico preparado.',
      },
      {
        question: '¿Incluyen mantenimiento y soporte?',
        answer: 'Sí, todos nuestros planes incluyen soporte técnico y mantenimiento básico. También ofrecemos planes de mantenimiento extendido para necesidades específicas.',
      },
    ],
  }

  return service.slug === slug ? service : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug)
  if (!service) return {}

  return {
    title: `${service.name} - WilkieDevs`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: Props) {
  const service = await getServiceBySlug(params.slug)
  if (!service) notFound()

  return <ServiceDetail service={service} />
}