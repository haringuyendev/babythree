'use client'

import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function ThankYouPage() {

  return (
    <div className="min-h-screen bg-linear-to-br from-baby-mint-light via-background to-baby-pink-light">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-card p-8 shadow-card text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-7 w-7 text-primary" />
                </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground">
              {'Bạn đã tạo đơn hàng thành công! '}
            </h1>

            {/* Description */}
            <p className="mt-3 text-muted-foreground">
              Nhân viên của chúng tôi sẽ liên hệ để xác nhận đơn hàng!
            </p>

            {/* Actions */}
            { (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
