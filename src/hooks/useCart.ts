'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/useAuth'
import type { RootState, AppDispatch } from '@/store'

import {
  addItem,
  updateQuantity as updateGuestQty,
  removeItem as removeGuestItem,
  clearGuestCart,
  type GuestCartItem,
} from '@/store/slices/guestCart'

import {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '@/store/api/cart'

export function useCart() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, status } = useAuth()
  const mergedRef = useRef(false)

  /* ================= GUEST CART (REDUX) ================= */
  const guestItems = useSelector(
    (state: RootState) => state.guestCart.items
  )

  /* ================= SERVER CART ================= */
  const {
    data: serverCart,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyCartQuery(undefined, {
    skip: !user,
  })

  const [addToCartMutation] = useAddToCartMutation()
  const [updateItemMutation] = useUpdateCartItemMutation()
  const [removeItemMutation] = useRemoveCartItemMutation()
  const [clearCartMutation] = useClearCartMutation()

  /* ================= ITEMS SOURCE ================= */
  const items: GuestCartItem[] = useMemo(() => {
    if (user && serverCart?.items) return serverCart.items
    return guestItems
  }, [user, serverCart, guestItems])

  /* ================= DERIVED ================= */
  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    [items]
  )

  /* ================= ACTIONS ================= */

  /** ➕ ADD */
  const addToCart = async (item: GuestCartItem) => {
    if (user && item?.product?.id) {
      await addToCartMutation({
        productId: item?.product?.id,
        variantId: item.variant?.id,
        quantity: item.quantity,
      }).unwrap()
    } else {
      dispatch(addItem(item))
    }

    toast.success('Đã thêm vào giỏ hàng')
  }

  /** 🔄 UPDATE */
  const updateQuantity = async ({
    productId,
    variantId,
    quantity,
  }: {
    productId: string
    variantId?: string
    quantity: number
  }) => {
    if (user) {
      await updateItemMutation({
        productId,
        variantId,
        quantity,
      }).unwrap()
    } else {
      dispatch(updateGuestQty({ productId, variantId, quantity }))
    }
  }

  /** ❌ REMOVE */
  const removeItem = async ({
    productId,
    variantId,
  }: {
    productId: string
    variantId?: string
  }) => {
    if (user) {
      await removeItemMutation({
        productId,
        variantId,
      }).unwrap()
    } else {
      dispatch(removeGuestItem({ productId, variantId }))
    }
  }

  /** 🧹 CLEAR */
  const clear = async () => {
    if (user) {
      await clearCartMutation().unwrap()
    } else {
      dispatch(clearGuestCart())
    }
  }

  /* ================= MERGE GUEST → USER ================= */
  useEffect(() => {
    if (!user || status !== 'loggedIn') return
    if (mergedRef.current) return
    if (!guestItems.length) return

    mergedRef.current = true

    ;(async () => {
      try {
        await Promise.all(
          guestItems.map(item =>
            addToCartMutation({
              productId: item?.product?.id as string,
              variantId: item.variant?.id,
              quantity: item.quantity,
            }).unwrap()
          )
        )

        dispatch(clearGuestCart())
        await refetch()
      } catch {
        mergedRef.current = false
        toast.error('Không thể đồng bộ giỏ hàng')
      }
    })()
  }, [user, status, guestItems, addToCartMutation, dispatch, refetch])

  return {
    cart: { items },
    loading: isLoading,
    isFetching,
    totalQuantity,
    totalPrice,

    addToCart,
    updateQuantity,
    removeItem,
    clear,
  }
}
