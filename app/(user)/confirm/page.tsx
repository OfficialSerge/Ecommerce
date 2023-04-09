"use client"

import Link from "next/link"
import { useFetchLineItems } from "@/hooks/useFetchLineItems"
import OrderConfirmation from "@/components/confirm/OrderConfirmation"
import OrderConfirmationFallBack from "@/components/confirm/OrderConfirmationFallBack"

export default function Page() {
  const { loading } = useFetchLineItems()

  if (loading == true) {
    return <OrderConfirmationFallBack />
  }

  return (
    <>
      <OrderConfirmation />
      <div className="w-full mt-6 flex">
        <Link className='group/link hidden md:block w-fit p-3 rounded hover:bg-gas-pedal/60 transition' href="/checkout">
          <svg className='fill-gas-pedal group-hover/link:fill-navy transition' xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
            <path d="M480 898.63 157.37 576 480 253.37l47.978 47.739-240.586 240.826H802.63v68.13H287.392l240.586 240.587L480 898.63Z" />
          </svg>
        </Link>
        <Link
          href="/"
          className="p-6 ml-auto rounded text:base 2xl:text-2xl hover:bg-gas-pedal/60 hover:text-navy active:scale-95 transform"
        >Continue Shopping</Link>
      </div>
    </>
  )
}
