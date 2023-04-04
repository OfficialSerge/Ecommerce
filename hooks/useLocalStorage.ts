"use client"

import { useEffect, useState } from "react"

export function useLocalStorage() {
  const [clientLocalStorage, setStorage] = useState<Item[]>([])

  useEffect(() => {
    const local = window.localStorage.getItem("basket")
    const retrieve_basket: Item[] | [] = JSON.parse(local || "[]")

    setStorage(retrieve_basket)
  }, [])

  function setLocalStorage(produce: Item[]) {
    window.localStorage.setItem("basket", JSON.stringify(produce))
  }

  return { clientLocalStorage, setLocalStorage }
}
