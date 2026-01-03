'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/useCart'

const formatPrice = (v: number) => v.toLocaleString('vi-VN') + '₫'

function resolveVariantOptions(
    productOptions: any[],
    variantOptions: Record<string, string>,
) {
    return Object.entries(variantOptions).map(([key, valueId]) => {
        const opt = productOptions.find((o) => o.key === key)
        const val = opt?.values.find((v: any) => v.id === valueId)

        return {
            key,
            optionLabel: opt?.label ?? key,
            valueLabel: val?.label ?? valueId,
        }
    })
}

export default function CartPage() {
    const {
        cart,
        loading,
        totalPrice,
        totalQuantity,
        updateQuantity,
        removeItem,
    } = useCart()

    const items = cart?.items || []
    console.log(items)
    /* ================= EMPTY ================= */
    if (!loading && items.length === 0) {
        return (
            <div className="container py-16">
                <div className="mx-auto max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Giỏ hàng trống</h1>
                    <p className="mb-6 text-muted-foreground">
                        Bạn chưa có sản phẩm nào trong giỏ hàng
                    </p>
                    <Button asChild className="rounded-2xl px-8 py-6 font-bold">
                        <Link href="/san-pham">
                            Tiếp tục mua sắm
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    /* ================= SUMMARY ================= */
    const shipping = totalPrice >= 500_000 ? 0 : 30_000
    const total = totalPrice + shipping

    return (
        <div className="container py-8">
            <h1 className="mb-8 text-2xl font-bold md:text-3xl">
                Giỏ hàng ({totalQuantity} sản phẩm)
            </h1>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* ================= ITEMS ================= */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item: any) => {
                        const product = item.product
                        const variant = item.variant

                        const image =
                            product?.gallery?.[0]?.image?.url || '/placeholder.png'

                        const resolvedOptions = resolveVariantOptions(
                            product?.options || [],
                            variant?.options || {},
                        )

                        return (
                            <div
                                key={
                                    variant?.id
                                        ? `${product.id}-${variant.id}`
                                        : product.id
                                }
                                className="rounded-2xl bg-card p-4 shadow-soft"
                            >
                                <div className="flex gap-4">
                                    {/* IMAGE */}
                                    <Link
                                        href={`/san-pham/${product.slug}`}
                                        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
                                    >
                                        <Image
                                            src={image}
                                            alt={product.title}
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover"
                                        />
                                    </Link>

                                    {/* INFO */}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <Link
                                                href={`/san-pham/${product.slug}`}
                                                className="font-semibold hover:text-primary line-clamp-2"
                                            >
                                                {product.title}
                                            </Link>

                                            {/* OPTIONS */}
                                            {resolvedOptions.length > 0 && (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {resolvedOptions.map((opt) => (
                                                        <span key={opt.key} className="mr-2">
                                                            {opt.optionLabel}: {opt.valueLabel}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-2 flex items-center justify-between">
                                                {/* QTY */}
                                                <div className="flex items-center rounded-xl border">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                {
                                                                    productId: product.id,
                                                                    variantId: variant?.id,
                                                                    quantity: Math.max(1, item.quantity - 1),
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>

                                                    <span className="w-8 text-center font-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            updateQuantity({
                                                                productId: product.id,
                                                                variantId: variant?.id,
                                                                quantity: item.quantity + 1,
                                                            })
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>

                                                <p className="font-bold text-primary">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* REMOVE */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="self-end text-muted-foreground hover:text-destructive"
                                            onClick={() => removeItem({
                                                productId: product.id,
                                                variantId: variant?.id,
                                            })}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/san-pham">← Tiếp tục mua sắm</Link>
                    </Button>
                </div>

                {/* ================= SUMMARY ================= */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6 rounded-2xl bg-card p-6 shadow-soft">
                        <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>

                        {/* COUPON (mock) */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Mã giảm giá</p>
                            <div className="flex gap-2">
                                <Input placeholder="Nhập mã" />
                                <Button className="rounded-xl px-4">Áp dụng</Button>
                            </div>
                        </div>

                        {/* PRICE */}
                        <div className="space-y-3 border-t pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tạm tính</span>
                                <span className="font-semibold">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vận chuyển</span>
                                <span className="font-semibold">
                                    {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                                </span>
                            </div>

                            {shipping === 0 ? (
                                <p className="text-xs text-green-600">
                                    🎉 Miễn phí vận chuyển!
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Mua thêm {formatPrice(500_000 - totalPrice)} để miễn phí ship
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between border-t pt-4">
                            <span className="text-lg font-bold">Tổng cộng</span>
                            <span className="text-xl font-bold text-primary">
                                {formatPrice(total)}
                            </span>
                        </div>

                        <Button asChild size="lg" className="w-full rounded-2xl py-6 font-bold">
                            <Link href="/checkout">
                                Tiến hành thanh toán
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
