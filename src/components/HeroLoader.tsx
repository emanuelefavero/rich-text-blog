import Hero from '@/components/Hero'
import { getLatestPost } from '@/lib/posts'

export default async function Component() {
  const latestPost = await getLatestPost()

  return <Hero post={latestPost} className='flex-1' />
}
