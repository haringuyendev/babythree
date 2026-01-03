import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig, Where } from 'payload'
import { TabBlock } from '@/blocks/TabBlock/config'
import {
  recalculateCategoryCount,
  recalculateCategoryCountAfterDelete,
} from './hooks/recalculateCategoryCount'
import { syncVariantsFromOptions } from './hooks/syncVariantsFromOptions'
import { generateOptionKey } from './hooks/generateOptionKey'
import { recalculatePriceRange } from './hooks/recanculatePriceRange'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Quản lý sản phẩm',
    plural: 'Quản lý sản phẩm',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'excerpt',
      'ageRange',
      'categories',
      'variants',
      'sku_code',
      'price',
      'stock',
    ],
    group: 'Quản lý cửa hàng',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
  },

  defaultPopulate: {
    title: true,
    slug: true,
    options: true,
    variants: true,
    gallery: true,
    meta: true,
    categories: true,
    features: true,
    ageRange: true,
    contentTabs: true,
    price:true,
    priceMin:true,
    priceMax:true,
  },

  fields: [
    /* ================= CORE ================= */

    {
      name: 'title',
      label: 'Tên sản phẩm',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },

    /* ================= TABS ================= */

    {
      type: 'tabs',
      tabs: [
        /* ---------------------------------
           TAB 1: THÔNG TIN HIỂN THỊ
        --------------------------------- */
        {
          label: 'Thông tin hiển thị',
          fields: [
            {
              name: 'excerpt',
              label: 'Mô tả ngắn',
              type: 'textarea',
            },

            {
              name: 'description',
              label: 'Mô tả chi tiết',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },

            {
              name: 'gallery',
              label: 'Thư viện hình ảnh',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },

            {
              name: 'contentTabs',
              label: 'Nội dung dạng Tabs',
              type: 'blocks',
              blocks: [TabBlock],
            },

            {
              name: 'ageRange',
              label: 'Độ tuổi phù hợp',
              type: 'relationship',
              relationTo: 'age-ranges',
            },

            {
              name: 'features',
              label: 'Chính sách / Ưu điểm',
              type: 'relationship',
              relationTo: 'policy',
              hasMany: true,
            },
          ],
        },

        /* ---------------------------------
           TAB 2: THÔNG TIN SẢN PHẨM
        --------------------------------- */
        {
          label: 'Thông tin sản phẩm',
          fields: [
            {
              name: 'sku_code',
              label: 'Mã SKU sản phẩm',
              type: 'text',
              required: true,
              unique: true,
              index: true,
            },

            {
              name: 'price',
              label: 'Giá bán',
              type: 'number',
              required: true,
              min: 0,
            },

            {
              name: 'priceMin',
              label: 'Giá thấp nhất',
              type: 'number',
              admin: {
                readOnly: true,
                position: 'sidebar',
              },
            },

            {
              name: 'priceMax',
              label: 'Giá cao nhất',
              type: 'number',
              admin: {
                readOnly: true,
                position: 'sidebar',
              },
            },

            {
              name: 'stock',
              label: 'Tồn kho',
              type: 'number',
              required: true,
              min: 0,
              defaultValue: 0,
            },

            {
              name: 'categories',
              label: 'Danh mục sản phẩm',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
            },

            {
              name: 'options',
              label: 'Tuỳ chọn biến thể (Options)',
              type: 'array',
              admin: {
                description: 'Ví dụ: Màu sắc, Kích cỡ',
              },
              fields: [
                {
                  name: 'label',
                  label: 'Tên biến thể',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'key',
                  label: 'Key',
                  type: 'text',
                  required: true,
                  admin: { readOnly: true },
                },
                {
                  name: 'values',
                  label: 'Giá trị',
                  type: 'array',
                  required: true,
                  fields: [
                    {
                      name: 'label',
                      label: 'Tên giá trị',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },

            {
              name: 'variants',
              label: 'Danh sách phiên bản (Variants)',
              type: 'join',
              collection: 'variants',
              on: 'product',
              admin: {
                allowCreate: true,
                description: 'Giá & tồn kho theo từng phiên bản',
                defaultColumns: ['sku', 'price', 'stock', 'isActive'],
              },
            },

            {
              name: 'relatedProducts',
              label: 'Sản phẩm liên quan',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              filterOptions: ({ id }) => (id ? ({ id: { not_in: [id] } } as Where) : {}),
            },
          ],
        },

        /* ---------------------------------
           TAB 3: SEO
        --------------------------------- */
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.slug && data.title) {
          const slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

          const exists = await req.payload.find({
            collection: 'products',
            where: { slug: { equals: slug } },
          })

          data.slug = exists.docs.length ? `${slug}-${Date.now()}` : slug
        }

        return data
      },
      generateOptionKey,
    ],
    afterChange: [syncVariantsFromOptions, recalculateCategoryCount, recalculatePriceRange],
    afterDelete: [recalculateCategoryCountAfterDelete],
  },
}
