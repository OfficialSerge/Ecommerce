"use client";

// import all our providers in one file
import { CartContextProvider } from "@/contexts/CartContext"
import { SideBarContextProvider } from "@/contexts/SideBarContext";
import { AnimatePresence } from "framer-motion";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartContextProvider>
      <SideBarContextProvider>
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </SideBarContextProvider>
    </CartContextProvider>
  )
}
