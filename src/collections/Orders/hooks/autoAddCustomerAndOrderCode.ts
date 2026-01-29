import { CollectionBeforeChangeHook } from "payload"
import { v4 as uuid } from 'uuid'

export const autoAddCustomerAndOderCode: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  /* ================= AUTO CUSTOMER ================= */
  if (req.user) {
    data.customer = req.user.id
    data.customerEmail ??= req.user.email
    data.customerName ??= req.user.name
    data.customerPhone ??= req.user.phone
  }

  if (operation !== 'create') return data

  /* ================= ORDER CODE ================= */
  data.orderCode ??= `ORDER-${uuid()}`

  /* ================= INIT TIMELINE ================= */
  data.orderTimeline = [
    {
      status: 'pending',
      note: 'Đơn hàng được tạo',
      createdAt: new Date().toISOString(),
    },
  ]

  /* ================= PAYMENT SNAPSHOT ================= */
  if (data.paymentMethod === 'bank') {
    const paymentRes = await req.payload.find({
      collection: 'payments',
      where: { isActive: { equals: true } },
      limit: 1,
    })

    const payment = paymentRes.docs[0]
    if (!payment) {
      throw new Error('No active payment method configured')
    }

    data.paymentSnapshot = {
      bankName: payment.bankName,
      accountName: payment.accountName,
      accountNumber: payment.accountNumber,
      qrCode: (payment.qrCode as any).id,
      transferNote: `THANHTOAN-${data.orderCode}`,
    }
  }

  return data
}
