// collections/ShippingZones.ts
import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const ShippingZones: CollectionConfig = {
  slug: 'shipping-zones',
  labels:{
    singular:'Quản lý khu vực',
    plural:'Quản lý khu vực'
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'fee', 'isActive','isDefault'],
    group:'Quản lý cửa hàng',
  },

  fields: [
    {
      name: 'name',
      label: 'Tên khu vực',
      type: 'text',
      required: true,
    },

    {
      name: 'provinces',
      label: 'Áp dụng cho tỉnh/thành',
      type: 'relationship',
      relationTo: 'provinces',
      hasMany: true,
      required: true,
    },

    {
      name: 'fee',
      label: 'Phí vận chuyển (VNĐ)',
      type: 'number',
      required: true,
      min: 0,
    },

    {
      name: 'description',
      type: 'textarea',
    },
    {
      name:'isDefault',
      type:'checkbox',
      defaultValue:false  
    },
    {
      name: 'isActive',
      label: 'Đang áp dụng',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
