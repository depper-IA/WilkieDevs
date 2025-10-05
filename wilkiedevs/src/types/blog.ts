export interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  role: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  author: Author
  category: Category
  tags: string[]
  publishedAt: string
  readingTime: number
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage: string
  }
  relatedPosts?: Post[]
}

export interface Comment {
  id: string
  postId: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  createdAt: string
  replies?: Comment[]
}

export interface BlogPagination {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface BlogListResponse {
  posts: Post[]
  pagination: BlogPagination
}

export interface PostResponse {
  post: Post
  prevPost?: {
    title: string
    slug: string
  }
  nextPost?: {
    title: string
    slug: string
  }
}