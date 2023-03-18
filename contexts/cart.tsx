"use client"

import { createContext, useContext, Dispatch, SetStateAction, useState } from 'react';

interface ContextProps {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  basket: Item[];
  addOne: (post: Post) => void;
  subOne: (post: Post) => void;
  clearEntry: (produce: Item) => void;
  setQuantity: (produce: Item, quanity: number) => void;
}

const CartContext = createContext<ContextProps>({
  userId: '',
  setUserId: (): string => '',
  basket: [],
  addOne: (): Item[] => [],
  subOne: (): Item[] => [],
  clearEntry: (): Item[] => [],
  setQuantity: (): Item[] => []
})

export function CartContextProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState('')
  const [basket, setBasket] = useState<[] | Item[]>([])

  function addOne(post: Post) {
    const {
      title,
      slug,
      price,
      images
    } = post

    const produceIdx = basket.findIndex(item => item.slug == slug.current)

    if (produceIdx == -1) {
      setBasket([...basket, { title: title, slug: slug.current, price: price, quantity: 1, image: images[0] }])
      return
    }

    let produce = basket[produceIdx]
    produce.quantity += 1
    basket[produceIdx] = produce

    setBasket([...basket])
  }

  function subOne(post: Post) {
    const {
      slug,
    } = post

    const produceIdx = basket.findIndex(item => item.slug == slug.current)

    if (produceIdx == -1) {
      return
    }

    let produce = basket[produceIdx]

    if (produce.quantity == 1) {
      basket.splice(produceIdx, 1)
      setBasket([...basket])
      return
    }

    produce.quantity -= 1
    basket[produceIdx] = produce

    setBasket([...basket])
  }

  function setQuantity(produce: Item, quantity: number) {
    const {
      slug
    } = produce

    const produceIdx = basket.findIndex(item => item.slug == slug)

    if (produceIdx == -1) {
      return
    }

    let current = basket[produceIdx]
    current.quantity = quantity
    setBasket([...basket])
  }

  function clearEntry(produce: Item) {
    const {
      slug
    } = produce

    const produceIdx = basket.findIndex(item => item.slug == slug)

    if (produceIdx == -1) {
      return
    }

    basket.splice(produceIdx, 1)
    setBasket([...basket])
  }

  return (
    <CartContext.Provider value={{ userId, setUserId, basket, addOne, subOne, setQuantity, clearEntry }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  return useContext(CartContext)
}

