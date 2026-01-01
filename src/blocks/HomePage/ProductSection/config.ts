// payload/blocks/ProductGridBlock.ts
import type { Block } from 'payload'

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: {
    singular: 'Lưới sản phẩm',
    plural: 'Lưới sản phẩm',
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

    /* ================= MODE ================= */
    {
      name: 'mode',
      label: 'Cách chọn sản phẩm',
      type: 'radio',
      defaultValue: 'manual',
      options: [
        { label: 'Chọn thủ công', value: 'manual' },
        { label: 'Tự động', value: 'auto' },
      ],
      admin: {
        layout: 'horizontal',
      },
    },

    /* ================= MANUAL ================= */
    {
      name: 'products',
      label: 'Danh sách sản phẩm hiển thị',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'manual',
        description: 'Kéo thả để sắp xếp thứ tự hiển thị',
      },
    },

    /* ================= AUTO ================= */
    {
      name: 'autoConfig',
      label: 'Cấu hình tự động',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.mode === 'auto',
      },
      fields: [
        {
          name: 'filter',
          label: 'Kiểu lọc',
          type: 'select',
          required: true,
          options: [
            { label: 'Bán chạy', value: 'best' },
            { label: 'Mới nhất', value: 'new' },
            { label: 'Đang giảm giá', value: 'sale' },
          ],
        },
        {
          name: 'limit',
          label: 'Số sản phẩm hiển thị',
          type: 'number',
          defaultValue: 4,
        },
      ],
    },

    /* ================= CTA ================= */
    {
      name: 'viewAll',
      label: 'Nút xem tất cả',
      type: 'group',
      fields: [
        {
          name: 'label',
          label: 'Chữ trên nút',
          type: 'text',
          defaultValue: 'Xem tất cả',
        },
        {
          name: 'url',
          label: 'Đường dẫn',
          type: 'text',
        },
      ],
    },
  ],
}
