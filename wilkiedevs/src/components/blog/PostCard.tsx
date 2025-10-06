import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/dates'
import type { Post } from '@/types/blog'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group">
        <article className="flex gap-4 items-start">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary dark:text-text-light group-hover:text-primary dark:group-hover:text-accent line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(post.publishedAt)} · {post.readingTime} min lectura
            </p>
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="group">
        <article className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
          <div className="relative h-64 md:h-full">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
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
            <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-text-light group-hover:text-primary dark:group-hover:text-accent mb-4">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-48">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-secondary dark:text-text-light">
                {post.author.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.publishedAt)} · {post.readingTime} min lectura
              </p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-secondary dark:text-text-light group-hover:text-primary dark:group-hover:text-accent mb-3">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}