import Link from 'next/link'

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

import ProductWindow from '@/components/ProductWindow';
import DynamicButton from '@/components/DynamicButton';

const QUERY_POSTS = groq`
*[_type == 'post'] {
  ...,
  categories[]->,
} | order(_createdAt desc)
`;

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await client.fetch(QUERY_POSTS);

  return posts.map((post: Post) => ({
    slug: post.slug.current,
  }));
}

async function getPost(slug: string) {
  const QUERY_PAGE_POST = groq`
  *[_type == 'post' && slug.current == '${slug}'] {
  ...,
  categories[]->,
  } | order(_createdAt desc)
  `;

  const post = await client.fetch(QUERY_PAGE_POST)
  return post[0]
}

// multiple versions of this page will be statically generated
// using the `params` returned by `generatestaticparams`
export default async function page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  // very odd, seems like it's undefined for a split 
  // second, shouldn't it just wait for it to come in???
  // console.log(data)

  const {
    body,
    categories,
    images,
    price,
    title,
    slug
  } = post

  return (
    <div className='text-lg text-center mx-4'>
      <br />
      <div className='flex flex-col md:flex-row justify-between lg:justify-around'>
        <ProductWindow imgs={images} />
        <div className='flex flex-col-reverse md:flex-col justify-between'>
          <p className='text-2xl'>{title} ${price}</p>
          <div className='flex flex-col gap-4 2xl:flex-row my-10'>
            <DynamicButton className='largeButton' add={true} post={post} />
            <DynamicButton className='largeButton' sub={true} post={post} />
          </div>
        </div>
      </div>
      <p className='mt-6'>{body[0].children[0].text}</p>
      <br />
      <Link href="/">HOME</Link>
    </div>
  )
}

