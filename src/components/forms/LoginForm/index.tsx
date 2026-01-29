'use client'

import React, { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = useRef(searchParams.get('redirect'))

  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)

        toast.success('Đăng nhập thành công!', {
          description: 'Chào mừng bạn quay lại BabyThree.',
        })

        router.push(redirectParam.current || '/account')
        router.refresh()
      } catch (err) {
        toast.error('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
      }
    },
    [login, router],
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
              <h1 className="text-2xl font-bold text-foreground">
                Đăng nhập
              </h1>
              <p className="mt-2 text-muted-foreground">
                Chào mừng bạn quay lại BabyThree
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href={`/forgot-password${
                      searchParams.toString()
                        ? `?${searchParams.toString()}`
                        : ''
                    }`}
                    className="text-sm text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="h-12 rounded-xl pl-11 pr-11"
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-2xl py-6 font-bold shadow-button transition-all hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Divider */}
            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  onClick={loginWithGoogle}
                  variant="outline"
                  className="h-12 w-full rounded-xl font-semibold"
                >
                  Đăng nhập với Google
                </Button>
              </div>
            </div> */}

            {/* Register */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link
                href={`/create-account${
                  searchParams.toString()
                    ? `?${searchParams.toString()}`
                    : ''
                }`}
                className="font-semibold text-primary hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
