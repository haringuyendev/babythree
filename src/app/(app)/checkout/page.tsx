import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'

import CheckoutPage from '@/components/checkout/CheckoutPage'
import { getShippingZones } from '@/actions/checkout'
import { getProvinces } from '@/actions/provinces'
import { getMeCart } from '@/actions/cart'


export default async function Checkout() {
  const [shippingZones, provinces] = await Promise.all([
    getShippingZones(),
    getProvinces(),
  ])

  return (
    <CheckoutPage
      shippingZones={shippingZones}
      provinces={provinces}
    />
  )
}

export const metadata: Metadata = {
  description: 'Thanh toán.',
  openGraph: mergeOpenGraph({
    title: 'Thanh toán',
    url: '/checkout',
  }),
  title: 'Thanh toán',
}
