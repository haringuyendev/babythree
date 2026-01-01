import { Block } from 'payload'

export const ContactMap: Block = {
  slug: 'contactMap',
  labels: {
    singular: 'Bản đồ liên hệ (Embed)',
    plural: 'Bản đồ liên hệ (Embed)',
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề (tuỳ chọn)',
      type: 'text',
    },
    {
      name: 'embedUrl',
      label: 'Google Maps Embed URL',
      type: 'text',
      required: true,
      admin: {
        description:
          'Dán link từ Google Maps → Share → Embed a map → src',
      },
    },
    {
      name: 'height',
      label: 'Chiều cao bản đồ (px)',
      type: 'number',
      defaultValue: 360,
    },
    {
      name: 'rounded',
      label: 'Bo góc',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
