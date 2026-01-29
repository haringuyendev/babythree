// src/hooks/orderTimeline.ts
import type { CollectionBeforeChangeHook } from 'payload'

type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'

const statusNotes: Record<OrderStatus, string> = {
  pending: 'Đơn hàng đang chờ xử lý',
  confirmed: 'Đơn hàng đã được xác nhận và đang chuẩn bị hàng',
  shipping: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
  delivered: 'Đơn hàng đã được giao thành công',
  cancelled: 'Đơn hàng đã bị hủy',
}

export const addStatusToTimeline: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  operation,
}) => {
  if (operation !== 'update' || !originalDoc) {
    return data
  }

  const oldStatus = originalDoc.status as OrderStatus
  const newStatus = data.status as OrderStatus

  if (oldStatus === newStatus) {
    return data
  }

  const timeline = [...(originalDoc.orderTimeline || [])]

  const note = statusNotes[newStatus] || `Trạng thái thay đổi thành: ${newStatus}`

  timeline.push({
    status: newStatus,
    note,
    createdAt: new Date().toISOString(),
  })

  return {
    ...data,
    orderTimeline: timeline,
  }
}