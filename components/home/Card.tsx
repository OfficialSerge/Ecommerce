"use client"

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Image from "next/image";
import DynamicButton from "@/components/utils/DynamicButton";
import getURL from "@/lib/getURLs";

export default function Card({ post, idx }: { post: Post, idx: number }) {
  const router = useRouter()

  const {
    title,
    slug,
    images,
  } = post

  const image = getURL(images[0]).url()

  return (
    <motion.div
      className="card group/card overflow-hidden"
      initial={{
        opacity: 0,
        translateY: -50
      }}
      animate={{
        opacity: 1,
        translateY: 0
      }}
      transition={{
        duration: 0.3,
        delay: (Math.floor(idx / 3)) * 0.2
      }}
    >
      <h1 className="absolute z-10 p-3 text-black text-2xl w-full text-center -translate-y-12 group-hover/card:translate-y-0 transition-transform">{title}</h1>
      <Image
        className="object-cover object-center rounded-lg cursor-pointer"
        onClick={() => router.push(`/${slug.current}`)}
        src={image}
        alt="CARD HERE"
        fill
        // sizes="100vw, (min-width: 768px) 50vw, (min-width: 1024px) 33vw"
        sizes="30vw"
      />
      <div className="absolute bottom-0 h-10 w-full translate-y-12 group-hover/card:translate-y-0 transition-transform">
        <DynamicButton className="smallButton" add={true} post={post} />
        <DynamicButton className="smallButton" sub={true} post={post} />
      </div>
    </motion.div>
  )
}
