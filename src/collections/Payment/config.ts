// collections/PaymentSettings.ts
import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels:{
    singular:'Quản lý thanh toán',
    plural:'Quản lý thanh toán'
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'bankName',
    group:'Quản lý cửa hàng',
  },

  fields: [
    {
      name: 'bankName',
      label: 'Tên ngân hàng',
      type: 'text',
      required: true,
    },
    {
      name: 'accountName',
      label: 'Tên chủ tài khoản',
      type: 'text',
      required: true,
    },
    {
      name: 'accountNumber',
      label: 'Số tài khoản',
      type: 'text',
      required: true,
    },
    {
      name: 'qrCode',
      label: 'QR chuyển khoản',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'isActive',
      label: 'Đang sử dụng',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
