// hooks/recalculateCategoryCount.ts

import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const recalculateCategoryCount: CollectionAfterChangeHook = async ({
  req,
  doc,
  previousDoc,
}) => {
  const payload = req.payload

  const oldCategories =
    previousDoc?.categories?.map((c: any) =>
      typeof c === 'string' ? c : c.id
    ) ?? []

  const newCategories =
    doc?.categories?.map((c: any) =>
      typeof c === 'string' ? c : c.id
    ) ?? []

  const affectedCategoryIds = Array.from(
    new Set([...oldCategories, ...newCategories]),
  )

  for (const categoryId of affectedCategoryIds) {
    const { totalDocs } = await payload.count({
      collection: 'products',
      where: {
        categories: { contains: categoryId },
      },
    })

    await payload.update({
      collection: 'categories',
      id: categoryId, // 👈 BẮT BUỘC là string
      data: {
        productCount: totalDocs,
      },
    })
  }
}


export const recalculateCategoryCountAfterDelete: CollectionAfterDeleteHook = async ({
  req,
  doc,
}) => {
  const payload = req.payload

  const categories = doc?.categories?.map((cat: any) => cat.id) || []

  for (const categoryId of categories) {
    const count = await payload.count({
      collection: 'products',
      where: {
        categories: {
          contains: categoryId,
        },
      },
    })

    await payload.update({
      collection: 'categories',
      id: categoryId,
      data: {
        productCount: count.totalDocs,
      },
    })
  }
}
