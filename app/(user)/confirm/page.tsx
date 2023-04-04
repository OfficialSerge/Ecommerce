"use client"

import Link from "next/link"
import OrderConfirmation from "@/components/confirm/OrderConfirmation"

import { Suspense } from "react"

export default function Page() {
  return (
    <>
      <Suspense fallback={<p className="w-full h-full bg-red-200">LOADING LOADING LOADING</p>}>
        <OrderConfirmation />
      </Suspense>
      <br />
      <Link href="/checkout">Back to Checkout</Link>
      <br />
      <Link href="/">Continue Shopping</Link>
    </>
  )
}
