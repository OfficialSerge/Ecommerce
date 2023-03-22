import '../globals.css'

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import Grid from '@/components/Grid'

const QUERY_POSTS = groq`
*[
  _type == 'post'
  && defined(slug.current)
] {
  ...,
}
`;

const ALGOLIA = /* groq */`
*[
  _type == 'post'
  && defined(slug.current)
] {
  title,
  price,
  "image": images[0].asset._ref,
  "category": {
    "title": categories[0]->title,
    "description": categories[0]->description
  }
}`;

export default async function Home() {
  const posts = await client.fetch(QUERY_POSTS);

  return (
    <Grid posts={posts} />
  )
}
