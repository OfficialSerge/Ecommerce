"use client"

export default function OrderConfirmationFallBack() {
  const formatter = Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD"
  })

  return (
    <div className="flex flex-col gap-4 bg-white p-5 rounded text-gray-400">
      <h1 className="text-2xl">Getting Order Confirmation</h1>

      {Array.from({ length: 3 }).map((_, idx: number) => {
        return (
          <div className="inline-flex p-3 border-2 border-gray-300 rounded gap-4 animate-pulse" key={"OCF_" + idx}>
            <div className="relative w-20 h-20 rounded border-2 border-gray-300"></div>
            <div className="w-32">
              <p>produce</p>
              <p>quantity</p>
            </div>
          </div>
        )
      })}

      <h1 className="ml-auto text-2xl">Total: {formatter.format(0)}</h1>
    </div >
  )
}
