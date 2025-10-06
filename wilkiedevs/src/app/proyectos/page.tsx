import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Proyectos - WilkieDevs',
  description: 'Explora nuestro portafolio de proyectos de desarrollo web, automatización y marketing digital.',
};

const projects = [
  {
    id: 1,
    title: "E-commerce Moderno",
    description: "Tienda online completa con sistema de pagos, inventario y analytics avanzados.",
    image: "/images/projects/ecommerce-modern.jpg",
    category: "E-commerce",
    technologies: ["Next.js", "Stripe", "Supabase", "Tailwind CSS"],
    url: "ecommerce-demo.wilkiedevs.com",
    href: "/portfolio/ecommerce-moderno",
    featured: true
  },
  {
    id: 2,
    title: "Sistema de Automatización CRM",
    description: "Automatización completa de procesos de ventas y seguimiento de clientes.",
    image: "/images/projects/crm-automation.jpg",
    category: "Automatización",
    technologies: ["n8n", "Supabase", "React", "Node.js"],
    url: "crm-demo.wilkiedevs.com",
    href: "/portfolio/crm-automatizacion",
    featured: true
  },
  {
    id: 3,
    title: "Landing Page Corporativa",
    description: "Sitio web corporativo con diseño moderno y optimizado para conversiones.",
    image: "/images/projects/corporate-landing.jpg",
    category: "Landing Page",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS"],
    url: "corporate-demo.wilkiedevs.com",
    href: "/portfolio/landing-corporativa",
    featured: false
  },
  {
    id: 4,
    title: "App de Gestión de Proyectos",
    description: "Aplicación web para gestión de proyectos con colaboración en tiempo real.",
    image: "/images/projects/project-management.jpg",
    category: "Web App",
    technologies: ["React", "Socket.io", "MongoDB", "Express"],
    url: "projects-demo.wilkiedevs.com",
    href: "/portfolio/gestion-proyectos",
    featured: false
  },
  {
    id: 5,
    title: "Chatbot Inteligente",
    description: "Chatbot con IA para atención al cliente y generación de leads.",
    image: "/images/projects/ai-chatbot.jpg",
    category: "IA & Automatización",
    technologies: ["OpenAI", "n8n", "React", "Supabase"],
    url: "chatbot-demo.wilkiedevs.com",
    href: "/portfolio/chatbot-ia",
    featured: true
  },
  {
    id: 6,
    title: "Dashboard Analytics",
    description: "Dashboard personalizado para visualización de datos y métricas de negocio.",
    image: "/images/projects/analytics-dashboard.jpg",
    category: "Dashboard",
    technologies: ["React", "D3.js", "PostgreSQL", "Express"],
    url: "analytics-demo.wilkiedevs.com",
    href: "/portfolio/dashboard-analytics",
    featured: false
  }
];

const categories = ["Todos", "E-commerce", "Landing Page", "Web App", "Automatización", "IA & Automatización", "Dashboard"];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nuestros Proyectos
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explora algunos de los proyectos que hemos desarrollado para nuestros clientes.
            Cada uno representa nuestra pasión por la innovación y la excelencia.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Featured Projects */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Proyectos Destacados
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(p => p.featured).map((project) => (
                <div key={project.id} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-20">🚀</div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link
                          href={project.href}
                          className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                        >
                          Ver Detalles
                        </Link>
                        <a
                          href={`https://${project.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Projects */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Todos los Proyectos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Project Image */}
                    <div className="relative h-40 bg-gradient-to-br from-primary/10 to-secondary/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl opacity-30">
                          {project.category === 'E-commerce' && '🛒'}
                          {project.category === 'Landing Page' && '🎯'}
                          {project.category === 'Web App' && '💻'}
                          {project.category === 'Automatización' && '⚡'}
                          {project.category === 'IA & Automatización' && '🤖'}
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
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs"
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
                          href={project.href}
                          className="flex-1 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded font-medium transition-colors text-center text-sm"
                        >
                          Ver Proyecto
                        </Link>
                        <a
                          href={`https://${project.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Tienes un proyecto en mente?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Conversemos sobre cómo podemos ayudarte a materializar tu idea y llevar tu negocio al siguiente nivel.
          </p>
          <Link
            href="/contacto"
            className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-medium text-lg transition-colors inline-flex items-center shadow-lg"
          >
            Iniciar Proyecto
          </Link>
        </div>
      </section>
    </div>
  );
}