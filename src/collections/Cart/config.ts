// collections/Carts.ts
import { Product, Variant } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Carts: CollectionConfig = {
  slug: 'carts',
  labels:{
    singular:'Quản lý giỏ hàng',
    plural:'Quản lý giỏ hàng'
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },

  admin: {
    useAsTitle: 'id',
    group:'Quản lý cửa hàng',
    hidden:true
  },

  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'sessionId',
      type: 'text',
      admin: {
        description: 'Dùng cho guest cart',
      },
    },

    {
      name: 'items',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'variant',
          type: 'relationship',
          relationTo: 'variants',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Giá tại thời điểm thêm vào giỏ (tham khảo)',
          },
        },
      ],
    },

    {
      name: 'updatedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
  endpoints: [
    /* ---------- GET MY CART ---------- */
    {
      path: '/me',
      method: 'get',
      handler: async (req) => {
        const { payload, user } = req

        if (!user) {
          return Response.json(null)
        }

        const cart = await payload.find({
          collection: 'carts',
          where: {
            customer: { equals: user.id },
          },
          limit: 1,
          depth: 2,
        })

        return Response.json(cart.docs[0] || null)
      },
    },

    /* ---------- ADD TO CART ---------- */
    {
      path: '/add',
      method: 'post',
      handler: async (req) => {
        const { payload, user } = req
        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!req.json) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }

        const { productId, variantId, quantity = 1 } = await req.json()

        /* ---------- LOAD PRODUCT ---------- */
        const product = await payload.findByID({
          collection: 'products',
          id: productId,
          depth: 0,
        })

        if (!product) {
          return Response.json({ error: 'Product not found' }, { status: 404 })
        }

        const hasVariants = product.options && product.options?.length > 0

        /* ---------- SIMPLE PRODUCT ---------- */
        let price = product.price
        let variantRef: string | null = null

        if (!hasVariants) {
          if (product.stock < quantity) {
            return Response.json({ error: 'Not enough stock' }, { status: 400 })
          }
        }

        /* ---------- VARIANT PRODUCT ---------- */
        if (hasVariants) {
          if (!variantId) {
            return Response.json({ error: 'Variant is required for this product' }, { status: 400 })
          }

          const variant = await payload.findByID({
            collection: 'variants',
            id: variantId,
          })

          if (!variant || !variant.isActive) {
            return Response.json({ error: 'Variant not available' }, { status: 400 })
          }

          if (variant.stock < quantity) {
            return Response.json({ error: 'Not enough stock' }, { status: 400 })
          }

          price = variant.price
          variantRef = variant.id
        }

        /* ---------- FIND CART ---------- */
        const existing = await payload.find({
          collection: 'carts',
          where: { customer: { equals: user.id } },
          limit: 1,
        })

        const cart = existing.docs[0]

        const newItem = {
          product: product.id,
          variant: variantRef,
          quantity,
          price,
        }

        if (cart) {
          const items = [...(cart.items || [])]

          const idx = items.findIndex(
            (i) => (i.product as Product).id === product.id && (i.variant as Variant)?.id === variantRef,
          )

          if (idx > -1) {
            items[idx].quantity += quantity
          } else {
            items.push(newItem)
          }

          await payload.update({
            collection: 'carts',
            id: cart.id,
            data: { items },
          })
        } else {
          await payload.create({
            collection: 'carts',
            data: {
              customer: user.id,
              items: [newItem],
            },
          })
        }

        return Response.json({ success: true })
      },
    },

    /* ---------- UPDATE QUANTITY ---------- */
    {
      path: '/update',
      method: 'patch',
      handler: async (req) => {
        const { payload, user } = req
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        if (!req.json) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }

        const { productId, variantId = null, quantity } = await req.json()

        const cart = await payload.find({
          collection: 'carts',
          where: { customer: { equals: user.id } },
          limit: 1,
        })

        if (!cart.docs[0]) {
          return Response.json({ error: 'Cart not found' }, { status: 404 })
        }

        const items = cart.docs[0]?.items?.map((item: any) =>
          item.product.id === productId && (item.variant?.id ?? null) === variantId
            ? { ...item, quantity }
            : item,
        )

        await payload.update({
          collection: 'carts',
          id: cart.docs[0].id,
          data: { items },
        })

        return Response.json({ success: true })
      },
    },

    /* ---------- REMOVE ITEM ---------- */
    {
      path: '/remove',
      method: 'delete',
      handler: async (req) => {
        const { payload, user } = req
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

        if (!req.json) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }

        const { productId, variantId = null } = await req.json()

        const cart = await payload.find({
          collection: 'carts',
          where: { customer: { equals: user.id } },
          limit: 1,
        })

        if (!cart.docs[0]) return Response.json({ success: true })

        const items = cart.docs[0]?.items?.filter(
          (item: any) => !(item.product.id === productId && (item.variant?.id ?? null) === variantId),
        )

        await payload.update({
          collection: 'carts',
          id: cart.docs[0].id,
          data: { items },
        })

        return Response.json({ success: true })
      },
    },
    /* ---------- CLEAR CART ---------- */
    {
      path: '/clear',
      method: 'post',
      handler: async (req) => {
        const { payload, user } = req

        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const cart = await payload.find({
          collection: 'carts',
          where: {
            customer: { equals: user.id },
          },
          limit: 1,
        })

        if (!cart.docs[0]) {
          return Response.json({ success: true }) // không có cart thì coi như clear xong
        }

        await payload.update({
          collection: 'carts',
          id: cart.docs[0].id,
          data: {
            items: [],
          },
        })

        return Response.json({ success: true })
      },
    },
  ],
}
