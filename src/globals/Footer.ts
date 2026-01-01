import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer (Chân trang)',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Giao diện',
  },
  fields: [
    /* =====================================================
       BRAND
    ===================================================== */
    {
      type: 'group',
      name: 'brand',
      label: 'Thương hiệu',
      fields: [
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'name',
          label: 'Tên thương hiệu',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Mô tả ngắn',
          type: 'textarea',
        },
      ],
    },

    /* =====================================================
       SOCIAL ICONS (IMAGE)
    ===================================================== */
    {
      type: 'array',
      name: 'socials',
      label: 'Mạng xã hội',
      fields: [
        {
          name: 'icon',
          label: 'Icon (ảnh)',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'url',
          label: 'Link',
          type: 'text',
          required: true,
        },
      ],
    },

    /* =====================================================
       QUICK LINKS (MULTI BLOCKS)
    ===================================================== */
    {
      type: 'array',
      name: 'quickLinks',
      label: 'Các cột liên kết',
      admin: {
        description: 'Mỗi cột là một nhóm link (VD: Liên kết nhanh, Hỗ trợ, Chính sách)',
      },
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề cột',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          label: 'Danh sách link',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Tên link',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              label: 'Đường dẫn',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    /* =====================================================
       CONTACT (ICON = IMAGE)
    ===================================================== */
    {
      type: 'group',
      name: 'contact',
      label: 'Thông tin liên hệ',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          defaultValue: 'Liên hệ',
        },
        {
          name: 'items',
          label: 'Danh sách liên hệ',
          type: 'array',
          fields: [
            {
              name: 'icon',
              label: 'Icon (ảnh)',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'text',
              label: 'Nội dung',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    /* =====================================================
       NEWSLETTER
    ===================================================== */
    {
      type: 'group',
      name: 'newsletter',
      label: 'Đăng ký nhận tin',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          defaultValue: 'Đăng ký nhận tin',
        },
        {
          name: 'placeholder',
          label: 'Placeholder email',
          type: 'text',
          defaultValue: 'Email của bạn',
        },
        {
          name: 'buttonLabel',
          label: 'Chữ nút',
          type: 'text',
          defaultValue: 'Gửi',
        },
      ],
    },

    /* =====================================================
       BOTTOM
    ===================================================== */
    {
      type: 'group',
      name: 'bottom',
      label: 'Dòng cuối footer',
      fields: [
        {
          name: 'copyright',
          label: 'Copyright',
          type: 'text',
        },
        {
          name: 'links',
          label: 'Link pháp lý',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Tên link',
              type: 'text',
            },
            {
              name: 'url',
              label: 'Đường dẫn',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
