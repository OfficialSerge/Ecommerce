import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { headers } from "next/headers"

import Stripe from 'stripe'
import priceMap from "@/data/productInfo";

import { chain } from "stream-chain"
import { parser } from "stream-json"
import { pick } from "stream-json/filters/Pick"
import { streamValues } from "stream-json/streamers/StreamValues"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

async function calculateOrderAmount(request: NextApiRequest) {
  let line_items: { price: string, quantity: number }[] = []

  const pipeline = chain([
    parser(),
    pick({ filter: 'checkoutData' }),
    streamValues(),
    data => {
      data.value.map((item: Item) => {
        const {
          slug,
          quantity
        } = item

        line_items.push({ price: priceMap.get(slug)!, quantity })
      })
    }
  ])

  for await (const chunk of request.body) {
    pipeline.write(chunk)
  }

  return line_items
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const head = headers()
  const origin = head.get("origin")

  try {
    const line_items = await calculateOrderAmount(req)

    // Create Checkout Sessions from body params.
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      submit_type: 'pay',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      line_items,
      success_url: `${origin}/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    }
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)

    return NextResponse.json({ statusCode: 200, checkoutSession })

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ statusCode: 500, message: errorMessage })
  }
};
