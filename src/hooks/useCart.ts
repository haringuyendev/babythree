'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import {
  useGetMyCartQuery,
  useAddToCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
  useClearCartMutation,
} from '@/store/api/cart'

type AddToCartArgs = {
  productId: string
  variantId?: string
  quantity?: number
}

type UpdateItemArgs = {
  productId: string
  variantId?: string
  quantity: number
}

type RemoveItemArgs = {
  productId: string
  variantId?: string
}

export function useCart() {
  /* ================= QUERY ================= */
  const {
    data: cart,
    isLoading,
    isFetching,
  } = useGetMyCartQuery()

  /* ================= MUTATIONS ================= */
  const [addToCartMutation, { isLoading: isAdding }] =
    useAddToCartMutation()

  const [updateItemMutation] =
    useUpdateCartItemMutation()

  const [removeItemMutation] =
    useRemoveCartItemMutation()

  const [clearCartMutation] =
    useClearCartMutation()

  /* ================= DERIVED ================= */
  const totalQuantity = useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    )
  }, [cart])

  const totalPrice = useMemo(() => {
    if (!cart?.items?.length) return 0
    return cart.items.reduce(
      (sum: number, item: any) =>
        sum + item.quantity * item.price,
      0,
    )
  }, [cart])

  /* ================= ACTIONS ================= */

  const addToCart = async ({
    productId,
    variantId,
    quantity = 1,
  }: AddToCartArgs) => {
    try {
      await addToCartMutation({
        productId,
        variantId,
        quantity,
      }).unwrap()

      toast.success('Đã thêm vào giỏ hàng')
    } catch (err: any) {
      toast.error(err?.data?.error || 'Không thể thêm vào giỏ')
    }
  }

  const updateQuantity = async ({
    productId,
    variantId,
    quantity,
  }: UpdateItemArgs) => {
    try {
      await updateItemMutation({
        productId,
        variantId,
        quantity,
      }).unwrap()
    } catch (err: any) {
      toast.error(err?.data?.error || 'Không thể cập nhật số lượng')
    }
  }

  const removeItem = async ({
    productId,
    variantId,
  }: RemoveItemArgs) => {
    try {
      await removeItemMutation({
        productId,
        variantId,
      }).unwrap()
    } catch {
      toast.error('Không thể xoá sản phẩm')
    }
  }

  const clear = async () => {
    try {
      await clearCartMutation().unwrap()
    } catch {
      toast.error('Không thể xoá giỏ hàng')
    }
  }

  return {
    /* state */
    cart,
    loading: isLoading,
    isFetching,
    isAdding,

    /* derived */
    totalQuantity,
    totalPrice,

    /* actions */
    addToCart,
    updateQuantity,
    removeItem,
    clear,
  }
}
