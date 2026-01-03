import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Order, User } from '@/payload-types'
import { AccountClient } from './page.client'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent(
        'Please login to access your account settings.',
      )}`,
    )
  }

  let orders: Order[] = []

  try {
    const result = await payload.find({
      collection: 'orders',
      pagination: false,
      where: {
        customer: { equals: user.id },
      },
    })

    orders = result.docs
  } catch {
    orders = []
  }

  return <AccountClient user={user as User} orders={orders} />
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account and orders',
}
