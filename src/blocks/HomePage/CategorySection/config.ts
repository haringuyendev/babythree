// payload/blocks/CategoryGridBlock.ts
import type { Block } from 'payload'

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  labels: {
    singular: 'Lưới danh mục',
    plural: 'Lưới danh mục',
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề khối',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Mô tả phụ',
      type: 'text',
    },
    {
      name: 'categories',
      label: 'Danh mục hiển thị',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
    },
    {
      name: 'viewAll',
      label: 'Nút xem tất cả',
      type: 'group',
      fields: [
        { name: 'label', label: 'Chữ trên nút', type: 'text' },
        { name: 'url', label: 'Đường dẫn', type: 'text' },
      ],
    },
  ],
}
