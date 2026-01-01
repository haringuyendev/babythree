// blocks/AboutValues/config.ts
import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const AboutValuesBlock: Block = {
  slug: 'aboutValues',
  labels: {
    singular: 'About – Core Values',
    plural: 'About – Core Values',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Giá trị cốt lõi',
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          AlignFeature(),
        ],
      }),
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả ngắn',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              AlignFeature(),
            ],
          }),
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'Pink', value: 'baby-pink-light' },
            { label: 'Mint', value: 'baby-mint-light' },
            { label: 'Cream', value: 'baby-cream-light' },
            { label: 'Lavender', value: 'baby-lavender' },
          ],
        },
      ],
    },
  ],
}
