import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

import Stripe from 'stripe'

import { chain } from "stream-chain"
import { parser } from "stream-json"
import { pick } from "stream-json/filters/Pick"
import { streamValues } from "stream-json/streamers/StreamValues"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

async function parseSessionID(request: NextApiRequest) {
  let session_id = ""

  const pipeline = chain([
    parser(),
    pick({ filter: 'session_id' }),
    streamValues(),
    data => {
      session_id = data.value
    }
  ])

  for await (const chunk of request.body) {
    pipeline.write(chunk)
  }

  return session_id
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session_id = await parseSessionID(req)
    const session = await stripe.checkout.sessions.listLineItems(session_id)

    const body = session.data.map((produce) => {
      return { slug: produce.price?.product, quantity: produce.quantity }
    })

    return NextResponse.json({ statusCode: 200, body })

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ statusCode: 500, message: errorMessage })
  }
};
