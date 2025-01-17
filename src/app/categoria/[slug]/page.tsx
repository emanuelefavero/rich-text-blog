import OrderBy from '@/components/OrderBy'
import Pagination from '@/components/Pagination'
import PostList from '@/components/PostList'
import Section from '@/components/Section'
import Title from '@/components/Title'
import { CATEGORY_SLUGS } from '@/config/categories'
import { POSTS_PER_PAGE } from '@/config/posts'
import { TITLE } from '@/data/title'
import { getPosts, getTotalPostCountByCategory } from '@/lib/posts'
import type { CategorySlug, OrderBy as OrderByType } from '@/types'
import { convertSlugToName } from '@/utils/slug'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// TIP: This is how you can get both the slug and searchParams from the URL
type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; order_by?: OrderByType }>
}

// * Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = convertSlugToName(slug)

  // TIP: No need to check if the category is valid, because the page will redirect home if it's not. @see redirect('/') method below

  return {
    title: `${category} - ${TITLE}`,
    description: `Tutti i post di ${TITLE} nella categoria ${category}.`,
  }
}

// * Page
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const { page, order_by } = await searchParams

  // Redirect to the homepage if the category slug is not valid
  if (!CATEGORY_SLUGS.includes(slug as CategorySlug)) redirect('/')

  const category = convertSlugToName(slug)
  const currentOrderBy = order_by || 'published_at'
  const currentPage = parseInt(page || '1', 10)
  const totalPosts = await getTotalPostCountByCategory(category)
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const posts = await getPosts(
    currentPage,
    POSTS_PER_PAGE,
    currentOrderBy,
    category,
  )

  return (
    <>
      <Section>
        <OrderBy currentOrderBy={currentOrderBy} />
        <Title>
          {category}{' '}
          {currentOrderBy === 'title' ? (
            <sup className='text-pink-600 dark:text-pink-400'>A-Z</sup>
          ) : null}
        </Title>

        <PostList posts={posts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          currentOrderBy={currentOrderBy}
        />
      </Section>
    </>
  )
}
