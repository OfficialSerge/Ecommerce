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
      <br />
      <Link href="/checkout">Back to Checkout</Link>
      <br />
      <Link href="/">Continue Shopping</Link>
    </>
  )
}
