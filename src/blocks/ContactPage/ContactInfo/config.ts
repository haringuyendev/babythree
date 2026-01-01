import { Block } from 'payload'

export const ContactInfo: Block = {
  slug: 'contactInfo',
  labels: {
    singular: 'Thông tin liên hệ',
    plural: 'Thông tin liên hệ',
  },
  fields: [
    {
      name: 'items',
      label: 'Danh sách thông tin',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          label: 'Icon (ảnh)',
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
          name: 'content',
          label: 'Nội dung',
          type: 'text',
          required: true,
        },
        {
          name: 'backgroundColor',
          label: 'Màu nền icon',
          type: 'text',
          admin: {
            placeholder: '#FFE4EC',
            description:
              'Nhập mã màu: #HEX, rgb(), hsl()',
          },
          defaultValue: '#FFE4EC',
        },
      ],
    },
  ],
}
