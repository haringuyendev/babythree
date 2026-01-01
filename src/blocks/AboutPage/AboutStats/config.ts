// blocks/AboutStats/config.ts
import { Block } from 'payload'

export const AboutStatsBlock: Block = {
  slug: 'aboutStats',
  labels: {
    singular: 'About – Stats',
    plural: 'About – Stats',
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
