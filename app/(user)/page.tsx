import '../globals.css'

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import Grid from '@/components/Grid'

const QUERY_POSTS = groq`
*[_type == 'post'] {
  ...,
  categories[]->,
} | order(_createdAt desc)
`;

export default async function Home() {
  const posts = await client.fetch(QUERY_POSTS);
  return (
    <Grid posts={posts} />
  )
}
