// collections/Orders.ts
import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { adminOrSelf } from '@/access/adminOrSelf'
import { v4 as uuid } from 'uuid'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels:{
    singular:'Quản lý đơn hàng',
    plural:'Quản lý đơn hàng'
  },
  access: {
    create: () => true,
    read: adminOrSelf,
    update: adminOnly,
    delete: adminOnly,
  },

  admin: {
    useAsTitle: 'orderCode',
    defaultColumns: ['orderCode', 'customerName', 'status', 'paymentStatus', 'total', 'createdAt'],
    group:'Quản lý cửa hàng',
  },

  fields: [
    /* ================= ORDER CODE ================= */
    {
      name: 'orderCode',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },

    /* ================= CUSTOMER ================= */
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
    },
    { name: 'customerName', type: 'text', required: true },
    { name: 'customerEmail', type: 'email', required: true },
    { name: 'customerPhone', type: 'text', required: true },

    /* ================= ITEMS SNAPSHOT ================= */
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'productId', type: 'text', required: true },
        { name: 'productName', type: 'text', required: true },
        { name: 'variantName', type: 'text' },
        { name: 'variantSku', type: 'text' },
        { name: 'price', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* ================= SHIPPING SNAPSHOT ================= */
    {
      name: 'shippingSnapshot',
      label: 'Thông tin giao hàng',
      type: 'group',
      required: true,
      fields: [
        { name: 'zoneName', type: 'text' },
        { name: 'shippingFee', type: 'number', required: true },

        {
          name: 'address',
          type: 'group',
          fields: [
            { name: 'fullName', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'addressLine', type: 'text', required: true },
            { name: 'district', type: 'text', required: true },
            { name: 'city', type: 'text', required: true },
          ],
        },
      ],
    },

    /* ================= PAYMENT ================= */
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'COD', value: 'cod' },
        { label: 'Chuyển khoản', value: 'bank' },
      ],
    },

    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Chưa thanh toán', value: 'unpaid' },
        { label: 'Đã thanh toán', value: 'paid' },
        { label: 'Thất bại', value: 'failed' },
      ],
    },

    {
      name: 'paymentSnapshot',
      label: 'Snapshot thanh toán',
      type: 'group',
      admin: {
        readOnly: true,
        condition: (_, data) => data.paymentMethod === 'bank',
      },
      fields: [
        { name: 'bankName', type: 'text' },
        { name: 'accountName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        {
          name: 'qrCode',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'transferNote', type: 'text' },
      ],
    },

    /* ================= TOTAL ================= */
    { name: 'subtotal', type: 'number', required: true },
    { name: 'discount', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number', required: true },

    /* ================= ORDER STATUS ================= */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Shipping', value: 'shipping' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },

    /* ================= ORDER TIMELINE ================= */
    {
      name: 'orderTimeline',
      label: 'Lịch sử đơn hàng',
      type: 'array',
      defaultValue: [],
      fields: [
        {
          name: 'status',
          type: 'text',
          required: true,
        },
        {
          name: 'note',
          type: 'text',
        },
        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: { readOnly: true },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
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
      },
    ],
  },
}
