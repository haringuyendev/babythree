// payload/collections/AgeRanges.ts
import type { CollectionConfig } from 'payload'

export const Policy: CollectionConfig = {
  slug: 'policy',
  labels: {
    singular: 'Điều khoản',
    plural: 'Danh sách điều khoản',
  },

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon', 'description'],
  },

  fields: [
    {
      name: 'title',
      label: 'Tên hiển thị',
      type: 'text',
      required: true,
      admin: {
        description: 'Ví dụ: Đổi trả 30 ngày',
      },
    },

    {
      name: 'icon',
      label: 'Hình ảnh',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'description',
      label: 'Ghi chú',
      type: 'textarea',
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data.slug && data.title) {
          const slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

          return {
            ...data,
            slug,
          }
        }

        return data
      },
    ],
  },
}
