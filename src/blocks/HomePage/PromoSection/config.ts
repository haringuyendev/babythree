import type { Block } from 'payload'

export const PromoBannerBlock: Block = {
  slug: 'promoBanner',
  labels: {
    singular: 'Banner khuyến mãi',
    plural: 'Banner khuyến mãi',
  },
  fields: [
    /* ================= ICON ================= */
    {
      name: 'iconType',
      label: 'Loại icon',
      type: 'radio',
      defaultValue: 'emoji',
      options: [
        { label: 'Emoji', value: 'emoji' },
        { label: 'Hình ảnh', value: 'image' },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'emoji',
      label: 'Emoji trang trí',
      type: 'text',
      defaultValue: '🎁',
      admin: {
        condition: (_, siblingData) => siblingData?.iconType === 'emoji',
      },
    },
    {
      name: 'iconImage',
      label: 'Icon (ảnh)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.iconType === 'image',
      },
    },

    /* ================= CONTENT ================= */
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
    },

    /* ================= CTA ================= */
    {
      name: 'cta',
      label: 'Nút hành động',
      type: 'group',
      fields: [
        {
          name: 'label',
          label: 'Chữ trên nút',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'Đường dẫn',
          type: 'text',
          required: true,
        },
      ],
    },

    /* ================= BACKGROUND ================= */
    {
      name: 'backgroundType',
      label: 'Kiểu nền',
      type: 'radio',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradient', value: 'gradient' },
        { label: 'Ảnh nền', value: 'image' },
      ],
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'gradient',
      label: 'Màu gradient',
      type:'array',
      fields: [
        {
          name: 'color',
          label: 'Màu',
          type: 'text',
        }
      ],
      admin: {
        condition: (_, siblingData) =>
          siblingData?.backgroundType === 'gradient',
      },
    },
    {
      name: 'backgroundImage',
      label: 'Ảnh nền',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.backgroundType === 'image',
      },
    },
  ],
}
