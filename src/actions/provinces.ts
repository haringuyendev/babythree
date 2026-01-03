'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
export async function getProvinces() {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'provinces',
      where: {
        isActive: { equals: true },
      },
      pagination: false,
    })
    return docs
  }