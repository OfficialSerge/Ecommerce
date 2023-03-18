"use client"

import Link from "next/link";

import { useCartContext } from "@/contexts/cart";

export default function Page() {
  const { userId } = useCartContext()

  return (
    <div className='text-center text-2xl'>
      <h1>CHECKOUT PAGE</h1>
      <br />
      <p>{userId || "set user ID"}</p>
      <br />
      <Link href="/">HOME</Link>
      <br />
      <Link href="/confirm">CONFIRM</Link>
    </div>
  )
}
