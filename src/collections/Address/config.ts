// collections/Addresses.ts
import type { CollectionConfig } from 'payload'
import { adminOrSelf } from '@/access/adminOrSelf'
import { User } from '@/payload-types'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  labels:{
    singular:'Quản lý địa chỉ',
    plural:'Quản lý địa chỉ'
  },
  access: {
    create: adminOrSelf,
    read: adminOrSelf,
    update: adminOrSelf,
    delete: adminOrSelf,
  },

  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'phone', 'city', 'isDefault', 'email'],
    group:'Quản lý cửa hàng',
  },

  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },

    {
      name: 'fullName',
      label: 'Tên người nhận',
      type: 'text',
      required: true,
    },

    {
      name: 'email',
      type: 'text',
    },

    {
      name: 'phone',
      type: 'text',
      required: true,
    },

    {
      name: 'addressLine',
      label: 'Địa chỉ',
      type: 'text',
      required: true,
    },

    {
      name: 'ward',
      type: 'text',
    },

    {
      name: 'district',
      type: 'text',
    },

    {
      name: 'city',
      type: 'text',
      required: true,
    },

    {
      name: 'isDefault',
      label: 'Địa chỉ mặc định',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  endpoints: [
    /* ================= GET MY ADDRESSES ================= */
    {
      path: '/me',
      method: 'get',
      handler: async (req) => {
        const { user, payload } = req

        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const res = await payload.find({
          collection: 'addresses',
          where: {
            customer: { equals: user.id },
          },
          sort: '-isDefault',
          pagination: false,
        })

        return Response.json(res.docs)
      },
    },

    /* ================= CREATE ADDRESS ================= */
    {
      path: '/me',
      method: 'post',
      handler: async (req) => {
        const { user, payload } = req
        const body = await req.json?.()

        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (body.isDefault) {
          // bỏ default cũ
          await payload.update({
            collection: 'addresses',
            where: {
              customer: { equals: user.id },
              isDefault: { equals: true },
            },
            data: { isDefault: false },
          })
        }

        const address = await payload.create({
          collection: 'addresses',
          data: {
            ...body,
            customer: user.id,
          },
        })

        return Response.json(address)
      },
    },

    /* ================= UPDATE ADDRESS ================= */
    {
      path: '/me/:id',
      method: 'patch',
      handler: async (req) => {
        const { user, payload, routeParams } = req
        const body = await req.json?.()

        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const address = await payload.findByID({
          collection: 'addresses',
          id: routeParams?.id as string,
        })
        if (!address || (address.customer as User)?.id !== user.id) {
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (body.isDefault) {
          await payload.update({
            collection: 'addresses',
            where: {
              customer: { equals: user.id },
              isDefault: { equals: true },
            },
            data: { isDefault: false },
          })
        }

        const updated = await payload.update({
          collection: 'addresses',
          id: address.id,
          data: body,
        })

        return Response.json(updated)
      },
    },

    /* ================= DELETE ADDRESS ================= */
    {
      path: '/me/:id',
      method: 'delete',
      handler: async (req) => {
        const { user, payload, routeParams } = req

        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const address = await payload.findByID({
          collection: 'addresses',
          id: routeParams?.id as string,
        })

        if (!address || (address.customer as User)?.id !== user.id) {
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        }

        await payload.delete({
          collection: 'addresses',
          id: address.id,
        })

        return Response.json({ success: true })
      },
    },
  ],
}
