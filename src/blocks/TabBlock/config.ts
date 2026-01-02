// payload/blocks/TabBlock.ts
import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const TabBlock: Block = {
  slug: 'tabBlock',
  labels: {
    singular: 'Tab nội dung',
    plural: 'Các tab nội dung',
  },

  fields: [
    {
      name: 'title',
      label: 'Tiêu đề tab',
      type: 'text',
      required: true,
    },

    {
      name: 'type',
      label: 'Loại nội dung',
      type: 'select',
      required: true,
      defaultValue: 'content',
      options: [
        { label: 'Nội dung chi tiết', value: 'content' },
        { label: 'Bảng số đo', value: 'sizeChart' },
        { label: 'Chính sách', value: 'policy' },
      ],
    },

    // ===== Nội dung chi tiết =====
    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'content',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },

    // ===== Bảng số đo =====
    {
      name: 'sizeChart',
      label: 'Bảng số đo',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'sizeChart',
      },
      fields: [
        {
          name: 'label',
          label: 'Tên',
          type: 'text',
        },
        {
          name: 'value',
          label: 'Giá trị',
          type: 'text',
        },
      ],
    },

    // ===== Chính sách =====
    {
      name: 'policy',
      type: 'richText',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'policy',
      },
      editor: lexicalEditor(),
    },
  ],
}
