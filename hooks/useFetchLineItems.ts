"use client"

import { fetchPostJSON } from "@/lib/api-helpers"
import { client } from "@/lib/sanity.client"
import { useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"
import { useCartContext } from "@/contexts/CartContext"

export function useFetchLineItems() {
  const [total, setTotal] = useState(0)
  const [lineItems, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const { clearEntry } = useCartContext()

  const searchParams = useSearchParams()
  const session_id = searchParams.get("session_id")

  useEffect(() => {
    async function fetchLineItems() {
      try {
        setLoading(true)

        if (session_id == null) {
          console.warn("?session_id is null")
          return
        }

        const response = await fetchPostJSON('/api/recieve-checkout-data', {
          session_id
        })

        const data = response.body.map((produce: { slug: string, quantity: number }) => {
          return { ...produce }
        })

        const slugs = data.map((produce: { slug: string, quantity: number }) => produce.slug)
        const QUERY = /* groq */`
          *[_type == 'post' && slug.current in ['${slugs.join("','")}']] {
            ...
          }`;

        const posts = await client.fetch(QUERY)

        let tally = 0
        const convertToProduce = posts.map((post: Post) => {
          const produceQuantity = data.filter((produce: { slug: string, quantity: number }) => produce.slug == post.slug.current).quantity
          const produce: Item = {
            title: post.title,
            slug: post.slug.current,
            price: post.price,
            quantity: produceQuantity,
            image: post.images[0],
            checked: true
          }

          tally += post.price * produceQuantity

          clearEntry(produce)
          return produce
        })

        setItems(convertToProduce)
        setTotal(tally)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Internal server error'
        console.warn(errorMessage)

      } finally {
        setLoading(false)
      }
    }

    fetchLineItems()
  }, [session_id])

  return { lineItems, total, loading }
}


