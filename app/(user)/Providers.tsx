"use client";

// import all our providers in one file
import { CartContextProvider } from "@/contexts/CartContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartContextProvider>
      {children}
    </CartContextProvider>
  )
}
