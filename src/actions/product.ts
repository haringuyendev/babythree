'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Product } from '@/payload-types'
export interface ProductQueryParams {
  limit?: number;
}
export async function getProductHomepage(params: ProductQueryParams = {}): Promise<Product[]> {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'products',
      limit: params.limit || 8,
      where: {
        
        draft: { equals: false },
        published: { equals: true },
      },
    })
    return docs
  }
export async function getProductByQuery(params:any) {
  const {
    q,
    category,
    age,
    brand,
    minPrice,
    maxPrice,
    sort = '-createdAt',
  } = params
  const categoriesQuery = category?.split(',') ?? []
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    where: {
      and: [
        { _status: { equals: 'published' } },
        q
          ? {
            or: [
              { title: { like: q } },
              { description: { like: q } },
            ],
          }
          : {},

        category
          ? {
            "categories.slug": {
              in: categoriesQuery,
            },
          }
          : {},

        age
          ? {
            ageRanges: {
              in: Array.isArray(age) ? age : [age],
            },
          }
          : {},

        brand
          ? {
            brand: {
              in: Array.isArray(brand) ? brand : [brand],
            },
          }
          : {},

        minPrice || maxPrice
          ? {
            priceInvnd: {
              ...(minPrice ? { greater_than_equal: Number(minPrice) } : {}),
              ...(maxPrice ? { less_than_equal: Number(maxPrice) } : {}),
            },
          }
          : {},
      ],
    },
    sort,
    limit: 10,
    depth: 2,
  })
  return products
}
export async function getProductCategory(){
  const payload = await getPayload({ config: configPromise })
  const catergories = await payload.find({
    collection: 'categories',
    draft: false,
    limit: 100,
    depth: 2
  })
  return catergories
}