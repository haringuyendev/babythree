import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'none',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Home',
          value: 'home',
        },
        {
          label: 'About',
          value: 'about',
        },
      ],
      required: true,
    },
    {
      name: 'badgeText',
      label: 'Nhãn nổi bật (ví dụ: Giảm 30%)',
      type: 'text',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['home'].includes(type),
      },
    },
    {
      name: 'title',
      label: 'Tiêu đề chính',
      type: 'text',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['home', 'about'].includes(type),
      },
    },
    {
      name: 'highlight',
      label: 'Tiêu đề nhấn mạnh (dòng thứ 2)',
      type: 'text',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['home', 'about'].includes(type),
      },
    },
    {
      name: 'content',
      label: 'Mô tả ngắn',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },

    {
      name: 'primaryCTA',
      label: 'Nút hành động chính',
      type: 'group',
      fields: [
        { name: 'label', label: 'Chữ trên nút', type: 'text', required: true },
        { name: 'url', label: 'Đường dẫn', type: 'text', required: true },
      ],
      admin: {
        condition: (_, { type } = {}) => ['home'].includes(type),
      },
    },
    {
      name: 'secondaryCTA',
      label: 'Nút hành động phụ',
      type: 'group',
      fields: [
        { name: 'label', label: 'Chữ trên nút', type: 'text', required: true },
        { name: 'url', label: 'Đường dẫn', type: 'text', required: true },
      ],
      admin: {
        condition: (_, { type } = {}) => ['home'].includes(type),
      },
    },
    {
      name: 'image',
      label: 'Hình ảnh banner',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, { type } = {}) => ['home'].includes(type),
      },
    },
  ],
  label: false,
}
