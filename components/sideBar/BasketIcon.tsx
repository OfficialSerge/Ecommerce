"use client"

import Image from "next/image"
import getURL from "@/lib/getURLs"

import { useCartContext } from "@/contexts/CartContext"
import { useMousePosition } from "@/hooks/useMouse"
import { motion } from "framer-motion"

import { useState, useRef, useEffect } from "react"

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const formatter = Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD"
})

export default function BasketIcon({ produce, idx }: { produce: Item, idx: number }) {
  const [showDropDown, setDropDown] = useState(false)
  const dropDownRef = useRef<HTMLLabelElement>(null)

  const { setQuantity, clearEntry } = useCartContext()
  const positionRef = useMousePosition()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!dropDownRef.current?.contains(event.target as Node)) {
        setDropDown(false);
      }
    }
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const {
    slug,
    price,
    image,
    quantity
  } = produce

  const basketVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.2 + (idx * 0.1),
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        duration: 0.2,
        y: { stiffness: 1000 }
      }
    }
  }

  return (
    <motion.li
      variants={basketVariants}
      className="hidden md:basketIcon">
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
      <p className="text-smoke">{formatter.format(price)}</p>
      <div className="relative w-28 h-8 mx-auto my-2">
        <label
          ref={dropDownRef}
          className="absolute top-0 left-0 w-16 h-full bg-smoke cursor-pointer rounded"
          htmlFor={"quantity-" + slug}
          onClick={() => setDropDown(true)}
        >
          {quantity}
        </label>
        <div
          className={
            positionRef.current.y > 0.60
              ? "absolute bottom-0 w-16 z-10 rounded overflow-hidden"
              : "absolute top-0 w-16 z-10 rounded overflow-hidden"
          }>
          {showDropDown && NUMS.map((idx: number) => {
            return (
              <div key={"DD_" + idx} className="group/option relative h-8"
                onClick={() => {
                  setQuantity(produce, idx)
                  setDropDown(false)
                }}
              >
                <div className="absolute w-1 z-10 h-full bg-gas-pedal invisible group-hover/option:visible"></div>
                <div className="absolute h-full w-full bg-smoke/70 cursor-pointer backdrop-blur group-hover/option:bg-smoke/90 transition duration-75">{idx}</div>
              </div>
            )
          })}
        </div>
        <button
          className="absolute right-0 w-8 h-8 rounded bg-gas-pedal text-navy hover:bg-gas-pedal/70 active:scale-95 transform"
          onClick={() => clearEntry(produce)}
        >X</button>
      </div>
    </motion.li>
  )
}
