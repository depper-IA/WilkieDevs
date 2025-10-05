import type { Metadata } from 'next'
import PostCard from '@/components/blog/PostCard'
import Sidebar from '@/components/blog/Sidebar'
import type { BlogListResponse, Category } from '@/types/blog'

// TODO: Integrar con backend/CMS
const mockData: BlogListResponse = {
  posts: [
    {
      id: '1',
      title: 'Cómo Automatizar tu Marketing Digital con IA',
      slug: 'automatizar-marketing-digital-ia',
      excerpt: 'Descubre las mejores estrategias y herramientas para automatizar tu marketing digital utilizando inteligencia artificial.',
      content: '',
      featuredImage: '/images/blog/marketing-automation.webp',
      author: {
        id: '1',
        name: 'Rebecca IA',
        avatar: '/images/rebecca-avatar.png',
        bio: 'Especialista en Automatización y Marketing Digital',
        role: 'Lead Marketing Strategist',
      },
      category: {
        id: '1',
        name: 'Marketing Digital',
        slug: 'marketing-digital',
        description: 'Artículos sobre marketing digital y estrategias online',
      },
      tags: ['Marketing Digital', 'Automatización', 'IA', 'Estrategia'],
      publishedAt: '2025-10-01T00:00:00Z',
      readingTime: 8,
      seo: {
        title: 'Cómo Automatizar tu Marketing Digital con IA',
        description: 'Aprende a automatizar tu marketing digital con IA',
        keywords: ['marketing digital', 'automatización', 'ia'],
        ogImage: '/images/blog/marketing-automation-og.webp',
      },
    },
    // TODO: Agregar más posts de ejemplo
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

// TODO: Integrar con backend/CMS
const categories: Category[] = [
  {
    id: '1',
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    description: 'Artículos sobre marketing digital y estrategias online',
  },
  {
    id: '2',
    name: 'Desarrollo Web',
    slug: 'desarrollo-web',
    description: 'Tutoriales y guías sobre desarrollo web',
  },
  {
    id: '3',
    name: 'Automatización',
    slug: 'automatizacion',
    description: 'Recursos sobre automatización de procesos',
  },
  {
    id: '4',
    name: 'Inteligencia Artificial',
    slug: 'inteligencia-artificial',
    description: 'Novedades y aplicaciones de IA',
  },
]

export const metadata: Metadata = {
  title: 'Blog - WilkieDevs',
  description: 'Artículos sobre desarrollo web, automatización y tecnología',
}

export default function BlogPage() {
  const { posts, pagination } = mockData
  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  // TODO: Implementar lógica para obtener tags populares
  const popularTags = [
    'Desarrollo Web',
    'Automatización',
    'IA',
    'Marketing Digital',
    'APIs',
    'WordPress',
    'Next.js',
    'n8n',
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Cabecera */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-text-light mb-4">
            Blog de WilkieDevs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Artículos, tutoriales y noticias sobre desarrollo web, automatización,
            inteligencia artificial y tecnología.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Posts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post Destacado */}
            {featuredPost && (
              <PostCard post={featuredPost} variant="featured" />
            )}

            {/* Posts Regulares */}
            <div className="grid md:grid-cols-2 gap-6">
              {regularPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  disabled={!pagination.hasPreviousPage}
                  className="btn-secondary disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  disabled={!pagination.hasNextPage}
                  className="btn-secondary disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Sidebar
              categories={categories}
              recentPosts={posts.slice(0, 5)}
              tags={popularTags}
              adSlot={
                <div className="bg-gray-200 dark:bg-gray-800 aspect-square rounded flex items-center justify-center">
                  {/* TODO: Integrar Google AdSense */}
                  <p className="text-sm text-gray-500">Espacio Publicitario</p>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}