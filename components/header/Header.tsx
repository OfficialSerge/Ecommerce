"use client"

import algoliasearch from 'algoliasearch/lite';
import { Hits, Configure, InstantSearch, SearchBox, useSearchBox, HitsProps } from 'react-instantsearch-hooks-web';

import { useRouter } from "next/navigation";

import Image from 'next/image';
import getURL from '@/lib/getURLs';

const algoliaClient = algoliasearch(
  '55L0ZMZNID',
  '44e9cf45b67ca2ba66003e425a368dac'
);

const searchClient = {
  ...algoliaClient,
  search(requests: any) {
    if (requests.every(({ params }: { params: any }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }
    return algoliaClient.search(requests);
  },
};

function Hit({ hit }: any) {
  const { clear } = useSearchBox()
  const router = useRouter()

  const {
    title,
    slug,
    category,
    price,
    image
  } = hit

  return (
    <article
      className='h-full flex hover:bg-blue-300 cursor-pointer'
      onClick={() => {
        router.push(`/${slug}`)
        clear()
      }}
    >
      <div className='relative h-20 w-20 mx-5 my-auto'>
        <Image
          className='object-cover object-center rounded-lg cursor-pointer'
          src={getURL(hit.image).url()}
          alt={image}
          fill
          sizes="25vw"
        />
      </div>
      <div className='py-2 flex flex-col flex-1 mr-5'>
        <h1 className='inline-flex w-full h-fit justify-between'>
          <p>{title}</p>
          <p>${price}</p>
        </h1>
        <p className='text-slate-400'>Category: {category.title}</p>
        <p className='text-slate-400'>Description: {category.description}</p>
      </div>
    </article>
  );
}

export default function Header() {
  // const [hidden, setHidden] = useState(false)

  return (
    <div className='relative h-20 mx-auto z-20 mt-5 w-[75vw] md:w-[33vw]'>
      <InstantSearch searchClient={searchClient} indexName="posts">
        <Configure hitsPerPage={7} />
        <SearchBox classNames={{
          root: 'w-full h-10 flex',
          form: 'relative h-10 w-full',
          input: 'h-full w-full pl-3 rounded outline-none focus:border-2 focus:border-gas-pedal',
          submit: 'absolute w-[2rem] right-0 h-10 bg-gas-pedal rounded-r',
          reset: 'hidden',
          submitIcon: 'mx-auto'
        }}
        // onBlur={() => setHidden(true)}
        // onFocus={() => setHidden(false)}
        />
        <Hits classNames={{
          root: `w-[75vw] md:w-[33vw] bg-white`,
          // root: `w-fit bg-white ${hidden == true ? "hidden" : ""}`,
          list: "w-full grid grid-flow-row-dense grid-cols-1",
          item: "w-full h-24 border-t-2 border-tea-green"
        }}
          hitComponent={Hit}
        />

      </InstantSearch>
    </div>
  );
}
