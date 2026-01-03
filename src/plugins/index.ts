import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}
export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  // ecommercePlugin({
  //   access: {
  //     adminOnlyFieldAccess,
  //     adminOrPublishedStatus,
  //     customerOnlyFieldAccess,
  //     isAdmin,
  //     isDocumentOwner,
  //   },
  //   customers: {
  //     slug: 'users',
  //   },
  //   currencies: {
  //     defaultCurrency: 'vnd',
  //     supportedCurrencies: [{
  //       code: 'vnd',
  //       symbol: '₫',
  //       label: 'Vietnamese Dong',
  //       decimals: 0,
  //     }],
  //   },
  //   payments: {
  //     paymentMethods: [
  //       stripeAdapter({
  //         secretKey: process.env.STRIPE_SECRET_KEY!,
  //         publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  //         webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
  //       }),
  //     ],
  //   },
  //   products: {
  //     productsCollectionOverride: ProductsCollection,
  //   },
  // }),
  s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET!,
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      requestHandler: {
        httpAgent: {
          keepAlive: true,
          maxSockets: 200, // Adjust based on load; start with 200
          maxFreeSockets: 20, // Keep some idle sockets
          keepAliveMsecs: 1000, // Send keep-alive probes every 1s
          timeout: 30000, // 30s timeout for inactive sockets
        },
        connectionTimeout: 5 * 1000,
        requestTimeout: 10 * 1000,
      },
      maxAttempts: 3, // Retry transient errors
      retryMode: 'standard',
      region: process.env.S3_REGION,
    },
  }),
]
