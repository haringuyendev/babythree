// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import ProductDetailClient from './page.client'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await queryProductBySlug(slug)

  if (!product) return notFound()

  return <ProductDetailClient product={product} />
}


const queryProductBySlug = async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    pagination: false,
    draft,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
}
