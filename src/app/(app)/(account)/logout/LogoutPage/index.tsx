'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, LogOut, AlertCircle } from 'lucide-react'

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth()
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading')

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }

    void performLogout()
  }, [logout])

  return (
    <div className="min-h-screen bg-linear-to-br from-baby-mint-light via-background to-baby-pink-light">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-card p-8 shadow-card text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              {status === 'loading' && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <LogOut className="h-6 w-6 animate-pulse text-muted-foreground" />
                </div>
              )}

              {status === 'success' && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
              )}

              {status === 'error' && (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-7 w-7 text-destructive" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground">
              {status === 'loading' && 'Đang đăng xuất...'}
              {status === 'success' && 'Đăng xuất thành công'}
              {status === 'error' && 'Bạn đã đăng xuất trước đó'}
            </h1>

            {/* Description */}
            <p className="mt-3 text-muted-foreground">
              {status === 'loading' &&
                'Vui lòng chờ trong giây lát.'}

              {status === 'success' &&
                'Bạn đã đăng xuất khỏi tài khoản BabyThree.'}

              {status === 'error' &&
                'Phiên đăng nhập của bạn đã kết thúc.'}
            </p>

            {/* Actions */}
            {status !== 'loading' && (
              <div className="mt-8 grid gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl font-bold shadow-button"
                >
                  <Link href="/">
                    Về trang chủ
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-2xl"
                >
                  <Link href="/san-pham">
                    Tiếp tục mua sắm
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-2xl"
                >
                  <Link href="/login">
                    Đăng nhập lại
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
