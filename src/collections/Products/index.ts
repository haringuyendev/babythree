import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
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
import { DefaultDocumentIDType, Where } from 'payload'
import {
  recalculateCategoryCount,
  recalculateCategoryCountAfterDelete,
} from './hooks/recalculateCategoryCount'

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  admin: {
    ...defaultCollection?.admin,
    useAsTitle: 'title',
    defaultColumns: ['title', 'enableVariants', '_status'],
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
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInvnd: true,
    inventory: true,
    meta: true,
    categories: true,
  },

  fields: [
    {
      name: 'title',
      label: 'Tên sản phẩm',
      type: 'text',
      required: true,
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Nội dung hiển thị',
          fields: [
            {
              name: 'description',
              label: 'Mô tả chi tiết sản phẩm',
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
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  label: 'Hình ảnh',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  label: 'Áp dụng cho phiên bản',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    description: 'Chọn phiên bản tương ứng (nếu sản phẩm có biến thể)',
                    condition: (data) =>
                      data?.enableVariants === true && data?.variantTypes?.length > 0,
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) =>
                        typeof item === 'object' && item?.id ? item.id : item,
                      ) as DefaultDocumentIDType[]

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs.length ? variantTypeIDs : [],
                        },
                      }

                      return query
                    }

                    return { variantType: { in: [] } }
                  },
                },
              ],
            },

            // {
            //   name: 'layout',
            //   label: 'Các khối nội dung bổ sung',
            //   type: 'blocks',
            //   blocks: [CallToAction, Content, MediaBlock],
            // },
          ],
        },

        {
          label: 'Thông tin sản phẩm',
          fields: [
            ...defaultCollection.fields,
            {
              name: 'relatedProducts',
              label: 'Sản phẩm liên quan',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              admin: {
                description: 'Chọn các sản phẩm gợi ý hiển thị bên dưới',
              },
              filterOptions: ({ id }) => (id ? { id: { not_in: [id] } } : { id: { exists: true } }),
            },
          ],
        },

        {
          name: 'meta',
          label: 'SEO & chia sẻ',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
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

    {
      name: 'categories',
      label: 'Danh mục sản phẩm',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
    },

    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Dùng cho URL chi tiết dự án (ví dụ: vinhomes-ocean-park)',
      },
    },
  ],
  hooks: {
     beforeChange: [
      // Tự động tạo slug nếu để trống
      async ({ data, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (!data.slug && data.title) {
            const slug = data.title
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd')
              .replace(/Đ/g, 'd')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')

            // Kiểm tra trùng slug
            const existing = await req.payload.find({
              collection: 'products',
              where: { slug: { equals: slug } },
            })

            if (existing.docs.length > 0) {
              return { ...data, slug: `${slug}-${Date.now()}` }
            }
            return { ...data, slug }
          }
        }
        return data
      },
    ],
    afterChange: [recalculateCategoryCount],
    afterDelete: [recalculateCategoryCountAfterDelete],
  },
})
