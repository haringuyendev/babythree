'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type FormData = {
  password: string
  passwordConfirm: string
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.passwordConfirm) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
        }),
      },
    )

    if (res.ok) {
      setSuccess(true)
    } else {
      setError('Link reset đã hết hạn hoặc không hợp lệ')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="max-w-md text-center space-y-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-2xl font-bold text-green-600">
            Đặt lại mật khẩu thành công
          </h1>
          <p className="text-muted-foreground">
            Bạn có thể đăng nhập bằng mật khẩu mới.
          </p>

          <Button asChild className="rounded-xl">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-20 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-3xl bg-card p-8 shadow-card space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Đặt lại mật khẩu
        </h1>

        {error && (
          <p className="text-sm text-destructive text-center">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label>Mật khẩu mới</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              className="pl-11 h-12 rounded-xl"
              {...register('password', {
                required: 'Bắt buộc',
                minLength: { value: 6, message: 'Ít nhất 6 ký tự' },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Xác nhận mật khẩu</Label>
          <Input
            type="password"
            className="h-12 rounded-xl"
            {...register('passwordConfirm', {
              required: 'Bắt buộc',
            })}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-2xl py-6 font-bold"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </Button>
      </form>
    </div>
  )
}
