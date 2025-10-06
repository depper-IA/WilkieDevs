import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Portafolio - WilkieDevs',
  description: 'Explora nuestro portafolio completo de proyectos de desarrollo web, automatización y marketing digital.',
};

const projects = [
  {
    id: 1,
    slug: 'ecommerce-moderno',
    title: "E-commerce Moderno",
    description: "Tienda online completa con sistema de pagos, inventario y analytics avanzados.",
    image: "/images/projects/ecommerce-modern.jpg",
    category: "E-commerce",
    technologies: ["Next.js", "Stripe", "Supabase", "Tailwind CSS"],
    url: "ecommerce-demo.wilkiedevs.com",
    featured: true,
    client: "TechStore Colombia",
    year: "2024",
    results: {
      conversion: "+150%",
      sales: "+300%",
      performance: "95/100"
    }
  },
  {
    id: 2,
    slug: 'crm-automatizacion',
    title: "Sistema de Automatización CRM",
    description: "Automatización completa de procesos de ventas y seguimiento de clientes.",
    image: "/images/projects/crm-automation.jpg",
    category: "Automatización",
    technologies: ["n8n", "Supabase", "React", "Node.js"],
    url: "crm-demo.wilkiedevs.com",
    featured: true,
    client: "Inmobiliaria Premium",
    year: "2024",
    results: {
      efficiency: "+80%",
      leads: "+200%",
      time: "-60%"
    }
  },
  {
    id: 3,
    slug: 'landing-corporativa',
    title: "Landing Page Corporativa",
    description: "Sitio web corporativo con diseño moderno y optimizado para conversiones.",
    image: "/images/projects/corporate-landing.jpg",
    category: "Landing Page",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    url: "corporate-demo.wilkiedevs.com",
    featured: false,
    client: "Consultoría Estratégica",
    year: "2024",
    results: {
      traffic: "+120%",
      bounce: "-45%",
      leads: "+180%"
    }
  },
  {
    id: 4,
    slug: 'gestion-proyectos',
    title: "App de Gestión de Proyectos",
    description: "Aplicación web para gestión de proyectos con colaboración en tiempo real.",
    image: "/images/projects/project-management.jpg",
    category: "Web App",
    technologies: ["React", "Socket.io", "MongoDB", "Express"],
    url: "projects-demo.wilkiedevs.com",
    featured: false,
    client: "Agencia Creativa",
    year: "2023",
    results: {
      productivity: "+90%",
      collaboration: "+150%",
      delivery: "+40%"
    }
  },
  {
    id: 5,
    slug: 'chatbot-ia',
    title: "Chatbot Inteligente",
    description: "Chatbot con IA para atención al cliente y generación de leads.",
    image: "/images/projects/ai-chatbot.jpg",
    category: "IA & Automatización",
    technologies: ["OpenAI", "n8n", "React", "Supabase"],
    url: "chatbot-demo.wilkiedevs.com",
    featured: true,
    client: "E-learning Platform",
    year: "2024",
    results: {
      support: "+200%",
      satisfaction: "95%",
      response: "-80%"
    }
  },
  {
    id: 6,
    slug: 'dashboard-analytics',
    title: "Dashboard Analytics",
    description: "Dashboard personalizado para visualización de datos y métricas de negocio.",
    image: "/images/projects/analytics-dashboard.jpg",
    category: "Dashboard",
    technologies: ["React", "D3.js", "PostgreSQL", "Express"],
    url: "analytics-demo.wilkiedevs.com",
    featured: false,
    client: "Startup Fintech",
    year: "2023",
    results: {
      insights: "+300%",
      decisions: "+150%",
      roi: "+250%"
    }
  }
];

const categories = ["Todos", "E-commerce", "Landing Page", "Web App", "Automatización", "IA & Automatización", "Dashboard"];

export default function PortfolioPage() {
  const featuredProjects = projects.filter(p => p.featured);
  const allProjects = projects;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nuestro Portafolio
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Descubre los proyectos que hemos desarrollado y los resultados extraordinarios 
            que hemos logrado para nuestros clientes.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Proyectos Completados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Satisfacción del Cliente</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">200%</div>
              <div className="text-gray-600 dark:text-gray-400">ROI Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <div className="text-gray-600 dark:text-gray-400">Tiempo de Respuesta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Proyectos Destacados
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Estos son algunos de nuestros proyectos más exitosos que han transformado 
              los negocios de nuestros clientes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {featuredProjects.map((project) => (
              <div key={project.id} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl opacity-20">
                        {project.category === 'E-commerce' && '🛒'}
                        {project.category === 'Automatización' && '⚡'}
                        {project.category === 'IA & Automatización' && '🤖'}
                        {project.category === 'Landing Page' && '🎯'}
                        {project.category === 'Web App' && '💻'}
                        {project.category === 'Dashboard' && '📊'}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <a
                        href={`https://${project.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      </a>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {project.description}
                    </p>

                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Cliente: {project.client}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {Object.entries(project.results).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-primary">{value}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {key === 'conversion' && 'Conversión'}
                            {key === 'sales' && 'Ventas'}
                            {key === 'performance' && 'Performance'}
                            {key === 'efficiency' && 'Eficiencia'}
                            {key === 'leads' && 'Leads'}
                            {key === 'time' && 'Tiempo'}
                            {key === 'traffic' && 'Tráfico'}
                            {key === 'bounce' && 'Rebote'}
                            {key === 'productivity' && 'Productividad'}
                            {key === 'collaboration' && 'Colaboración'}
                            {key === 'delivery' && 'Entrega'}
                            {key === 'support' && 'Soporte'}
                            {key === 'satisfaction' && 'Satisfacción'}
                            {key === 'response' && 'Respuesta'}
                            {key === 'insights' && 'Insights'}
                            {key === 'decisions' && 'Decisiones'}
                            {key === 'roi' && 'ROI'}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action */}
                    <Link
                      href={`/proyectos/${project.slug}`}
                      className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center block"
                    >
                      Ver Caso de Estudio
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Todos los Proyectos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explora nuestro portafolio completo de proyectos en diferentes industrias y tecnologías.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <div key={project.id} className="group">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-30">
                        {project.category === 'E-commerce' && '🛒'}
                        {project.category === 'Automatización' && '⚡'}
                        {project.category === 'IA & Automatización' && '🤖'}
                        {project.category === 'Landing Page' && '🎯'}
                        {project.category === 'Web App' && '💻'}
                        {project.category === 'Dashboard' && '📊'}
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-gray-500 text-xs px-2 py-1">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/proyectos/${project.slug}`}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-medium transition-colors text-center text-sm"
                      >
                        Ver Detalles
                      </Link>
                      <a
                        href={`https://${project.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Quieres ser nuestro próximo caso de éxito?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Conversemos sobre tu proyecto y cómo podemos ayudarte a alcanzar resultados extraordinarios.
          </p>
          <Link
            href="/contacto"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors inline-flex items-center shadow-lg"
          >
            Iniciar mi Proyecto
          </Link>
        </div>
      </section>
    </div>
  );
}