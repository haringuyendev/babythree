// payload/collections/AgeRanges.ts
import type { CollectionConfig } from 'payload'

export const AgeRanges: CollectionConfig = {
  slug: 'age-ranges',
  labels: {
    singular: 'Độ tuổi',
    plural: 'Danh sách độ tuổi',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'minAge', 'maxAge'],
    group:'Cấu hình hệ thống',
  },

  fields: [
    {
      name: 'title',
      label: 'Tên hiển thị',
      type: 'text',
      required: true,
      admin: {
        description: 'Ví dụ: 0–6 tháng, 1–3 tuổi',
      },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'minAge',
          label: 'Tuổi tối thiểu',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
            description: 'Đơn vị: tháng',
          },
        },
        {
          name: 'maxAge',
          label: 'Tuổi tối đa',
          type: 'number',
          required: true,
          admin: {
            width: '50%',
            description: 'Đơn vị: tháng',
          },
        },
      ],
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
