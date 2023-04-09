import algoliasearch from 'algoliasearch';
import { createClient, type SanityDocumentStub } from '@sanity/client'
import indexer from 'sanity-algolia';
import { NextResponse } from 'next/server';

const algolia = algoliasearch(
  "55L0ZMZNID",
  process.env.ALGOLIA_ADMIN_API_KEY!
)

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  // If your dataset is private you need to add a read token.
  // You can mint one at https://manage.sanity.io,
  // token: 'read-token', 
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
})

const QUERY = /* groq */`
*[
  _type == 'post'
  && defined(slug.current)
]`;

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export async function GET() {
  // Configure this to match an existing Algolia index name
  const algoliaIndex = algolia.initIndex('posts')

  const sanityAlgolia = indexer(
    // The first parameter maps a Sanity document type to its respective Algolia
    // search index. Optionally you can also customize how the document is 
    // fetched from Sanity by specifying a GROQ projection.
    //
    // _id and other system fields are handled automatically.
    {
      post: {
        index: algoliaIndex,
        projection: `{
          title,
          price,
          "image": images[0].asset._ref,
          "slug": slug.current,
          "category": {
            "title": categories[0]->title,
            "description": categories[0]->description
          }
        }`,
      },
    },

    // The second parameter is a function that maps from a fetched Sanity document
    // to an Algolia Record. Here you can do further mutations to the data before
    // it is sent to Algolia.
    (document: SanityDocumentStub) => {
      return {
        title: document.title,
        slug: document.slug,
        price: document.price,
        image: document.image,
        category: document.category
      }
    },
    // Visibility function (optional).
    //
    // The third parameter is an optional visibility function. Returning `true`
    // for a given document here specifies that it should be indexed for search
    // in Algolia. This is handy if for instance a field value on the document
    // decides if it should be indexed or not. This would also be the place to
    // implement any `publishedAt` datetime visibility rules or other custom
    // visibility scheme you may be using.
    (document: SanityDocumentStub) => {
      if (document.hasOwnProperty('isHidden')) {
        return !document.isHidden
      }
      return true
    }
  )

  // Finally connect the Sanity webhook payload to Algolia indices via the
  // configured serializers and optional visibility function. `webhookSync` will
  // inspect the webhook payload, make queries back to Sanity with the `sanity`
  // client and make sure the algolia indices are synced to match.
  try {
    const posts = await sanity.fetch(QUERY)

    const webhookbody = {
      ids: {
        created: posts.map((post: Post) => post._id),
        updated: [],
        deleted: []
      }
    }

    sanityAlgolia.webhookSync(sanity, webhookbody)

    return NextResponse.json({
      statusCode: 200,
      body: { message: "Success!" }
    })

  } catch (err) {
    console.log(err)
    return NextResponse.json({
      statusCode: 500,
      body: { message: 'SOMETHING WENT HORRIBLY WRONG!' }
    })
  }
}
