"use client"

import { useSideBarContext } from "@/contexts/SideBarContext"
import { useCartContext } from "@/contexts/CartContext"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import BasketIcon from "./BasketIcon"
import Link from "next/link"

const sideBarVariants = {
  open: {
    width: "10rem",
    transition: {
      duration: 0.2
    }
  },
  closed: {
    width: "5rem",
    transition: {
      type: "spring",
      damping: 12,
      delay: 0.25
    }
  }
}

function Path(props: any) {
  return (
    <motion.path
      strokeWidth="2"
      stroke="#FDB035"
      strokeLinecap="round"
      {...props} />
  )
}

export default function SideBar() {
  const { open, setOpen } = useSideBarContext()
  const { basket } = useCartContext()

  const path = usePathname()

  if (path == '/checkout' || path == '/confirm') {
    return null
  }

  return (
    <motion.div
      animate={open == true ? "open" : "closed"}
      initial={false}
      variants={sideBarVariants}
      className="sideBar">

      <div className="absolute h-16 w-40 z-10 top-0 right-0 justify-between my-2 pr-1 pl-4 hidden md:flex">
        <Link href="/checkout">
          <svg className="w-16 h-full p-2 rounded hover:bg-gas-pedal/20" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path className="fill-gas-pedal" d="M14.35 43.95q-1.5 0-2.55-1.05-1.05-1.05-1.05-2.55 0-1.5 1.05-2.55 1.05-1.05 2.55-1.05 1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.5-1.05 2.55-1.05 1.05-2.55 1.05Zm20 0q-1.5 0-2.55-1.05-1.05-1.05-1.05-2.55 0-1.5 1.05-2.55 1.05-1.05 2.55-1.05 1.5 0 2.55 1.05 1.05 1.05 1.05 2.55 0 1.5-1.05 2.55-1.05 1.05-2.55 1.05Zm-22.6-33 5.5 11.4h14.4l6.25-11.4Zm-1.5-3H39.7q1.15 0 1.75 1.05.6 1.05 0 2.1L34.7 23.25q-.55.95-1.425 1.525t-1.925.575H16.2l-2.8 5.2h24.55v3h-24.1q-2.1 0-3.025-1.4-.925-1.4.025-3.15l3.2-5.9L6.45 7h-3.9V4H8.4Zm7 14.4h14.4Z" />
          </svg>
        </Link>

        <svg width="23" height="23" viewBox="0 0 23 23"
          className="w-16 my-auto h-full p-3 cursor-pointer rounded hover:bg-gas-pedal/20"
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

      <motion.ul>
        {basket.map((produce, idx) => {
          return <BasketIcon produce={produce} key={idx} idx={idx} />
        })}
      </motion.ul>
    </motion.div >
  )
}
