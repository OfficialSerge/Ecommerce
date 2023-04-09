"use client"

import SideBar from "./SideBar"
import BottomBar from "./BottomBar"

import { useDisplay } from "@/hooks/useDisplay"

export default function Navigation() {
  const display = useDisplay()

  if (display == null) {
    return null
  } else if (display == "mobile") {
    return <BottomBar />
  }

  return <SideBar />
}
