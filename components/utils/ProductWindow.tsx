"use client"

import { useState } from "react"

import Image from "next/image"
import getURL from "@/lib/getURLs"

export default function ProductWindow({ imgs }: { imgs: Image[] }) {
  const [idx, setIdx] = useState(0)
  const imgURLs = imgs.map((image) => getURL(image).url())

  return (
    <div className="w-full md:w-fit h-fit">
      <div className="productImg">
        <Image
          className="object-cover object-center rounded-lg"
          src={imgURLs[idx]}
          alt="CARD HERE"
          fill
          // sizes="100vw, (min-width: 768px) 50vw, (min-width: 1024px) 33vw"
          sizes="30vw"
        />
      </div>

      <div className="my-4 flex gap-10 justify-center">
        {imgURLs.map((url, index) => {
          return (
            <div className="miniImgs" key={index}>
              <Image
                className="object-cover object-center rounded-lg cursor-pointer md:hover:drop-shadow-xl transition"
                onClick={() => setIdx(index)}
                src={url}
                alt="CARD HERE"
                fill
                sizes="10vw"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
