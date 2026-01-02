'use client'

import React, { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/providers/Auth'
import { Message } from '@/components/Message'
import { toast } from 'sonner'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
  name?: string
  terms: boolean
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : ''

  const redirect = searchParams.get('redirect')
  const router = useRouter()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const password = useRef('')
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      setError(null)
      setLoading(true)

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.email,
              password: data.password,
              name: data.name,
            }),
          },
        )

        if (!res.ok) {
          throw new Error(res.statusText || 'Create account failed')
        }

        await login({
          email: data.email,
          password: data.password,
        })

        toast('Đăng ký thành công!', {
          description: 'Chào mừng bạn đến với BabyThree.',
        })

        router.push(
          redirect ||
            `/account?success=${encodeURIComponent(
              'Account created successfully',
            )}`,
        )
      } catch (err) {
        setError(
          'Không thể tạo tài khoản. Email có thể đã tồn tại.',
        )
      } finally {
        setLoading(false)
      }
    },
    [login, redirect, router],
  )

  return (
    <div className="min-h-screen bg-linear-to-br from-baby-pink-light via-background to-baby-mint-light">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-button">
                <span className="text-xl font-extrabold text-primary-foreground">
                  B3
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                BabyThree
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-card p-8 shadow-card">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">
                Đăng ký tài khoản
              </h1>
              <p className="mt-2 text-muted-foreground">
                Tạo tài khoản để mua sắm dễ dàng hơn
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Message error={error} />

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="h-12 rounded-xl pl-11"
                    {...register('name')}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    className="h-12 rounded-xl pl-11"
                    {...register('email', {
                      required: 'Email là bắt buộc',
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className="h-12 rounded-xl pl-11 pr-11"
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu tối thiểu 6 ký tự',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="passwordConfirm"
                    type={
                      showConfirmPassword ? 'text' : 'password'
                    }
                    placeholder="********"
                    className="h-12 rounded-xl pl-11 pr-11"
                    {...register('passwordConfirm', {
                      validate: (value) =>
                        value === password.current ||
                        'Mật khẩu không khớp',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-sm text-destructive">
                    {errors.passwordConfirm.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  {...register('terms', {
                    required:
                      'Bạn cần đồng ý với điều khoản',
                  })}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  Tôi đồng ý với{' '}
                  <Link
                    href="/terms"
                    className="text-primary"
                  >
                    Điều khoản dịch vụ
                  </Link>
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-2xl py-6 font-bold shadow-button transition-all hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link
                href={`/login${allParams}`}
                className="font-semibold text-primary hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
