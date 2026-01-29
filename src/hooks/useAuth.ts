'use client'

import { useCallback } from 'react'
import type { User } from '@/payload-types'
import {
  useForgotPasswordMutation,
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} from '@/store/api/auth'

type AuthStatus = 'loggedIn' | 'loggedOut' | 'loading'

export const useAuth = () => {
  /* =====================
     QUERIES
  ===================== */
  const { data: userData, isLoading, isFetching, refetch } = useGetMeQuery()

  /* =====================
     MUTATIONS
  ===================== */
  const [loginMutation] = useLoginMutation()
  const [logoutMutation] = useLogoutMutation()
  const [registerMutation] = useRegisterMutation()
  const [forgotPasswordMutation] = useForgotPasswordMutation()
  const [resetPasswordMutation] = useResetPasswordMutation()
  const [updateUserMutation] = useUpdateUserMutation()

  /* =====================
     DERIVED STATE
  ===================== */
  const status: AuthStatus = isLoading || isFetching ? 'loading' : userData.user ? 'loggedIn' : 'loggedOut'

  /* =====================
     ACTIONS (API giống Context cũ)
  ===================== */
  const login = useCallback(
    async (args: { email: string; password: string }): Promise<User> => {
      const res = await loginMutation(args).unwrap()
      await refetch()
      return res
    },
    [loginMutation, refetch],
  )

  const logout = useCallback(async (): Promise<void> => {
    await logoutMutation().unwrap()
    await refetch()
  }, [logoutMutation, refetch])

  const register = useCallback(
    async (args: { email: string; password: string; passwordConfirm: string }): Promise<User> => {
      const res = await registerMutation(args).unwrap()
      await refetch()
      return res
    },
    [registerMutation, refetch],
  )

  const forgotPassword = useCallback(
    async (args: { email: string }): Promise<void> => {
      await forgotPasswordMutation(args).unwrap()
    },
    [forgotPasswordMutation],
  )

  const resetPassword = useCallback(
    async (args: { password: string; passwordConfirm: string; token: string }): Promise<User> => {
      const res = await resetPasswordMutation(args).unwrap()
      await refetch()
      return res
    },
    [resetPasswordMutation, refetch],
  )

  const updateUser = useCallback(
    async (data: {
      name?: string
      email?: string
      phone?: string
      dob?: string
      password?: string
    }): Promise<User> => {
      const updatedUser = await updateUserMutation(data).unwrap()
      await refetch() // đồng bộ lại getMe
      return updatedUser
    },
    [updateUserMutation, refetch],
  )

  /* =====================
     RETURN
  ===================== */
  return {
    user:userData?.user as User | null,
    status,
    isAuthenticated: !!userData?.user,

    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    updateUser,

    refetchMe: refetch,
  }
}
