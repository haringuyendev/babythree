// collections/Orders.ts
import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { adminOrSelf } from '@/access/adminOrSelf'
import { addStatusToTimeline } from './hooks/autoAddTimeLine'
import { autoAddCustomerAndOderCode } from './hooks/autoAddCustomerAndOrderCode'

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
      admin:{
        position:'sidebar',
      },
      options: [
        { label: 'Đang chuẩn bị', value: 'pending' },
        { label: 'Đã xác nhận', value: 'confirmed' },
        { label: 'Đang vận chuyển', value: 'shipping' },
        { label: 'Đã giao hàng', value: 'delivered' },
        { label: 'Đã hủy', value: 'cancelled' },
      ],
    },

    /* ================= ORDER TIMELINE ================= */
    {
      name: 'orderTimeline',
      label: 'Lịch sử đơn hàng',
      type: 'array',
      admin:{
        readOnly:true
      },
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
      autoAddCustomerAndOderCode,
      addStatusToTimeline
    ],
  },
}
