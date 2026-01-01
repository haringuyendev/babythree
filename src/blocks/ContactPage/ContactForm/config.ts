import { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  labels: {
    singular: 'Form liên hệ',
    plural: 'Form liên hệ',
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề form',
      type: 'text',
      required: true,
      defaultValue: 'Gửi tin nhắn cho chúng tôi',
    },
    {
      name: 'submitText',
      label: 'Text nút gửi',
      type: 'text',
      defaultValue: 'Gửi tin nhắn',
    },
    {
      name: 'successMessage',
      label: 'Thông báo thành công',
      type: 'text',
      defaultValue: 'Chúng tôi sẽ liên hệ với bạn sớm nhất.',
    },
  ],
}
