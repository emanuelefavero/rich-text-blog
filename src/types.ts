export type Post = {
  id: string
  slug: string
  title: string
  description: string
  cover_image: string
  content: string
  author: string
  published_at: string
  updated_at?: string | null
}

export type Message = {
  type: 'success' | 'error'
  text: string
}