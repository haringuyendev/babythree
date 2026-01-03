import { getCachedGlobal } from '@/utilities/getGlobals'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import './index.css'
import { HeaderClient } from './index.client'
import { User } from '@/payload-types'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  const headers = await getHeaders()
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers })
  return <HeaderClient data={headerData} user={user as User} />
}
