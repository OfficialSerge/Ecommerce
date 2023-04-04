"use client"

import { useCartContext } from "@/contexts/CartContext"

type Props = {
  add?: boolean;
  sub?: boolean;
  post: Post;
  className: string;
}

export default function DynamicButton({ add = false, sub = false, post, className }: Props) {
  const { addOne, subOne } = useCartContext()

  const produce: Item = {
    title: post.title,
    slug: post.slug.current,
    price: post.price,
    quantity: 1,
    image: post.images[0],
    checked: true
  }

  function handleClick() {
    if (add == true) {
      addOne(produce)
    }

    if (sub == true) {
      subOne(produce)
    }
  }

  // className comes from the parent, I wanted 
  // a button that could perform the same logic 
  // but with different shapes so I could use 
  // it in multiple different places etc.
  //
  // define className in globals.css and reference
  // value in parent component, lgtm!
  return (
    <button className={className} onClick={handleClick}>
      {add == true ? "add" : "remove"}
    </button>
  )

}
