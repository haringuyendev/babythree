// blocks/FeaturesBlock.ts
import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Khối tính năng',
    plural: 'Khối tính năng',
  },
  fields: [
    {
      name: 'items',
      label: 'Danh sách tính năng',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'icon',
          label: 'Icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'text',
        },
      ],
    },
  ],
}
