'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidateTag, unstable_cache } from 'next/cache'

type AddToCartInput = {
  variantId: string
  quantity: number
}

export async function getMeCart() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })
  const cart = await payload.find({
    collection: 'carts',
    where: {
      customer: { equals: user?.id },
    },
    limit: 1,
    depth: 2,
  })
  return cart.docs[0] || null
}

export async function handleAddToCart({ variantId, quantity }: AddToCartInput) {
  if (!variantId || quantity < 1) {
    return { error: 'Invalid variantId or quantity' }
  }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return { error: 'Unauthorized' }
  }

  /* ================= LOAD VARIANT ================= */
  const variant = await payload.findByID({
    collection: 'variants',
    id: variantId,
    depth: 0,
  })

  if (!variant || !variant.isActive) {
    return { error: 'Variant not available' }
  }

  if (variant.stock < quantity) {
    return { error: 'Not enough stock' }
  }

  /* ================= LOAD PRODUCT ================= */
  const productId = typeof variant.product === 'object' ? variant.product.id : variant.product

  /* ================= FIND CART ================= */
  const existingCart = await payload.find({
    collection: 'carts',
    where: {
      customer: { equals: user.id },
    },
    limit: 1,
  })

  const cart = existingCart.docs[0]

  /* ================= CART ITEM ================= */
  const newItem = {
    product: productId,
    variant: variant.id,
    quantity,
    price: variant.price,
  }

  /* ================= UPDATE / CREATE ================= */
  if (cart) {
    const items = [...(cart.items || [])]

    const index = items.findIndex((item: any) => {
      const v = typeof item.variant === 'object' ? item.variant.id : item.variant
      return v === variant.id
    })

    if (index > -1) {
      const nextQty = items[index].quantity + quantity
      if (nextQty > variant.stock) {
        return { error: 'Not enough stock' }
      }
      items[index].quantity = nextQty
    } else {
      items.push(newItem)
    }

    await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items },
    })
  } else {
    await payload.create({
      collection: 'carts',
      data: {
        customer: user.id,
        items: [newItem],
      },
    })
  }

  revalidateTag('cart')

  return { success: true }
}

export const getMyCart = unstable_cache(
  async () => {
    const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })

    if (!user) return null

    const res = await payload.find({
      collection: 'carts',
      where: {
        customer: { equals: user.id },
      },
      depth: 2, // populate product + variant
      limit: 1,
    })

    return res.docs[0] || null
  },
  ['my-cart'],
  {
    tags: ['cart'],
  },
)

export async function removeCartItem(variantId: string) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) return { error: 'Unauthorized' }

  const cartRes = await payload.find({
    collection: 'carts',
    where: { customer: { equals: user.id } },
    limit: 1,
  })

  const cart = cartRes.docs[0]
  if (!cart) return { success: true }

  const items = (cart.items || []).filter((item: any) => {
    const v = typeof item.variant === 'object' ? item.variant.id : item.variant
    return v !== variantId
  })

  await payload.update({
    collection: 'carts',
    id: cart.id,
    data: { items },
  })

  revalidateTag('cart')

  return { success: true }
}

export async function updateCartItemQuantity(variantId: string, quantity: number) {
  if (quantity < 1) return { error: 'Invalid quantity' }

  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) return { error: 'Unauthorized' }

  const cartRes = await payload.find({
    collection: 'carts',
    where: { customer: { equals: user.id } },
    limit: 1,
  })

  const cart = cartRes.docs[0]
  if (!cart) return { error: 'Cart not found' }

  const items = [...(cart.items || [])]

  const index = items.findIndex((item: any) => {
    const v = typeof item.variant === 'object' ? item.variant.id : item.variant
    return v === variantId
  })

  if (index === -1) return { error: 'Item not found' }

  items[index].quantity = quantity

  await payload.update({
    collection: 'carts',
    id: cart.id,
    data: { items },
  })

  revalidateTag('cart')

  return { success: true }
}

export async function clearCart() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) return { error: 'Unauthorized' }

  const cartRes = await payload.find({
    collection: 'carts',
    where: { customer: { equals: user.id } },
    limit: 1,
  })

  const cart = cartRes.docs[0]
  if (!cart) return { success: true }

  await payload.update({
    collection: 'carts',
    id: cart.id,
    data: { items: [] },
  })

  revalidateTag('cart')

  return { success: true }
}
