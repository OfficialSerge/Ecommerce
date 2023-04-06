"use client";

// import all our providers in one file
import { CartContextProvider } from "@/contexts/CartContext"
import { AnimatePresence } from "framer-motion";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartContextProvider>
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </CartContextProvider>
  )
}
