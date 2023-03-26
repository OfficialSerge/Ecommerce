import { createClient } from "next-sanity";
import getURL from "@/lib/getURLs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15"
});

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
] {
    title,
    price,
    "image": images[0].asset._ref,
    "slug": slug.current,
}`;

export async function GET() {
  try {
    const posts = await sanity.fetch(QUERY)

    await posts.map((post: any) => {
      const {
        title,
        price,
        slug,
        image
      } = post

      stripe.products.create({
        name: title,
        id: slug,
        images: [getURL(image).url()],
        default_price_data: {
          currency: "USD",
          unit_amount: price * 100
        }
      });
    })
  } catch (err) {
    return NextResponse.json({
      statusCode: 500,
      body: { message: err }
    })
  }
  return NextResponse.json({
    statusCode: 200,
    body: { message: "Success!" }
  })

}
