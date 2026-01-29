'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Order } from '@/payload-types'
export interface OrderQueryParams {
  limit?: number;
}
export async function getOrderById(id:string): Promise<Order> {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'orders',
      limit: 1,
      where: {
        id: { equals: id },
      },
    })
    return docs[0]
  }