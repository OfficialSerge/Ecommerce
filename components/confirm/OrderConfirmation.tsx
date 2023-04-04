import { useFetchLineItems } from "@/hooks/useFetchLineItems"
import Image from "next/image"
import getURL from "@/lib/getURLs"

export default function OrderConfirmation() {
  const { lineItems, total } = useFetchLineItems()

  const formatter = Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
  })

  return (
    <div className="flex flex-col gap-4 bg-white p-5 rounded">
      <h1 className="text-2xl">Thank you for your order!</h1>

      {lineItems.map((produce: Item, idx: number) => {
        const {
          title,
          price,
          quantity,
          image
        } = produce

        const imageURL = getURL(image).url()

        return (
          <div className="inline-flex p-3 border border-black rounded gap-4" key={idx}>
            <div className="relative w-20 h-20" key={idx}>
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
              <p>quantity: {quantity}</p>
            </div>
            <p className="ml-auto">{formatter.format(price)}</p>
          </div>
        )
      })}

      <h1 className="ml-auto text-2xl">Total: {formatter.format(total)}</h1>
    </div >
  )
}
