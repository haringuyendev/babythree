'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* ================= TYPES ================= */

type CheckoutItemInput = {
  productId: string
  productName: string
  variantName?: string
  variantSku?: string
  price: number
  quantity: number
  image?: string | null
}

type CheckoutInput = {
  customerName: string
  customerEmail: string
  customerPhone: string

  items: CheckoutItemInput[]

  shipping: {
    fullName: string
    phone: string
    addressLine: string
    district: string
    city: string
    zoneName: string
    shippingFee: number
  }

  paymentMethod: 'cod' | 'bank'
}

/* ================= ACTION ================= */

export async function checkoutAction(input: CheckoutInput) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })

  const { user } = await payload.auth({ headers })

  /* ================= VALIDATE ================= */

  if (!input.items?.length) {
    throw new Error('Cart is empty')
  }

  /* ================= CALCULATE ================= */

  const subtotal = input.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  )

  const total = subtotal + input.shipping.shippingFee

  /* ================= CREATE ORDER ================= */

  const order = await payload.create({
    collection: 'orders',
    draft: false,
    data: {
      /* ---------- CUSTOMER ---------- */
      customer: user?.id ?? null,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,

      /* ---------- ITEMS SNAPSHOT ---------- */
      items: input.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName || '',
        variantSku: item.variantSku || '',
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? null,
      })),

      /* ---------- SHIPPING SNAPSHOT ---------- */
      shippingSnapshot: {
        zoneName: input.shipping.zoneName,
        shippingFee: input.shipping.shippingFee,
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

  return {
    success: true,
    orderId: order.id,
  }
}

/* ================= SHIPPING ZONES ================= */

export async function getShippingZones() {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'shipping-zones',
    where: {
      isActive: { equals: true },
    },
    pagination: false,
  })

  return res.docs || []
}
