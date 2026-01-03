import { baseApi } from '.'

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= GET MY CART ================= */
    getMyCart: builder.query<any, void>({
      query: () => '/carts/me',
      providesTags: ['Cart'],
    }),

    /* ================= ADD TO CART ================= */
    addToCart: builder.mutation<{ success: boolean }, { productId:string, variantId?: string; quantity: number }>({
      query: (body) => ({
        url: '/carts/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'], // 🔥 auto revalidate
    }),

    /* ================= UPDATE QUANTITY ================= */
    updateCartItem: builder.mutation<{ success: boolean }, { productId:string, variantId?: string; quantity: number }>(
      {
        query: (body) => ({
          url: '/carts/update',
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['Cart'],
      },
    ),

    /* ================= REMOVE ITEM ================= */
    removeCartItem: builder.mutation<{ success: boolean }, { productId:string, variantId?: string }>({
      query: (body) => ({
        url: '/carts/remove',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/carts/clear',
        method: 'POST',
      }),
      invalidatesTags: ['Cart'], // 🔥 revalidate cart
    }),
  }),
})

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi
