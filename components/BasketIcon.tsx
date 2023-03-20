"use client"

import Image from "next/image"
import getURL from "@/lib/getURLs"
import { useCartContext } from "@/contexts/cart"

export default function BasketIcon({ produce }: { produce: Item }) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const { setQuantity, clearEntry } = useCartContext()

  const {
    slug,
    price,
    image,
    quantity
  } = produce

  function handleChange() {
    const elementId = "quantity-" + slug
    const value = document.getElementById(elementId).value!

    setQuantity(produce, parseInt(value))
  }

  return (
    <div className="invisible md:basketIcon">
      <div className="relative mx-auto w-10/12 h-20">
        <Image
          className="object-cover object-center rounded-lg"
          src={getURL(image).url()}
          alt="CARD HERE"
          fill
          // sizes="100vw, (min-width: 768px) 50vw, (min-width: 1024px) 33vw"
          sizes="30vw"
        />
      </div>
      <p>${price}</p>
      <div className="relative w-28 h-8 mx-auto my-2">
        <label className="absolute top-0 left-0 w-16 h-full bg-gray-200 border border-black rounded" htmlFor={"quantity-" + slug}>{quantity}</label>

        <select className="absolute top-0 left-0 w-16 h-full z-10 bg-transparent text-gray-200 cursor-pointer"
          name="quantity" id={"quantity-" + slug}
          onChange={handleChange}
        >
          {nums.map((num) => {
            return <option key={num} value={num}>{num}</option>
          })}
        </select>

        <button
          className="absolute right-0 w-8 h-8 rounded border border-red-700 bg-red-300 text-red-700 active:scale-95 transform"
          onClick={() => clearEntry(produce)}
        >X</button>
      </div>
    </div>
  )
}
