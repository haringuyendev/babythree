import { Block } from 'payload'

export const ContactFAQ: Block = {
  slug: 'contactFAQ',
  labels: {
    singular: 'FAQ Liên hệ',
    plural: 'FAQ Liên hệ',
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      defaultValue: 'Câu hỏi thường gặp',
    },
    {
      name: 'items',
      label: 'Danh sách câu hỏi',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'question',
          label: 'Câu hỏi',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          label: 'Trả lời',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
