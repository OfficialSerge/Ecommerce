"use client"

import { useCartContext } from "@/contexts/cart"

type Props = {
  add?: boolean;
  sub?: boolean;
  post: Post;
  className: string;
}

export default function DynamicButton({ add = false, sub = false, post, className }: Props) {
  const { addOne, subOne } = useCartContext()

  function handleClick() {
    if (add == true) {
      addOne(post)
    }

    if (sub == true) {
      subOne(post)
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
