import { useAuth } from '@/providers/Auth'
import {
  useGetAddressesQuery,
  useGetDefaultAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
  Address,
} from '@/store/api/address'

export function useAddress() {
  /* ================= QUERIES ================= */
  const {
    data: addresses = [],
    isLoading: isLoadingAddresses,
    isFetching,
    error,
  } = useGetAddressesQuery()

  const {user} = useAuth()

  const {
    data: defaultAddress,
    isLoading: isLoadingDefault,
  } = useGetDefaultAddressQuery()

  /* ================= MUTATIONS ================= */
  const [createAddress, createState] = useCreateAddressMutation()
  const [updateAddress, updateState] = useUpdateAddressMutation()
  const [deleteAddress, deleteState] = useDeleteAddressMutation()
  const [setDefaultAddress, setDefaultState] =
    useSetDefaultAddressMutation()

  /* ================= HELPERS ================= */

  const isLoading =
    isLoadingAddresses ||
    isLoadingDefault ||
    createState.isLoading ||
    updateState.isLoading ||
    deleteState.isLoading ||
    setDefaultState.isLoading

  /* ================= ACTION WRAPPERS ================= */

  const addAddress = async (data: Partial<Address>) => {
    return createAddress({...data, customer: user?.id}).unwrap()
  }

  const editAddress = async (
    id: string,
    data: Partial<Address>,
  ) => {
    return updateAddress({ id, data }).unwrap()
  }

  const removeAddress = async (id: string) => {
    return deleteAddress(id).unwrap()
  }

  const makeDefault = async (id: string) => {
    return setDefaultAddress(id).unwrap()
  }

  /* ================= DERIVED ================= */

  const hasAddress = addresses.length > 0

  return {
    /* data */
    addresses,
    defaultAddress,
    hasAddress,

    /* states */
    isLoading,
    isFetching,
    error,

    /* actions */
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
  }
}
