import type { CollectionConfig } from 'payload'

export const Variants: CollectionConfig = {
  slug: 'variants',
  labels:{
    singular:'Quản lý loại sản phẩm',
    plural:'Quản lý loại sản phẩm'
  },
  admin: {
    useAsTitle: 'sku',
    defaultColumns: ['sku', 'product', 'price', 'stock', 'isActive'],
    description: 'Danh sách các phiên bản của sản phẩm',
    group:'Quản lý cửa hàng',
  },
  access: {
    read: () => true,
  },

  fields: [
    /* ================= RELATION ================= */

    {
      name: 'product',
      label: 'Sản phẩm',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },

    /* ================= OPTIONS ================= */

    {
      name: 'options',
      label: 'Tuỳ chọn (Option Values)',
      type: 'json',
      required: true,
      admin: {
        description: 'Ví dụ: { "color": "Red", "size": "M" }',
      },
    },

    /* ================= SKU ================= */

    {
      name: 'sku',
      label: 'SKU',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Mã SKU cho phiên bản',
      },
    },

    /* ================= PRICING ================= */

    {
      name: 'price',
      label: 'Giá bán',
      type: 'number',
      required: true,
      min: 0,
    },
    
    {
      name: 'compareAtPrice',
      label: 'Giá gốc (nếu có)',
      type: 'number',
      min: 0,
    },

    /* ================= INVENTORY ================= */

    {
      name: 'stock',
      label: 'Tồn kho',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },

    {
      name: 'isActive',
      label: 'Đang bán',
      type: 'checkbox',
      defaultValue: true,
    },

    /* ================= MEDIA (OPTIONAL) ================= */

    {
      name: 'image',
      label: 'Ảnh riêng cho variant',
      type: 'upload',
      relationTo: 'media',
    },

    /* ================= META ================= */

    {
      name: 'sortOrder',
      label: 'Thứ tự hiển thị',
      type: 'number',
      defaultValue: 0,
    },
  ],

  indexes: [
    {
      fields: ['product'],
    },
    {
      fields: ['sku'],
      unique: true,
    },
  ],
}
