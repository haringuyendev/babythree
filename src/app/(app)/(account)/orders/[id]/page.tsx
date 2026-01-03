import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  Copy,
} from 'lucide-react'

import { Price } from '@/components/Price'
import { OrderStatus } from '@/components/OrderStatus'
import { ProductItem } from '@/components/ProductItem'
import { AddressItem } from '@/components/addresses/AddressItem'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string }>
}

/* ---------------- status config ---------------- */
const getStatusConfig = (status?: Order['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    case 'confirmed':
      return { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 }
    case 'shipping':
      return { label: 'Đang giao', color: 'bg-purple-100 text-purple-800', icon: Truck }
    case 'delivered':
      return { label: 'Đã giao', color: 'bg-green-100 text-green-800', icon: CheckCircle2 }
    case 'cancelled':
      return { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: Clock }
    default:
      return { label: status ?? 'Không xác định', color: 'bg-muted', icon: Clock }
  }
}

export default async function OrderDetail({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const { email = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      depth: 2,
      overrideAccess: !Boolean(user),
      where: {
        and: [
          { id: { equals: id } },
          ...(user ? [{ customer: { equals: user.id } }] : []),
          ...(email ? [{ customerEmail: { equals: email } }] : []),
        ],
      },
    })

    const canAccess =
      (user &&
        orderResult &&
        (typeof orderResult.customer === 'object'
          ? orderResult.customer.id
          : orderResult.customer) === user.id) ||
      (!user &&
        email &&
        orderResult?.customerEmail === email)

    if (canAccess) order = orderResult
  } catch (err) {
    console.error(err)
  }

  if (!order) notFound()

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className="container py-6 md:py-8 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Đơn hàng #{order.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              Đặt lúc{' '}
              {formatDateTime({ date: order.createdAt, format: 'dd/MM/yyyy HH:mm' })}
            </p>
          </div>
        </div>

        <Badge className={`${statusConfig.color}`}>
          <StatusIcon className="h-3.5 w-3.5 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.items?.map((item) => {
                if (!item.product || typeof item.product !== 'object') return null

                const variant =
                  item.variant && typeof item.variant === 'object'
                    ? item.variant
                    : undefined

                return (
                  <ProductItem
                    key={item.id}
                    product={item.product}
                    quantity={item.quantity}
                    variant={variant}
                  />
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">
          {/* Shipping */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* @ts-expect-error */}
                <AddressItem address={order.shippingAddress} hideActions />
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {order.paymentMethod === 'COD'
                    ? 'Thanh toán khi nhận hàng'
                    : 'Chuyển khoản'}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng cộng</span>
                {order.amount && (
                  <Price amount={order.amount} className="font-semibold" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Mua lại đơn hàng
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Sao chép mã đơn
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Đơn hàng #${id}`,
    description: `Chi tiết đơn hàng ${id}`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
  }
}
