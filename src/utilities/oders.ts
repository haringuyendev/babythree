import type { Order } from '@/payload-types'

export type OrderDetailView = {
  id: string
  createdAt: string
  status: Order['status']
  paymentMethod: Order['paymentMethod']
  paymentStatus: Order['paymentStatus']

  items: {
    id: string
    name: string
    image?: string
    price: number
    quantity: number
    variant?: string
  }[]

  shipping: {
    name: string
    phone: string
    address: string
    method: string
    fee: number
  }

  timeline: {
    status: string
    title: string
    description?: string
    time: string
    completed: boolean
  }[]

  subtotal: number
  discount: number
  total: number
}

export function mapOrderToDetailView(order: any): any {
  return {
    id: order.orderCode || order.id,
    createdAt: order.createdAt,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,

    items: order.items.map((item:any) => ({
      id: item.productId,
      name: item.productName,
      image:
        typeof item.image === 'object'
          ? item.image?.url
          : undefined,
      price: item.price,
      quantity: item.quantity,
      variant: item.variantName || item.variantSku,
    })),

    shipping: {
      name: order.shippingSnapshot.address.fullName,
      phone: order.shippingSnapshot.address.phone,
      address: [
        order.shippingSnapshot.address.addressLine,
        order.shippingSnapshot.address.district,
        order.shippingSnapshot.address.city,
      ].join(', '),
      method: order.shippingSnapshot.zoneName,
      fee: order.shippingSnapshot.shippingFee,
    },

    timeline: order.orderTimeline.map((t:any) => ({
      status: t.status,
      title: mapTimelineTitle(t.status),
      description: t.note,
      time: t.createdAt,
      completed: true,
    })),

    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
  }
}

function mapTimelineTitle(status: string) {
  switch (status) {
    case 'pending':
      return 'Đơn hàng đã đặt'
    case 'confirmed':
      return 'Đã xác nhận'
    case 'shipping':
      return 'Đang giao hàng'
    case 'delivered':
      return 'Đã giao hàng'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return status
  }
}
