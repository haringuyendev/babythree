import { baseApi } from '.'

export interface Address {
  id: string
  customer: string
  fullName: string
  email?: string
  phone: string
  addressLine: string
  ward?: string
  district?: string
  city: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ================= GET MY ADDRESSES ================= */
    getAddresses: builder.query<Address[], void>({
      query: () => ({
        url: '/addresses/me',
      }),
      providesTags: ['Address'],
    }),

    /* ================= GET DEFAULT ================= */
    getDefaultAddress: builder.query<Address | null, void>({
      async queryFn(_arg, _api, _opt, baseQuery) {
        const res = await baseQuery({ url: '/addresses/me' })
        if (res.error) return { error: res.error as any }

        const addresses = res.data as Address[]
        const defaultAddress =
          addresses.find((a) => a.isDefault) || null

        return { data: defaultAddress }
      },
      providesTags: ['Address'],
    }),

    /* ================= CREATE ================= */
    createAddress: builder.mutation<Address, Partial<Address>>({
      query: (data) => ({
        url: '/addresses/me',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Address'],
    }),

    /* ================= UPDATE ================= */
    updateAddress: builder.mutation<
      Address,
      { id: string; data: Partial<Address> }
    >({
      query: ({ id, data }) => ({
        url: `/addresses/me/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Address'],
    }),

    /* ================= DELETE ================= */
    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/addresses/me/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),

    /* ================= SET DEFAULT ================= */
    setDefaultAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/addresses/me/${id}`,
        method: 'PATCH',
        body: { isDefault: true },
      }),
      invalidatesTags: ['Address'],
    }),
  }),
})

export const {
  useGetAddressesQuery,
  useGetDefaultAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi
