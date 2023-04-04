"use client"

import { useEffect, useState } from "react";
import { useCartContext } from "@/contexts/CartContext";
import Image from "next/image";
import getURL from "@/lib/getURLs";

import getStripe from "@/lib/getStripe";
import { fetchPostJSON } from "@/lib/api-helpers";

export default function CheckoutForm() {
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { basket, clearEntry, addOne, subOne, toggleCheck } = useCartContext()

  useEffect(() => {
    let tally_total = 0

    basket.map((produce: Item) => {
      const {
        checked,
        price,
        quantity
      } = produce

      if (checked == true) {
        tally_total += price * quantity
      }

      setTotal(tally_total)
    })
  }, [basket])

  const formatter = Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
  })

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setIsLoading(true);

      const checkoutData = basket
        .filter(produce => produce.checked == true)
        .map((produce) => {
          const {
            title,
            slug,
            price,
            quantity,
          } = produce

          return { title, slug, price, quantity }
        })

      const response = await fetchPostJSON("/api/create-payment-intent", {
        checkoutData
      })

      if (response.statusCode === 500) {
        console.error(response.message)
        return
      }

      const stripe = await getStripe()
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: response.checkoutSession.id,
      })

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // edirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An unexpected error occurred.");
      }

    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw err

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 bg-white p-5 rounded">
        <h1 className="text-2xl">Shopping Cart</h1>
        <h1 className="text-end w-full border border-white border-b-black">Price</h1>
        {
          basket.map((produce: Item, idx: number) => {
            const {
              title,
              price,
              quantity,
              image,
              checked
            } = produce
            const imageURL = getURL(image).url()

            return (
              <div className="inline-flex p-3 border border-black rounded gap-4" key={idx}>
                <input
                  className="cursor-pointer h-fit my-auto" type="checkbox" checked={checked}
                  onClick={() => toggleCheck(produce)}
                ></input>
                <div className="relative h-20 w-20">
                  <Image
                    className="object-cover object-center rounded-lg cursor-pointer"
                    src={imageURL}
                    alt="CARD HERE"
                    fill
                    // sizes="100vw, (min-width: 768px) 50vw, (min-width: 1024px) 33vw"
                    sizes="30vw"
                  />
                </div>
                <div className="w-32">
                  <p>{title}</p>
                  <button className="text-blue-500" onClick={() => clearEntry(produce)}>Delete</button>
                </div>
                <div className="flex flex-col w-8 justify-between bg-white rounded border border-blue-200">
                  <button className="h-6 bg-blue-200" onClick={() => addOne(produce)}>+</button>
                  <p className="text-center">{quantity}</p>
                  <button className="h-6 bg-blue-200" onClick={() => subOne(produce)}>-</button>
                </div>
                <p className="ml-auto">{formatter.format(price)}</p>
              </div>
            )
          })
        }
        <h1 className="ml-auto text-2xl">Total: {formatter.format(total)}</h1>
      </div>
      <div className="w-full mt-6 flex">
        <button
          className="p-3 ml-auto rounded text-green-900 bg-green-300 hover:bg-green-200 active:scale-95 transform"
          onClick={(e) => handleSubmit(e)}
        >Procceed To Checkout</button>
      </div>
    </>
  );
}
