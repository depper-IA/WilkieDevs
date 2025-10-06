import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDate } from '@/utils/dates'
import Sidebar from '@/components/blog/Sidebar'
import Comments from '@/components/blog/Comments'
import type { Post, Category } from '@/types/blog'

interface Props {
  params: {
    slug: string
  }
}

// TODO: Integrar con backend/CMS
const getPostBySlug = async (slug: string): Promise<Post | null> => {
  // Simulación de post
  const post: Post = {
    id: '1',
    title: 'Cómo Automatizar tu Marketing Digital con IA',
    slug: 'automatizar-marketing-digital-ia',
    excerpt: 'Descubre las mejores estrategias y herramientas para automatizar tu marketing digital utilizando inteligencia artificial.',
    content: `
      # Cómo Automatizar tu Marketing Digital con IA

      La automatización del marketing digital utilizando inteligencia artificial se ha convertido en una necesidad para las empresas modernas. En este artículo, exploraremos las mejores estrategias y herramientas para implementar una automatización efectiva.

      ## ¿Por qué automatizar tu marketing digital?

      La automatización del marketing ofrece numerosos beneficios:

      - Ahorro de tiempo y recursos
      - Mayor eficiencia en las campañas
      - Personalización a escala
      - Análisis de datos en tiempo real

      ## Herramientas recomendadas

      1. **n8n**: Plataforma de automatización de flujos de trabajo
      2. **Make (Integromat)**: Automatización visual de procesos
      3. **Zapier**: Integración entre aplicaciones
      4. **ChatGPT**: Generación de contenido y análisis

      ## Estrategias de implementación

      ### 1. Segmentación automática
      
      Utiliza IA para segmentar tu audiencia basándote en comportamientos y preferencias.

      ### 2. Personalización de contenido
      
      Implementa sistemas de recomendación basados en IA para mostrar contenido relevante.

      ### 3. Optimización de campañas
      
      Usa algoritmos de aprendizaje automático para optimizar tus campañas en tiempo real.

      ## Casos de éxito

      Aquí algunos ejemplos de empresas que han implementado estas estrategias...
    `,
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
  }

  return post.slug === slug ? post : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: `${post.title} - WilkieDevs Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      images: [post.seo.ogImage],
    },
  }
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
]

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido Principal */}
          <article className="lg:col-span-2 space-y-8">
            {/* Cabecera */}
            <header className="space-y-4">
              <Link
                href={`/blog/categoria/${post.category.slug}`}
                className="text-primary dark:text-accent hover:opacity-80"
              >
                {post.category.name}
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-text-light">
                {post.title}
              </h1>
              <div className="flex items-center gap-4">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-secondary dark:text-text-light">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.publishedAt)} · {post.readingTime} min lectura
                  </p>
                </div>
              </div>
            </header>

            {/* Imagen Destacada */}
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Contenido */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* TODO: Implementar parseador de Markdown */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-primary hover:text-white dark:hover:bg-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Autor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-6">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-secondary dark:text-text-light mb-2">
                    {post.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.author.bio}
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="text-primary dark:text-accent hover:opacity-80"
                    >
                      Twitter
                    </a>
                    <a
                      href="#"
                      className="text-primary dark:text-accent hover:opacity-80"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Comentarios */}
            <Comments
              postId={post.id}
              initialComments={[
                // TODO: Integrar con backend
                {
                  id: '1',
                  postId: post.id,
                  author: {
                    name: 'Usuario Ejemplo',
                    email: 'usuario@example.com',
                    avatar: '/images/default-avatar.png',
                  },
                  content: '¡Excelente artículo! Muy útil la información sobre automatización.',
                  createdAt: '2025-10-05T12:00:00Z',
                },
              ]}
            />
          </article>

          {/* Sidebar */}
          <div>
            <Sidebar
              categories={categories}
              recentPosts={[post]} // TODO: Obtener posts recientes del backend
              tags={post.tags}
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