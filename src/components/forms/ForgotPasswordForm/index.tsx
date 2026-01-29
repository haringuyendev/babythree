'use client'

import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
}

export const ForgotPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    setLoading(true)
    setError('')

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (response.ok) {
      setSuccess(true)
    } else {
      setError(
        'Không thể gửi email reset mật khẩu. Vui lòng thử lại.',
      )
    }

    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-baby-pink-light via-background to-baby-mint-light">
      <div className="container flex min-h-screen items-center justify-center">
        <div className="w-full max-w-lg">
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
            {/* ================= SUCCESS ================= */}
            {success ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h1 className="text-2xl font-bold text-green-600">
                  Gửi email thành công
                </h1>
                <p className="text-muted-foreground">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn.
                  <br />
                  Vui lòng kiểm tra hộp thư (kể cả spam).
                </p>

                <Button asChild className="mt-4 rounded-xl px-6">
                  <Link href="/login">Quay lại đăng nhập</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* ================= FORM ================= */}
                <div className="mb-6 text-center">
                  <h1 className="text-2xl font-bold">
                    Quên mật khẩu
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Nhập email đã đăng ký để nhận link reset mật khẩu
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <Message error={error} />

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

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-2xl py-6 font-bold shadow-button transition-all hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi email'}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Đã nhớ tài khoản?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
