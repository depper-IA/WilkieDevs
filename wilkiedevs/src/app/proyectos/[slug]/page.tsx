import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

// Datos de proyectos (en una app real, esto vendría de una base de datos)
const projects = {
  'ecommerce-moderno': {
    id: 1,
    title: "E-commerce Moderno",
    subtitle: "Transformación digital completa para TechStore Colombia",
    description: "Desarrollo de una tienda online moderna con sistema de pagos integrado, gestión de inventario en tiempo real y analytics avanzados que incrementó las ventas en un 300%.",
    image: "/images/projects/ecommerce-modern.jpg",
    category: "E-commerce",
    technologies: ["Next.js", "Stripe", "Supabase", "Tailwind CSS", "Vercel"],
    url: "ecommerce-demo.wilkiedevs.com",
    client: "TechStore Colombia",
    year: "2024",
    duration: "8 semanas",
    team: ["Frontend Developer", "Backend Developer", "UI/UX Designer"],
    challenge: "TechStore Colombia necesitaba modernizar su presencia online y crear una experiencia de compra fluida que compitiera con las grandes plataformas de e-commerce.",
    solution: "Desarrollamos una plataforma completa con diseño responsive, sistema de pagos seguro, gestión de inventario automatizada y panel de administración intuitivo.",
    results: {
      conversion: "+150%",
      sales: "+300%",
      performance: "95/100",
      loadTime: "1.2s",
      mobileUsers: "+200%",
      customerSatisfaction: "98%"
    },
    features: [
      "Catálogo de productos con filtros avanzados",
      "Carrito de compras persistente",
      "Integración con Stripe para pagos",
      "Panel de administración completo",
      "Sistema de inventario en tiempo real",
      "Notificaciones automáticas por email",
      "Analytics y reportes de ventas",
      "Diseño responsive optimizado",
      "SEO avanzado para productos",
      "Sistema de reviews y calificaciones"
    ],
    testimonial: {
      text: "WilkieDevs transformó completamente nuestro negocio. Las ventas online se triplicaron en los primeros 3 meses y la experiencia de usuario es excepcional.",
      author: "Carlos Mendoza",
      position: "CEO, TechStore Colombia"
    }
  },
  'crm-automatizacion': {
    id: 2,
    title: "Sistema de Automatización CRM",
    subtitle: "Automatización completa de procesos de ventas",
    description: "Implementación de un sistema CRM automatizado que redujo el tiempo de gestión de leads en 60% y aumentó la conversión en 200%.",
    image: "/images/projects/crm-automation.jpg",
    category: "Automatización",
    technologies: ["n8n", "Supabase", "React", "Node.js", "Zapier"],
    url: "crm-demo.wilkiedevs.com",
    client: "Inmobiliaria Premium",
    year: "2024",
    duration: "6 semanas",
    team: ["Automation Specialist", "Full Stack Developer", "Data Analyst"],
    challenge: "La inmobiliaria manejaba manualmente cientos de leads diarios, perdiendo oportunidades de venta por falta de seguimiento oportuno.",
    solution: "Creamos un sistema automatizado que captura, clasifica y hace seguimiento a los leads automáticamente, con notificaciones inteligentes al equipo de ventas.",
    results: {
      efficiency: "+80%",
      leads: "+200%",
      time: "-60%",
      conversion: "+150%",
      responseTime: "5 min",
      satisfaction: "95%"
    },
    features: [
      "Captura automática de leads desde múltiples fuentes",
      "Clasificación inteligente por scoring",
      "Seguimiento automatizado por email y WhatsApp",
      "Dashboard en tiempo real",
      "Notificaciones push al equipo de ventas",
      "Integración con calendarios para citas",
      "Reportes automáticos de performance",
      "Sistema de tareas y recordatorios",
      "Análisis predictivo de conversión",
      "API para integraciones personalizadas"
    ],
    testimonial: {
      text: "La automatización nos permitió escalar el negocio sin aumentar el equipo. Ahora podemos manejar 3 veces más leads con la misma eficiencia.",
      author: "María González",
      position: "Directora de Ventas, Inmobiliaria Premium"
    }
  },
  'landing-corporativa': {
    id: 3,
    title: "Landing Page Corporativa",
    subtitle: "Presencia digital moderna para consultoría estratégica",
    description: "Desarrollo de una landing page corporativa optimizada para conversiones que aumentó el tráfico en 120% y los leads en 180%.",
    image: "/images/projects/corporate-landing.jpg",
    category: "Landing Page",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "Vercel"],
    url: "corporate-demo.wilkiedevs.com",
    client: "Consultoría Estratégica",
    year: "2024",
    duration: "3 semanas",
    team: ["Frontend Developer", "UI/UX Designer", "SEO Specialist"],
    challenge: "La consultoría necesitaba una presencia digital profesional que transmitiera confianza y generara leads calificados.",
    solution: "Diseñamos una landing page moderna con animaciones sutiles, contenido optimizado para SEO y formularios de contacto estratégicamente ubicados.",
    results: {
      traffic: "+120%",
      bounce: "-45%",
      leads: "+180%",
      seoRanking: "Top 3",
      loadTime: "0.8s",
      mobileScore: "100/100"
    },
    features: [
      "Diseño responsive y moderno",
      "Animaciones con Framer Motion",
      "Optimización SEO avanzada",
      "Formularios de contacto inteligentes",
      "Integración con Google Analytics",
      "Chat widget personalizado",
      "Testimonios y casos de éxito",
      "Blog integrado",
      "Certificados SSL y seguridad",
      "Optimización de velocidad"
    ],
    testimonial: {
      text: "Nuestra nueva página web nos posicionó como líderes en el sector. La calidad de los leads que recibimos ahora es excepcional.",
      author: "Roberto Silva",
      position: "Director General, Consultoría Estratégica"
    }
  },
  'gestion-proyectos': {
    id: 4,
    title: "App de Gestión de Proyectos",
    subtitle: "Plataforma colaborativa para equipos creativos",
    description: "Aplicación web completa para gestión de proyectos con colaboración en tiempo real que mejoró la productividad del equipo en 90%.",
    image: "/images/projects/project-management.jpg",
    category: "Web App",
    technologies: ["React", "Socket.io", "MongoDB", "Express", "Node.js"],
    url: "projects-demo.wilkiedevs.com",
    client: "Agencia Creativa",
    year: "2023",
    duration: "10 semanas",
    team: ["Full Stack Developer", "Backend Developer", "UI/UX Designer"],
    challenge: "La agencia necesitaba una herramienta personalizada para gestionar proyectos creativos con múltiples stakeholders y deadlines complejos.",
    solution: "Desarrollamos una aplicación web completa con colaboración en tiempo real, gestión de tareas, timeline visual y sistema de aprobaciones.",
    results: {
      productivity: "+90%",
      collaboration: "+150%",
      delivery: "+40%",
      clientSatisfaction: "96%",
      timeTracking: "100%",
      efficiency: "+75%"
    },
    features: [
      "Dashboard personalizable por usuario",
      "Gestión de proyectos con Kanban",
      "Colaboración en tiempo real",
      "Sistema de comentarios y aprobaciones",
      "Timeline visual de proyectos",
      "Tracking de tiempo automático",
      "Notificaciones push y email",
      "Reportes de productividad",
      "Integración con herramientas externas",
      "Sistema de roles y permisos"
    ],
    testimonial: {
      text: "Esta plataforma revolucionó nuestra forma de trabajar. Ahora todos los proyectos se entregan a tiempo y la comunicación con clientes es perfecta.",
      author: "Ana Martínez",
      position: "Project Manager, Agencia Creativa"
    }
  },
  'chatbot-ia': {
    id: 5,
    title: "Chatbot Inteligente",
    subtitle: "Asistente virtual con IA para atención al cliente",
    description: "Chatbot inteligente con procesamiento de lenguaje natural que mejoró la atención al cliente en 200% y redujo los tiempos de respuesta en 80%.",
    image: "/images/projects/ai-chatbot.jpg",
    category: "IA & Automatización",
    technologies: ["OpenAI", "n8n", "React", "Supabase", "Python"],
    url: "chatbot-demo.wilkiedevs.com",
    client: "E-learning Platform",
    year: "2024",
    duration: "7 semanas",
    team: ["AI Developer", "Full Stack Developer", "UX Designer"],
    challenge: "La plataforma de e-learning recibía cientos de consultas diarias que saturaban al equipo de soporte.",
    solution: "Implementamos un chatbot inteligente que responde automáticamente el 80% de las consultas y deriva casos complejos al equipo humano.",
    results: {
      support: "+200%",
      satisfaction: "95%",
      response: "-80%",
      resolution: "85%",
      cost: "-60%",
      availability: "24/7"
    },
    features: [
      "Procesamiento de lenguaje natural",
      "Integración con base de conocimientos",
      "Escalamiento automático a humanos",
      "Análisis de sentimientos",
      "Respuestas contextuales",
      "Múltiples idiomas",
      "Analytics de conversaciones",
      "Entrenamiento continuo",
      "API para integraciones",
      "Dashboard de administración"
    ],
    testimonial: {
      text: "El chatbot no solo mejoró nuestra atención al cliente, sino que nos dio insights valiosos sobre las necesidades de nuestros usuarios.",
      author: "Luis Rodríguez",
      position: "CTO, E-learning Platform"
    }
  },
  'dashboard-analytics': {
    id: 6,
    title: "Dashboard Analytics",
    subtitle: "Visualización de datos para decisiones inteligentes",
    description: "Dashboard personalizado para visualización de métricas de negocio en tiempo real que mejoró la toma de decisiones en 150%.",
    image: "/images/projects/analytics-dashboard.jpg",
    category: "Dashboard",
    technologies: ["React", "D3.js", "PostgreSQL", "Express", "Chart.js"],
    url: "analytics-demo.wilkiedevs.com",
    client: "Startup Fintech",
    year: "2023",
    duration: "6 semanas",
    team: ["Data Visualization Expert", "Backend Developer", "Data Analyst"],
    challenge: "La startup necesitaba visualizar datos complejos de múltiples fuentes para tomar decisiones de negocio más informadas.",
    solution: "Creamos un dashboard interactivo que consolida datos de diferentes APIs y presenta insights accionables en tiempo real.",
    results: {
      insights: "+300%",
      decisions: "+150%",
      roi: "+250%",
      dataAccuracy: "99.5%",
      userAdoption: "100%",
      timeToInsight: "-70%"
    },
    features: [
      "Visualizaciones interactivas con D3.js",
      "Consolidación de múltiples fuentes de datos",
      "Alertas automáticas por KPIs",
      "Reportes programados",
      "Filtros dinámicos avanzados",
      "Exportación de datos",
      "Dashboard personalizable",
      "Análisis predictivo",
      "API REST para integraciones",
      "Seguridad y control de acceso"
    ],
    testimonial: {
      text: "Este dashboard nos dio la visibilidad que necesitábamos para escalar el negocio. Ahora tomamos decisiones basadas en datos reales.",
      author: "Patricia Vega",
      position: "CEO, Startup Fintech"
    }
  }
};

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = projects[params.slug as keyof typeof projects];
  
  if (!project) {
    return {
      title: 'Proyecto no encontrado - WilkieDevs'
    };
  }

  return {
    title: `${project.title} - WilkieDevs`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: Props) {
  const project = projects[params.slug as keyof typeof projects];

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Proyecto no encontrado</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">El proyecto que buscas no existe o ha sido movido.</p>
          <Link href="/proyectos" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/proyectos" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver a proyectos
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                <span className="text-white/80">{project.year}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-6">
                {project.subtitle}
              </p>
              
              <p className="text-white/80 mb-8">
                {project.description}
              </p>

              <div className="flex gap-4">
                <a
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  Ver Proyecto Live
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
                </a>
                <Link
                  href="/contacto"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Proyecto Similar
                </Link>
              </div>
            </div>

            <div className="lg:mt-0">
              <div className="relative h-96 bg-white/10 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl opacity-30">
                    {project.category === 'E-commerce' && '🛒'}
                    {project.category === 'Automatización' && '⚡'}
                    {project.category === 'IA & Automatización' && '🤖'}
                    {project.category === 'Landing Page' && '🎯'}
                    {project.category === 'Web App' && '💻'}
                    {project.category === 'Dashboard' && '📊'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Challenge */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  El Desafío
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  La Solución
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.solution}
                </p>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Características Principales
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Resultados Obtenidos
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(project.results).map(([key, value]) => (
                    <div key={key} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {key === 'conversion' && 'Conversión'}
                        {key === 'sales' && 'Ventas'}
                        {key === 'performance' && 'Performance'}
                        {key === 'loadTime' && 'Tiempo de Carga'}
                        {key === 'mobileUsers' && 'Usuarios Móviles'}
                        {key === 'customerSatisfaction' && 'Satisfacción'}
                        {key === 'efficiency' && 'Eficiencia'}
                        {key === 'leads' && 'Leads'}
                        {key === 'time' && 'Tiempo'}
                        {key === 'responseTime' && 'Tiempo Respuesta'}
                        {key === 'satisfaction' && 'Satisfacción'}
                        {key === 'traffic' && 'Tráfico'}
                        {key === 'bounce' && 'Rebote'}
                        {key === 'seoRanking' && 'Ranking SEO'}
                        {key === 'mobileScore' && 'Score Móvil'}
                        {key === 'productivity' && 'Productividad'}
                        {key === 'collaboration' && 'Colaboración'}
                        {key === 'delivery' && 'Entrega'}
                        {key === 'clientSatisfaction' && 'Satisfacción Cliente'}
                        {key === 'timeTracking' && 'Tracking Tiempo'}
                        {key === 'support' && 'Soporte'}
                        {key === 'response' && 'Respuesta'}
                        {key === 'resolution' && 'Resolución'}
                        {key === 'cost' && 'Costo'}
                        {key === 'availability' && 'Disponibilidad'}
                        {key === 'insights' && 'Insights'}
                        {key === 'decisions' && 'Decisiones'}
                        {key === 'roi' && 'ROI'}
                        {key === 'dataAccuracy' && 'Precisión Datos'}
                        {key === 'userAdoption' && 'Adopción Usuario'}
                        {key === 'timeToInsight' && 'Tiempo a Insight'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-xl">
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">
                  &ldquo;{project.testimonial.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {project.testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {project.testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {project.testimonial.position}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Info */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Información del Proyecto
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</span>
                    <div className="text-gray-900 dark:text-white">{project.client}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Año</span>
                    <div className="text-gray-900 dark:text-white">{project.year}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Duración</span>
                    <div className="text-gray-900 dark:text-white">{project.duration}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">URL</span>
                    <a
                      href={`https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 break-all"
                    >
                      {project.url}
                    </a>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Tecnologías Utilizadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Equipo del Proyecto
                </h3>
                <div className="space-y-2">
                  {project.team.map((role, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-600 dark:text-gray-400">{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-2">
                  ¿Te interesa un proyecto similar?
                </h3>
                <p className="text-white/90 mb-4 text-sm">
                  Podemos ayudarte a crear una solución personalizada para tu negocio.
                </p>
                <Link
                  href="/contacto"
                  className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm block text-center"
                >
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Proyectos Relacionados
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Descubre otros proyectos similares que hemos desarrollado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(projects)
              .filter(([slug]) => slug !== params.slug)
              .slice(0, 3)
              .map(([slug, relatedProject]) => (
                <div key={slug} className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative h-40 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl opacity-30">
                        {relatedProject.category === 'E-commerce' && '🛒'}
                        {relatedProject.category === 'Automatización' && '⚡'}
                        {relatedProject.category === 'IA & Automatización' && '🤖'}
                        {relatedProject.category === 'Landing Page' && '🎯'}
                        {relatedProject.category === 'Web App' && '💻'}
                        {relatedProject.category === 'Dashboard' && '📊'}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {relatedProject.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {relatedProject.description}
                    </p>
                    <Link
                      href={`/proyectos/${slug}`}
                      className="text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      Ver proyecto →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static params for all projects
export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug,
  }));
}