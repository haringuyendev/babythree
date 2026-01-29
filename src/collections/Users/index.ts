import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { publicAccess } from '@/access/publicAccess'
import { adminOrSelf } from '@/access/adminOrSelf'
import { checkRole } from '@/access/utilities'

import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { a } from 'vitest/dist/chunks/suite.d.FvehnV49.js'
import { json } from 'node_modules/payload/dist/fields/validations'

export const Users: CollectionConfig = {
  slug: 'users',
  labels:{
    singular:'Quản lý Khách hàng',
    plural:'Quản lý Khách hàng'
  },
  auth: {
    tokenExpiration: 60 * 60, // 1 giờ

    forgotPassword: {
      generateEmailHTML: ({ token, user } = {}) => {
        const resetURL = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`

        return `
          <div style="font-family: Arial; max-width: 520px; margin: auto">
            <h2 style="color:#22c55e">🔐 Đặt lại mật khẩu BabyThree</h2>

            <p>Xin chào <strong>${user?.email}</strong>,</p>

            <p>
              Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản BabyThree.
              Nhấn vào nút bên dưới để tiếp tục:
            </p>

            <a href="${resetURL}"
               style="
                 display:inline-block;
                 padding:12px 20px;
                 background:#22c55e;
                 color:#fff;
                 border-radius:8px;
                 text-decoration:none;
                 font-weight:bold;
               ">
              Đặt lại mật khẩu
            </a>

            <p style="margin-top:16px;color:#666;font-size:14px">
              Link này sẽ hết hạn sau 1 giờ.
              Nếu bạn không yêu cầu, hãy bỏ qua email này.
            </p>

            <hr />
            <p style="font-size:12px;color:#999">
              © BabyThree ${new Date().getFullYear()}
            </p>
          </div>
        `
      },

      generateEmailSubject: () => {
        return '🔐 Đặt lại mật khẩu BabyThree'
      },
    },
  },
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    group:'Quản lý cửa hàng',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'cart',
      type: 'join',
      collection: 'carts',
      on: 'customer',
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'addresses',
      type: 'join',
      collection: 'addresses',
      on: 'customer',
      admin: {
        allowCreate: false,
      },
    },
    {
      name:'dob',
      type:'date',
      admin:{
        position:'sidebar',
      }
    },
    {
      name:'phone',
      type:'text',
      admin:{
        position:'sidebar'
      }
    },
    {
      name:'avatar',
      type:'upload',
      relationTo:'media',
      admin:{
        position:'sidebar'
      }
    },
  ],
  endpoints: [
    {
      path: '/me',
      method: 'patch',
      handler: async (req) => {
        const { payload, user } = req
        if(!req.json){
          return Response.json(
            { message: 'Invalid request body' },
            { status: 400 },
          )
        }
        const data = await req.json()
        if (!user) {
          return Response.json(
            { message: 'Not authenticated' },
            { status: 401 },
          )
        }
        try {
          const updatedUser = await payload.update({
            collection: 'users',
            id: user.id,
            data: data,
            req,
          })

          return Response.json(updatedUser)
        } catch (error: any) {
          console.log(error)
          return Response.json(
            { message: error.message },
            { status: 500 },
          )
        }
      },
    },
  ],
}
