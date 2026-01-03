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
    // ===== Nội dung chi tiết =====
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
}
