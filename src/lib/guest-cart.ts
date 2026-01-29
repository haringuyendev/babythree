export type GuestCartItem = {
  product: {
    id: string
    slug: string
    title: string
    gallery?: { image?: { url?: string } }[]
    options?: any[]
  }
  variant?: {
    id: string
    options?: Record<string, string>
  }
  price: number
  quantity: number
}

const KEY = 'guest_cart'

export const getGuestCart = (): GuestCartItem[] => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export const setGuestCart = (items: GuestCartItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items))
}

export const clearGuestCart = () => {
  localStorage.removeItem(KEY)
}
