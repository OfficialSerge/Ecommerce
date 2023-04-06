"use client"

import { useState } from "react"

import { useCartContext } from "@/contexts/CartContext"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import BasketIcon from "./BasketIcon"
import Link from "next/link"

function Path(props: any) {
  return (
    <motion.path
      strokeWidth="3"
      stroke="#FDB035"
      strokeLinecap="round"
      {...props} />
  )
}

export default function SideBar() {
  const [open, setOpen] = useState(false)

  const { basket } = useCartContext()
  const path = usePathname()

  if (path == '/checkout' || path == '/confirm') {
    return null
  }

  return (
    <motion.div
      animate={open == true ? "open" : "closed"}
      className={`sideBarB md:sideBarR ${open == true ? "" : "md:sideBarH"}`}>
      <div className="fixed left-0 bottom-0 w-full h-16 inline-flex md:hidden">
        <Link className="w-1/2" href="/">
          <svg className="my-2 mx-auto" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path className="fill-gas-pedal" d="M11 39h7.5V26.5h11V39H37V19.5L24 9.75 11 19.5Zm-3 3V18L24 6l16 12v24H26.5V29.5h-5V42Zm16-17.65Z" />
          </svg>
        </Link>

        <Link className="w-1/2" href="/checkout">
          <svg className="my-2 mx-auto" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path className="fill-gas-pedal" d="M14.35 43.95q-1.5 0-2.55-1.05-1.05-1.05-1.05-2.55 0-1.5 1.05-2.55 1.05-1.05 2.55-1.05 1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.5-1.05 2.55-1.05 1.05-2.55 1.05Zm20 0q-1.5 0-2.55-1.05-1.05-1.05-1.05-2.55 0-1.5 1.05-2.55 1.05-1.05 2.55-1.05 1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.5-1.05 2.55-1.05 1.05-2.55 1.05Zm-22.6-33 5.5 11.4h14.4l6.25-11.4Zm-1.5-3H39.7q1.15 0 1.75 1.05.6 1.05 0 2.1L34.7 23.25q-.55.95-1.425 1.525t-1.925.575H16.2l-2.8 5.2h24.55v3h-24.1q-2.1 0-3.025-1.4-.925-1.4.025-3.15l3.2-5.9L6.45 7h-3.9V4H8.4Zm7 14.4h14.4Z" />
          </svg>
        </Link>
      </div>

      <div className="justify-around m-2 hidden md:flex">
        {open &&
          <Link className="w-fit rounded text-gas-pedal hover:bg-gas-pedal/30 text-lg p-3 transition" href="/checkout">Checkout</Link>
        }

        <svg width="23" height="23" viewBox="0 0 23 23"
          className="w-8 h-full cursor-pointer"
          onClick={() => setOpen(prev => !prev)}
        >
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" }
            }}
          />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            transition={{ duration: 0.1 }}
          />
          <Path
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" }
            }}
          />
        </svg>
      </div>

      {open && basket.map((produce, idx) => {
        return <BasketIcon produce={produce} key={idx} />
      })}
    </motion.div>
  )
}
