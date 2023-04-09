import Link from 'next/link'

import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

import ProductWindow from '@/components/utils/ProductWindow';
import DynamicButton from '@/components/utils/DynamicButton';

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
  } = post

  const description = body[0].children[0].text
  const formatter = Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
  })

  return (
    <div className='text-lg mx-4'>
      <br />
      <div className='flex flex-col md:flex-row justify-between'>
        <ProductWindow imgs={images} />
        <div className='flex flex-col-reverse justify-between md:flex-col md:mx-9 md:w-[40vw] 2xl:h-[30vmax]'>
          <div>
            <div className='inline-flex justify-between w-full'>
              <p className='text-2xl 2xl:text-4xl'>{title}</p>
              <p className='text-2xl 2xl:text-4xl'>{formatter.format(price)}</p>
            </div>
            <p className='mr-auto 2xl:text-2xl'>{categories[0].title}</p>
            <p className='mt-6 text-base xl:text-lg 2xl:text-xl'>{description}</p>
          </div>
          <div className='flex flex-col gap-4 xl:flex-row my-10'>
            <DynamicButton className='largeButton' add={true} post={post} />
            <DynamicButton className='largeButton' sub={true} post={post} />
          </div>
        </div>
      </div>
      <Link className='group/link hidden md:block w-fit p-3 rounded hover:bg-gas-pedal/60 transition' href="/">
        <svg className='fill-gas-pedal group-hover/link:fill-navy transition' xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
          <path d="M480 898.63 157.37 576 480 253.37l47.978 47.739-240.586 240.826H802.63v68.13H287.392l240.586 240.587L480 898.63Z" />
        </svg>
      </Link>
    </div>
  )
}

