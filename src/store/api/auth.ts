import type { User } from '@/payload-types'
import { baseApi } from '.'

type LoginArgs = {
  email: string
  password: string
}

type RegisterArgs = {
  email: string
  password: string
  passwordConfirm: string
}

type ForgotPasswordArgs = {
  email: string
}

type ResetPasswordArgs = {
  password: string
  passwordConfirm: string
  token: string
}

type UpdateUserArgs = {
  name?: string
  email?: string
  phone?: string
  dob?: string
  password?: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* =====================
       GET ME
    ===================== */
    getMe: builder.query<any | null, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    /* =====================
       LOGIN
    ===================== */
    login: builder.mutation<User, LoginArgs>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /* =====================
       REGISTER
    ===================== */
    register: builder.mutation<User, RegisterArgs>({
      query: (body) => ({
        url: '/users/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /* =====================
       LOGOUT
    ===================== */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    /* =====================
       FORGOT PASSWORD
    ===================== */
    forgotPassword: builder.mutation<void, ForgotPasswordArgs>({
      query: (body) => ({
        url: '/users/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    /* =====================
       RESET PASSWORD
    ===================== */
    resetPassword: builder.mutation<User, ResetPasswordArgs>({
      query: (body) => ({
        url: '/users/reset-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<User, UpdateUserArgs>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH', // Payload CMS chuẩn là PATCH /users/me
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} = authApi
