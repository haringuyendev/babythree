// blocks/AboutStory/config.ts
import { AlignFeature, FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const AboutStoryBlock: Block = {
  slug: 'aboutStory',
  labels: {
    singular: 'About – Story',
    plural: 'About – Story',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Câu chuyện của chúng tôi',
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
          AlignFeature(),
        ],
      }),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
