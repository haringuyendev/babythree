
import type { CollectionAfterChangeHook } from 'payload'

export const recalculatePriceRange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const payload = req.payload

  // Lấy variants active của product
  const variantsRes = await payload.find({
    collection: 'variants',
    where: {
      and: [
        { product: { equals: doc.id } },
        { isActive: { equals: true } },
      ],
    },
    limit: 1000,
  })

  let priceMin = doc.price
  let priceMax = doc.price

  if (variantsRes.docs.length) {
    const prices = variantsRes.docs.map((v) => v.price)

    priceMin = Math.min(...prices)
    priceMax = Math.max(...prices)
  }

  // Chỉ update khi cần (tránh loop)
  if (
    doc.priceMin !== priceMin ||
    doc.priceMax !== priceMax
  ) {
    await payload.update({
      collection: 'products',
      id: doc.id,
      data: {
        priceMin,
        priceMax,
      },
    })
  }

  return doc
}
