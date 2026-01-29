'use client'

import Link from 'next/link'
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  ArrowLeft,
  Copy,
  RotateCcw,
  MessageCircle,
  FileText,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { formatPrice } from '@/lib/format'
import { formatDateTime } from '@/utilities/formatDateTime'

import { toast } from 'sonner'
import { OrderDetailView } from '@/utilities/oders'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const getStatusConfig = (status: string) => {
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
      return { label: status, color: 'bg-muted text-muted-foreground', icon: Clock }
  }
}

type Props = {
  order: OrderDetailView
}

export default function OrderDetailClient({ order }: Props) {
  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon
  const router=useRouter()
  const copyOrderCode = () => {
    navigator.clipboard.writeText(order.id)
    toast.success('Đã sao chép mã đơn hàng')
  }

  return (
    <div className="container py-6 md:py-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/account">Tài khoản</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Đơn hàng #{order.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Đơn hàng #{order.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              Đặt lúc {formatDateTime({ date: order.createdAt })}
            </p>
          </div>
        </div>

        <Badge className={statusConfig.color}>
          <StatusIcon className="h-3.5 w-3.5 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {order.timeline.map((step, i) => (
                <div key={i} className="flex gap-4 pb-6 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    {step.description && (
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime({ date: step.time })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm đã đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        {item.variant}
                      </p>
                    )}
                    <p className="text-sm">
                      SL: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><User className="inline h-4 w-4 mr-2" />{order.shipping.name}</p>
              <p><Phone className="inline h-4 w-4 mr-2" />{order.shipping.phone}</p>
              <p><MapPin className="inline h-4 w-4 mr-2" />{order.shipping.address}</p>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span>{formatPrice(order.shipping.fee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <RotateCcw className="h-4 w-4 mr-2" />
                Đặt lại đơn hàng
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={copyOrderCode}>
                <Copy className="h-4 w-4 mr-2" />
                Sao chép mã đơn
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={()=>router.push('/lien-he')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Liên hệ hỗ trợ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
