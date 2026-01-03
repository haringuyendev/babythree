import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels:{
    singular:'Quản lý danh mục',
    plural:'Quản lý danh mục'
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý cửa hàng',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    slugField({
      position: undefined,
    }),
    {
      name: 'productCount',
      label: 'Số lượng sản phẩm',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
