"use client"

import algoliasearch from 'algoliasearch/lite';

import { Hits, Configure, InstantSearch, SearchBox, useSearchBox } from 'react-instantsearch-hooks-web';

import { useRouter } from "next/navigation";
import Image from 'next/image';
import getURL from "../lib/getURLs";

const algoliaClient = algoliasearch(
  '55L0ZMZNID',
  '44e9cf45b67ca2ba66003e425a368dac'
);

const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
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

// Using items and results
// const transformItems: UseHitsProps['transformItems'] = (items, { results }) => {
//   return items.map((item, index) => ({
//     ...item,
//     position: { index, page: results.page },
//   }));
// };
//
// function CustomHits(props: UseHitsProps) {
//   const { hits } = useHits({ ...props, transformItems })
//   const { clear } = useSearchBox()
//   const router = useRouter()
//
//   return (
//     hits.map((hit, idx) => {
//       const {
//         title,
//         slug,
//         category,
//         price,
//         image
//       } = hit
//
//       return (
//         <article
//           className='h-full flex hover:bg-blue-300 cursor-pointer'
//           onClick={() => {
//             router.push(`/${slug}`)
//             clear()
//           }}
//         >
//           <div className='relative h-20 w-20 mx-5 my-auto'>
//             <Image
//               className='object-cover object-center rounded-lg cursor-pointer'
//               src={getURL(hit.image).url()}
//               alt={image}
//               fill
//               sizes="25vw"
//             />
//           </div>
//           <div className='py-2 flex flex-col flex-1 mr-5'>
//             <h1 className='inline-flex w-full h-fit justify-between'>
//               <p>{title}</p>
//               <p>${price}</p>
//             </h1>
//             <p className='text-slate-400'>Category: {category.title}</p>
//             <p className='text-slate-400'>Description: {category.description}</p>
//           </div>
//         </article>
//       )
//     })
//   )
// }

function Hit({ hit }) {
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
    <div className='relative h-20 w-fit mx-auto z-10 mt-5'>
      <InstantSearch searchClient={searchClient} indexName="posts">
        <Configure hitsPerPage={7} />
        <SearchBox classNames={{
          root: 'w-fit h-10 flex',
          form: 'relative h-10',
          input: 'h-full w-[32rem] px-3 rounded outline-none focus:border-2 focus:border-red-200',
          submit: 'absolute w-[2rem] left-[30rem] left-0 h-10 bg-red-200 rounded-r',
          reset: 'hidden',
          submitIcon: 'mx-auto'
        }}
        // onBlur={() => setHidden(true)}
        // onFocus={() => setHidden(false)}
        />
        <Hits classNames={{
          root: `w-fit bg-white`,
          // root: `w-fit bg-white ${hidden == true ? "hidden" : ""}`,
          list: "w-[32rem] grid grid-flow-row-dense grid-cols-1 first:border-t-2 first:border-slate-200",
          item: "w-full h-24 border-b-2 border-slate-200"
        }}
          hitComponent={Hit}
        />

      </InstantSearch>
    </div>
  );
}
