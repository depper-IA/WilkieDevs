import Link from 'next/link'
import Image from 'next/image'
import type { Category, Post } from '@/types/blog'

interface SidebarProps {
  categories: Category[]
  recentPosts: Post[]
  tags: string[]
  adSlot?: React.ReactNode
}

export default function Sidebar({ categories, recentPosts, tags, adSlot }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Buscador */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-secondary dark:text-text-light mb-4">
          Buscar en el blog
        </h3>
        <form className="relative">
          <input
            type="search"
            placeholder="Buscar artículos..."
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-secondary dark:text-text-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Buscar"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* AdSense Slot */}
      {adSlot && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          {adSlot}
        </div>
      )}

      {/* Categorías */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-secondary dark:text-text-light mb-4">
          Categorías
        </h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/blog/categoria/${category.slug}`}
                className="flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              >
                <span>{category.name}</span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-sm">
                  {/* TODO: Agregar contador de posts por categoría */}
                  10
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Posts Recientes */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-secondary dark:text-text-light mb-4">
          Artículos Recientes
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex gap-3 group"
            >
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h4 className="text-secondary dark:text-text-light group-hover:text-primary dark:group-hover:text-accent font-medium line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {post.readingTime} min lectura
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-secondary dark:text-text-light mb-4">
          Tags Populares
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag.toLowerCase()}`}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-primary hover:text-white dark:hover:bg-accent transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-primary dark:bg-accent text-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-2">
          ¿Te gustaría recibir más contenido?
        </h3>
        <p className="text-gray-100 mb-4">
          Suscríbete a nuestro newsletter y recibe consejos de automatización y desarrollo web.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Tu email"
            className="w-full px-4 py-2 bg-white/10 placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-white text-primary dark:text-accent font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Suscribirme
          </button>
        </form>
      </div>
    </aside>
  )
}