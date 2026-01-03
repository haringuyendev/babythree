// collections/Shippings.ts
import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { adminOrSelf } from '@/access/adminOrSelf'

export const SHIPPING_STATUS = [
  'pending',     // chưa gửi
  'preparing',   // đang chuẩn bị
  'shipping',    // đang giao
  'delivered',   // đã giao
  'failed',      // giao thất bại
] as const

export const Shippings: CollectionConfig = {
  slug: 'shippings',
  labels:{
    singular:'Quản lý vận chuyển',
    plural:'Quản lý vận chuyển'
  },
  access: {
    create: adminOnly,
    read: adminOrSelf,
    update: adminOnly,
    delete: adminOnly,
  },

  admin: {
    useAsTitle: 'trackingCode',
    defaultColumns: ['trackingCode', 'carrier', 'status', 'updatedAt'],
    group:'Quản lý cửa hàng',
    hidden: true,
  },

  fields: [
    /* ================= ORDER ================= */

    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      required: true,
      unique: true,
    },

    /* ================= SHIPPING INFO ================= */

    {
      name: 'carrier',
      type: 'text',
      label: 'Đơn vị vận chuyển',
      required: true,
      defaultValue: 'Nội bộ',
    },

    {
      name: 'trackingCode',
      type: 'text',
      label: 'Mã vận đơn',
      unique: true,
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: SHIPPING_STATUS.map((s) => ({
        label: s.toUpperCase(),
        value: s,
      })),
    },

    /* ================= TIMELINE ================= */

    {
      name: 'timeline',
      label: 'Lịch sử vận chuyển',
      type: 'array',
      required: true,
      defaultValue: [],
      fields: [
        {
          name: 'status',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          defaultValue: () => new Date().toISOString(),
          admin: { readOnly: true },
        },
      ],
    },

    /* ================= ADDRESS SNAPSHOT ================= */

    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'fullName', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'addressLine', type: 'text' },
        { name: 'district', type: 'text' },
        { name: 'city', type: 'text' },
      ],
    },
  ],
}
