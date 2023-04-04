"use client"

import { useCartContext } from "@/contexts/CartContext"

import Card from './Card'

export default function Grid({ posts }: { posts: Post[] }) {
  const { basket } = useCartContext()

  return (
    <div className={basket.length > 0 ? 'shopLayout md:shopLayoutMarginR' : 'shopLayout'}>
      {posts.map((post, idx) => {
        return <Card post={post} key={idx} />
      })}
    </div>
  )
}
