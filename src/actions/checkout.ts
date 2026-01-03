'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type CheckoutInput = {
  customerName:string
  customerEmail:string
  customerPhone:string
  
  shipping: {
    fullName: string
    phone: string
    addressLine: string
    district: string
    city: string
    zoneName: string // ví dụ: "Hồ Chí Minh", "Ngoại tỉnh"
  }
  paymentMethod: 'cod' | 'bank'
}

export async function checkoutAction(input: CheckoutInput) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new Error('Unauthorized')
  }

  /* ================= GET CART ================= */
  const cartRes = await payload.find({
    collection: 'carts',
    where: { customer: { equals: user.id } },
    limit: 1,
    depth: 2,
  })

  const cart = cartRes.docs[0]

  if (!cart || !cart.items?.length) {
    throw new Error('Cart is empty')
  }

  /* ================= SNAPSHOT ITEMS ================= */
  const items = cart.items.map((item: any) => {
    const product = item.product
    const variant = item.variant

    return {
      productId: product.id,
      productName: product.title,
      variantName: variant?.sku || '',
      variantSku: variant?.sku || '',
      price: item.price,
      quantity: item.quantity,
      image: product.gallery?.[0]?.image || null,
    }
  })

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  )

  /* ================= SHIPPING FEE ================= */
  // 👉 sau này có thể replace bằng lookup ShippingZone collection
  const shippingFee =
    input.shipping.zoneName === 'Hồ Chí Minh' ? 50_000 : 100_000

  const total = subtotal + shippingFee

  /* ================= CREATE ORDER ================= */
  const order = await payload.create({
    collection: 'orders',
    draft: false,
    data: {
      /* ---------- CUSTOMER ---------- */
      customer: user.id,
      customerName: user.name || input.customerName || '',
      customerEmail: user.email || input.customerEmail || '',
      customerPhone: user.phone || input.customerPhone || '',
      /* ---------- ITEMS ---------- */
      items,
      /* ---------- SHIPPING SNAPSHOT ---------- */
      shippingSnapshot: {
        zoneName: input.shipping.zoneName,
        shippingFee,
        address: {
          fullName: input.shipping.fullName,
          phone: input.shipping.phone,
          addressLine: input.shipping.addressLine,
          district: input.shipping.district,
          city: input.shipping.city,
        },
      },

      /* ---------- PAYMENT ---------- */
      paymentMethod: input.paymentMethod,
      paymentStatus: 'unpaid',

      /* ---------- TOTAL ---------- */
      subtotal,
      discount: 0,
      total,

      /* ---------- STATUS ---------- */
      status: 'pending',
    },
  })

  /* ================= CLEAR CART ================= */
  await payload.update({
    collection: 'carts',
    id: cart.id,
    data: { items: [] },
  })

  return {
    success: true,
    order,
  }
}

export async function getShippingZones() {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'shipping-zones',
    where: {
      and: [
        { isActive: { equals: true } },
      ],
    },
    pagination: false,
  })

  return res.docs || []
}