// src/store/guestCartSlice.ts
import { Product } from '@/payload-types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type GuestCartItem = {
  product: Partial<Product>
  variant?: {
    id: string
    options?: Record<string, string>
  }
  price: number
  quantity: number
}

type GuestCartState = {
  items: GuestCartItem[]
}

const initialState: GuestCartState = {
  items: [],
}

const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<GuestCartItem>) {
      const found = state.items.find(
        i =>
          i.product.id === action.payload.product.id &&
          i.variant?.id === action.payload.variant?.id
      )

      if (found) found.quantity += action.payload.quantity
      else state.items.push(action.payload)
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string
        variantId?: string
        quantity: number
      }>
    ) {
      const item = state.items.find(
        i =>
          i.product.id === action.payload.productId &&
          i.variant?.id === action.payload.variantId
      )
      if (item) item.quantity = action.payload.quantity
    },

    removeItem(
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>
    ) {
      state.items = state.items.filter(
        i =>
          !(
            i.product.id === action.payload.productId &&
            i.variant?.id === action.payload.variantId
          )
      )
    },

    clearGuestCart(state) {
      state.items = []
    },
  },
})

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearGuestCart,
} = guestCartSlice.actions

export default guestCartSlice.reducer
