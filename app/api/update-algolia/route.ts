import algoliasearch from 'algoliasearch';
import { createClient, type SanityDocumentStub } from '@sanity/client'
import type { VercelRequest, VercelResponse } from '@vercel/node';
import indexer from 'sanity-algolia';

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

const ALGOLIA_DATA = /* groq */`
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


/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
export async function POST(req: VercelRequest, res: VercelResponse) {
  // Tip: Add webhook secrets to verify that the request is coming from Sanity.
  // See more at: https://www.sanity.io/docs/webhooks#bfa1758643b3
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.json({ message: 'Bad request' })
    return
  }

  // Configure this to match an existing Algolia index name
  const algoliaIndex = algolia.initIndex('posts')

  const sanityAlgolia = indexer(
    // The first parameter maps a Sanity document type to its respective Algolia
    // search index. In this example both `post` and `article` Sanity types live
    // in the same Algolia index. Optionally you can also customize how the
    // document is fetched from Sanity by specifying a GROQ projection.
    //
    // _id and other system fields are handled automatically.
    {
      post: {
        index: algoliaIndex,
        projection: `{
          title,
          price,
          "image": images[0].asset._ref
        }`,
      },
      // For the article document in this example we want to resolve a list of
      // references to authors and get their names as an array. We can do this
      // directly in the GROQ query in the custom projection.
      category: {
        index: algoliaIndex,
        projection: `{
          title,
          description
        }`,
      },
    },

    // The second parameter is a function that maps from a fetched Sanity document
    // to an Algolia Record. Here you can do further mutations to the data before
    // it is sent to Algolia.
    (document: SanityDocumentStub) => {
      switch (document._type) {
        case 'post':
          return {
            title: document.title,
            price: document.price,
            image: document.image
          }
        case 'category':
          return {
            title: document.title,
            description: document.description
          }
        default:
          return document
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
  return sanityAlgolia
    .webhookSync(sanity, req.body)
    .then(() => ({
      statusCode: 200,
      body: JSON.stringify({ message: 'Success!' })
    }))
    .catch(err => {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'SOMETHING WENT HORRIBLY WRONG!' })
      }
    })
}
