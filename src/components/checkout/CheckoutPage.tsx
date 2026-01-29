'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, CreditCard, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { checkoutAction } from '@/actions/checkout'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { useAddress } from '@/hooks/useAddress'

/* ================= HELPERS ================= */

function resolveShippingZone(zones: any[], provinceName: string) {
  if (!provinceName) return null

  return (
    zones.find((zone) =>
      zone.provinces?.some(
        (p: any) => p.name.toLowerCase() === provinceName.toLowerCase(),
      ),
    ) ||
    zones.find((z) => z.isDefault) ||
    null
  )
}

/* ================= COMPONENT ================= */

export default function CheckoutPage({
  shippingZones,
  provinces,
}: {
  shippingZones: any[]
  provinces: { id: string; name: string }[]
}) {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, totalPrice, isFetching, clear } = useCart()
  const { defaultAddress } = useAddress()

  const isInitialized = useRef(false)

  const [paymentMethod, setPaymentMethod] =
    useState<'cod' | 'bank'>('cod')

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine: '',
    district: '',
    city: '',
    note: '',
  })

  /* ===== INIT FROM DEFAULT ADDRESS (USER ONLY) ===== */
  useEffect(() => {
    if (!user || !defaultAddress || isInitialized.current) return

    setForm((prev) => ({
      ...prev,
      customerName: defaultAddress.fullName ?? '',
      customerEmail: defaultAddress.email ?? '',
      customerPhone: defaultAddress.phone ?? '',
      addressLine: defaultAddress.addressLine ?? '',
      district: defaultAddress.district ?? '',
      city: defaultAddress.city ?? '',
    }))

    isInitialized.current = true
  }, [user, defaultAddress])

  /* ================= DERIVED ================= */

  const shippingZone = useMemo(
    () => resolveShippingZone(shippingZones, form.city),
    [shippingZones, form.city],
  )

  const shippingFee = shippingZone?.fee ?? 100_000
  const total = totalPrice + shippingFee

  /* ================= SUBMIT ================= */

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!cart?.items?.length) {
      toast.error('Giỏ hàng trống')
      return
    }

    if (!cart.items.length) {
      toast.error('Giỏ hàng trống')
      return
    }

    if (!form.customerName || !form.customerPhone || !form.addressLine || !form.city) {
      toast.error('Vui lòng nhập đầy đủ thông tin')
      return
    }

    setLoading(true)

    try {
      const res = await checkoutAction({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,

        items: cart.items.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.title,
          variantName: item.variant?.title,
          variantSku: item.variant?.sku,
          price: item.price,
          quantity: item.quantity,
          image: item.product.gallery?.[0]?.image?.id ?? null,
        })),

        shipping: {
          zoneName: shippingZone?.name ?? '',
          shippingFee,
          fullName: form.customerName,
          phone: form.customerPhone,
          addressLine: form.addressLine,
          district: form.district,
          city: form.city,
        },

        paymentMethod,
      })

      if (res?.success) {
        toast.success('Đặt hàng thành công')
        await clear()

        router.push(user ? '/account' : '/thank-you')
      }
    } catch (err: any) {
      toast.error(err.message || 'Không thể đặt hàng')
    } finally {
      setLoading(false)
    }
  }

  if (!isFetching && !cart?.items?.length) {
    router.push('/cart')
    return null
  }

  /* ================= UI ================= */

  return (
    <div className="container py-8">
      {/* BACK */}
      <Button
        asChild
        variant="ghost"
        className="-ml-3 mb-6 rounded-xl text-muted-foreground hover:text-foreground"
      >
        <Link href="/cart">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Quay lại giỏ hàng
        </Link>
      </Button>

      <h1 className="mb-8 text-2xl font-bold md:text-3xl">
        Thanh toán
      </h1>

      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* CONTACT */}
          <div className="rounded-2xl bg-card p-6">
            <h2 className="font-bold mb-4">Thông tin liên hệ</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Họ và tên"
                required
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
              <Input
                placeholder="Số điện thoại"
                required
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                type="email"
                className="sm:col-span-2"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="rounded-2xl bg-card p-6">
            <h2 className="font-bold mb-4">Địa chỉ giao hàng</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Địa chỉ"
                required
                className="sm:col-span-2"
                value={form.addressLine}
                onChange={(e) =>
                  setForm({ ...form, addressLine: e.target.value })
                }
              />
              <Input
                placeholder="Quận / Huyện"
                required
                value={form.district}
                onChange={(e) =>
                  setForm({ ...form, district: e.target.value })
                }
              />
              <Select
                value={form.city}
                onValueChange={(value) =>
                  setForm({ ...form, city: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh / thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Ghi chú"
                className="sm:col-span-2"
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="rounded-2xl bg-card p-6">
            <h2 className="font-bold mb-4">Thanh toán</h2>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) =>
                setPaymentMethod(v as 'cod' | 'bank')
              }
              className="space-y-3"
            >
              <label className="flex gap-3 border p-4 rounded-xl cursor-pointer">
                <RadioGroupItem value="cod" />
                <Truck /> COD
              </label>

              <label className="flex gap-3 border p-4 rounded-xl cursor-pointer">
                <RadioGroupItem value="bank" />
                <CreditCard /> Chuyển khoản
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky top-24 rounded-2xl bg-card p-6 space-y-4">
          <h2 className="font-bold">Đơn hàng</h2>

          {cart.items.map((item: any, idx: number) => {
            const image = item.product?.gallery?.[0]?.image?.url

            return (
              <div key={idx} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0">
                  {image && (
                    <Image
                      src={image}
                      alt={item.product.title}
                      width={64}
                      height={64}
                      className="rounded-xl object-cover"
                    />
                  )}
                  <Badge className="absolute -right-2 -top-2">
                    {item.quantity}
                  </Badge>
                </div>

                <div className="flex-1">
                  <p className="font-semibold">
                    {item.product.title}
                  </p>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground">
                      {item.variant.title || item.variant.sku}
                    </p>
                  )}
                  <p className="text-primary font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            )
          })}

          <div className="flex justify-between text-sm">
            <span>Vận chuyển</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Tổng</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button
            disabled={loading}
            size="lg"
            className="w-full rounded-xl"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </Button>
        </div>
      </form>
    </div>
  )
}
