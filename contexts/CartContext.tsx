"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ContextProps {
  basket: Item[] | [];
  addOne: (produce: Item) => void;
  subOne: (produce: Item) => void;
  clearEntry: (produce: Item) => void;
  setQuantity: (produce: Item, newQuantity: number) => void;
  toggleCheck: (produce: Item) => void;
}

const CartContext = createContext<ContextProps>({
  basket: [],
  addOne: (): Item[] => [],
  subOne: (): Item[] => [],
  clearEntry: (): Item[] => [],
  setQuantity: (): Item[] => [],
  toggleCheck: (): Item[] => []
})

export function CartContextProvider({ children }: { children: React.ReactNode }) {
  const { clientLocalStorage, setLocalStorage } = useLocalStorage()
  const [basket, setBasket] = useState<Item[]>([])

  // grab initial value from window.localStorage
  useEffect(() => {
    setBasket(clientLocalStorage)
  }, [clientLocalStorage])

  // update localStorage if basket changes
  useEffect(() => {
    setLocalStorage(basket)
  }, [basket])

  function addOne(produce: Item) {
    setBasket(basket => {
      const newBasket = [...basket]
      const produceIdx = basket.findIndex(item => item.slug == produce.slug)

      // CASE 1: not in basket
      if (produceIdx == -1) {
        return [...basket, produce]
      }

      // CASE 2: already in basket
      let currProduce = newBasket[produceIdx]
      currProduce.quantity += 1
      return newBasket
    })
  }

  function subOne(produce: Item) {
    setBasket(basket => {
      const newBasket = [...basket]
      const produceIdx = basket.findIndex(item => item.slug == produce.slug)

      // CASE 1: not in basket
      if (produceIdx == -1) {
        return newBasket
      }

      // CASE 2: already in basket but 1 left
      let currProduce = basket[produceIdx]
      if (currProduce.quantity == 1) {
        newBasket.splice(produceIdx, 1)
        return newBasket
      }

      // CASE 3: already in basket but more than 1
      currProduce.quantity -= 1
      newBasket[produceIdx] = currProduce
      return newBasket
    })
  }

  function setQuantity(produce: Item, newQuantity: number) {
    setBasket(basket => {
      const newBasket = [...basket]
      const produceIdx = basket.findIndex(item => item.slug == produce.slug)

      let currProduce = basket[produceIdx]
      currProduce.quantity = newQuantity
      return newBasket
    })
  }

  function clearEntry(produce: Item) {
    setBasket(basket => {
      const newBasket = [...basket]
      const produceIdx = basket.findIndex(item => item.slug == produce.slug)

      // CASE 1: not in basket
      if (produceIdx == -1) {
        return newBasket
      }

      newBasket.splice(produceIdx, 1)
      return newBasket
    })
  }

  function toggleCheck(produce: Item) {
    setBasket(basket => {
      const newBasket = [...basket]
      const produceIdx = basket.findIndex(item => item.slug == produce.slug)

      const currProduce = newBasket[produceIdx]
      currProduce.checked = !currProduce.checked
      return newBasket
    })
  }

  return (
    <CartContext.Provider value={{ basket, addOne, subOne, setQuantity, clearEntry, toggleCheck }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  return useContext(CartContext)
}

