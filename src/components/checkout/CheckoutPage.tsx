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
import { toast } from 'sonner'
import Link from 'next/link'
import { formatPrice } from '@/lib/format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { useAddress } from '@/hooks/useAddress'

/* ================= HELPERS ================= */

function resolveShippingZone(zones: any[], provinceName: string) {
  if (!provinceName) return null

  return (
    zones.find((zone) =>
      zone.provinces?.some(
        (p: any) =>
          p.name.toLowerCase() === provinceName.toLowerCase(),
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
  const { cart, totalPrice, isFetching } = useCart()
  const { defaultAddress } = useAddress()

  const isInitialized = useRef(false)

  /* ================= FORM ================= */

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine: '',
    district: '',
    city: '',
    note: '',
  })

  /* ================= INIT FROM DEFAULT ADDRESS ================= */

  useEffect(() => {
    if (!defaultAddress || isInitialized.current) return

    setForm({
      customerName: defaultAddress.fullName ?? '',
      customerEmail: defaultAddress.email ?? '',
      customerPhone: defaultAddress.phone ?? '',
      addressLine: defaultAddress.addressLine ?? '',
      district: defaultAddress.district ?? '',
      city: defaultAddress.city ?? '',
      note: '',
    })

    isInitialized.current = true
  }, [defaultAddress])

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

    try {
      await checkoutAction({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        paymentMethod: 'cod',
        shipping: {
          fullName: form.customerName,
          phone: form.customerPhone,
          addressLine: form.addressLine,
          district: form.district,
          city: form.city,
          zoneName: shippingZone?.name ?? '',
        },
      })

      toast.success('Đặt hàng thành công')
      router.push('/orders')
    } catch (err: any) {
      toast.error(err.message || 'Không thể đặt hàng')
    }
  }

  if (!isFetching && !cart?.items?.length) {
    router.push('/cart')
    return null
  }

  /* ================= UI ================= */

  return (
    <div className="container py-8">
      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* CONTACT */}
          <div className="rounded-2xl bg-card p-6">
            <h2 className="font-bold mb-4">Thông tin liên hệ</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Họ và tên"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
              <Input
                placeholder="Số điện thoại"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                value={form.customerEmail}
                className="sm:col-span-2"
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
                className="sm:col-span-2"
                value={form.addressLine}
                onChange={(e) =>
                  setForm({ ...form, addressLine: e.target.value })
                }
              />

              <Input
                placeholder="Quận / Huyện"
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
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="rounded-2xl bg-card p-6 space-y-4">
          <h2 className="font-bold">Đơn hàng</h2>

          {cart.items.map((item: any) => (
            <div key={item.id} className="flex gap-3">
              <Image
                src={item.product.gallery?.[0]?.image?.url}
                alt={item.product.title}
                width={64}
                height={64}
                className="rounded-xl"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.product.title}</p>
                <p className="text-primary">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span>{formatPrice(shippingFee)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Tổng</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button size="lg" className="w-full">
            Xác nhận đặt hàng
          </Button>
        </div>
      </form>
    </div>
  )
}
