"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

import Image from "next/image";
import DynamicButton from "./DynamicButton";
import getURL from "../lib/getURLs";

export default function Card({ post }: { post: Post }) {
  const [idx, setIdx] = useState(0)

  const router = useRouter()

  const imgs = post.images.map((image) => getURL(image).url())

  return (
    <div className="card">
      <Image
        className="object-cover object-center rounded-lg cursor-pointer"
        onClick={() => router.push(`/${post.slug.current}`)}
        src={imgs[idx]}
        alt="CARD HERE"
        fill
        // sizes="100vw, (min-width: 768px) 50vw, (min-width: 1024px) 33vw"
        sizes="30vw"
      />
      <div className="absolute bottom-0 h-10 w-full">
        <DynamicButton className="smallButton" add={true} post={post} />
        <DynamicButton className="smallButton" sub={true} post={post} />
      </div>
    </div>
  )
}
