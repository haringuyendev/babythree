// collections/Provinces.ts
import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const Provinces: CollectionConfig = {
  slug: 'provinces',
  labels:{
    singular:'Quản lý tỉnh / thành phố',
    plural:'Quản lý tỉnh / thành phố'
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'isActive'],
    group:'Cấu hình hệ thống',
  },

  fields: [
    {
      name: 'name',
      label: 'Tên tỉnh / thành',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      label: 'Mã',
      type: 'number',
      required: true,
      unique: true,
    },
    {
        name:'division_type',
        type:'text',
        required:true,
        defaultValue:'province'
    },
    {
        name:'codename',
        type:'text',
        required:true,
        defaultValue:'province'
    },
    {
      name: 'isActive',
      label: 'Đang sử dụng',
      type: 'checkbox',
      defaultValue: true,
    },
  ],

  endpoints:[
    {
      path: '/import',
      method: 'get',
      handler: async (req) => {
        const { payload, user } = req

        if (!user) {
          return Response.json(
            { error: 'Unauthorized' },
            { status: 401 },
          )
        }
        /* ================= FETCH API ================= */
        const res = await fetch(
          'https://provinces.open-api.vn/api/v1/p/?depth=1',
        )

        if (!res.ok) {
          return Response.json(
            { error: 'Cannot fetch provinces API' },
            { status: 500 },
          )
        }

        const provinces: {
          code: number
          name: string
          division_type: string
          codename: string
        }[] = await res.json()

        let created = 0
        let skipped = 0

        /* ================= UPSERT ================= */
        for (const p of provinces) {
          const exists = await payload.find({
            collection: 'provinces',
            where: {
              code: { equals: p.code },
            },
            limit: 1,
          })

          if (exists.docs.length) {
            skipped++
            continue
          }

          await payload.create({
            collection: 'provinces',
            draft: false,
            data: {
              name: p.name,
              code: p.code,
              division_type: p.division_type,
              codename: p.codename,
              isActive: true,
            },
          })

          created++
        }

        return Response.json({
          success: true,
          total: provinces.length,
          created,
          skipped,
        })
      },
    },
  ]
}
