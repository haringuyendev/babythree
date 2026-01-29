import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getOrderById } from '@/actions/orders'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import OrderDetailClient from './page.client'
import { mapOrderToDetailView } from '@/utilities/oders'

type Args = {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: Args) {
  const order = await getOrderById((await params).id)

  if (!order) notFound()

  const viewOrder = mapOrderToDetailView(order)

  return <OrderDetailClient order={viewOrder} />
}

export async function generateMetadata(
  { params }: Args,
): Promise<Metadata> {
  return {
    title: `Đơn hàng #${((await params).id)}`,
    description: `Chi tiết đơn hàng ${(await params).id}`,
    openGraph: mergeOpenGraph({
      title: `Order ${(await params).id}`,
      url: `/orders/${(await params).id}`,
    }),
  }
}
