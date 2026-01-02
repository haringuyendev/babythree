'use client'

import { useState } from 'react'
import type { Media, Product } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichText } from '@/components/RichText'
import {
    ChevronLeft,
    Minus,
    Plus,
    ShoppingCart,
    Star,
} from 'lucide-react'
import { ProductCard } from '@/components/Product/ProductCard'

export default function ProductDetailClient({ product }: { product: Product }) {
    const gallery =
        product.gallery
            ?.filter((g) => typeof g.image === 'object')
            .map((g) => g.image as Media) || []

    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    return (
        <div className="container py-8">
            {/* Back */}
            <Button asChild variant="ghost" className="mb-4 -ml-3">
                <Link href="/san-pham">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Quay lại
                </Link>
            </Button>

            {/* ================= LAYOUT MỚI ================= */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* ---------- GALLERY ---------- */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
                        {gallery[selectedImage] && (
                            <Image
                                src={gallery[selectedImage].url || ''}
                                alt={product.title}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>

                    <div className="flex gap-3">
                        {gallery.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`aspect-square w-20 rounded-xl border-2 ${selectedImage === i
                                    ? 'border-primary'
                                    : 'border-transparent opacity-60'
                                    }`}
                            >
                                <Image src={img.url || ''} alt="" width={80} height={80} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ---------- INFO ---------- */}
                <div className="space-y-6">
                    <p className="text-sm font-medium text-primary">{(product.categories?.[0] as any)?.title}</p>
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(4.7)
                                        ? 'fill-baby-yellow text-baby-yellow'
                                        : 'text-muted'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                            4.7 (10 đánh giá)
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                        {product.priceInvnd?.toLocaleString('vi-VN')}₫
                    </p>

                    {product.ageRange && typeof product.ageRange === 'object' && (
                        <div className="inline-block rounded-xl bg-primary/10 px-4 py-2 text-sm">
                            Độ tuổi: {product.ageRange.title}
                        </div>
                    )}

                    {product.excerpt && (
                        <p className="text-muted-foreground">{product.excerpt}</p>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Minus />
                        </Button>
                        <span className="w-8 text-center font-semibold">{quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                            <Plus />
                        </Button>

                        <Button className="flex-1 rounded-2xl">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Thêm vào giỏ
                        </Button>
                    </div>

                    {/* Features */}
                    {product.features?.length ? (
                        <div className="grid gap-3 sm:grid-cols-3">
                            {product.features.map((f: any, i: number) => {
                                return (
                                    <div key={i} className="flex gap-3 rounded-xl bg-muted/50 p-4">
                                        {f?.icon && <Image src={f.icon.url || ''} alt="" width={24} height={24} className='w-8 h-8' />}
                                        <div>
                                            <p className="text-xs font-semibold">{f.title}</p>
                                            <p className="text-xs text-muted-foreground">{f.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* ================= TABS ================= */}
            {product.contentTabs?.length ? (
                <div className="mt-12">
                    <Tabs defaultValue={product.contentTabs[0].id || undefined} className="w-full">
                        <TabsList className={`h-auto w-full grid grid-cols-${product.contentTabs.length} gap-1 sm:gap-2 rounded-2xl bg-muted p-1 sm:p-2`}>
                            {product.contentTabs.map((tab: any) => (
                                <TabsTrigger key={tab.id} value={tab.id} className="rounded-xl px-2 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-soft">
                                    {tab.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {product.contentTabs.map((tab: any) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
                                {tab.type === 'content' && <RichText data={tab.content} enableGutter={false} />}
                                {tab.type === 'policy' && <RichText data={tab.policy} enableGutter={false} />}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            ) : null}

            <div className="mt-12">
                <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
                    <h2 className="mb-4 lg:text-2xl text-lg font-bold">Đánh giá từ khách hàng</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Nguyễn Thị Mai', rating: 5, comment: 'Sản phẩm rất tốt, bé nhà mình rất thích!', date: '2 ngày trước' },
                            { name: 'Trần Văn Hùng', rating: 4, comment: 'Chất lượng tốt, giao hàng nhanh.', date: '1 tuần trước' },
                            { name: 'Lê Thị Hoa', rating: 5, comment: 'Đóng gói cẩn thận, sản phẩm đúng mô tả.', date: '2 tuần trước' },
                        ].map((review, i) => (
                            <div key={i} className="border-b border-border pb-4 last:border-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-foreground">{review.name}</span>
                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                </div>
                                <div className="my-1 flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? 'fill-baby-yellow text-baby-yellow' : 'text-muted'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= SIMILAR PRODUCTS ================= */}
            <div className="mt-12">
                <h2 className="lg:text-2xl text-lg font-bold">Sản phẩm liên quan</h2>
                {product.relatedProducts?.length ? (
                    <div
                        className={`grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4`}
                    >
                        {(product.relatedProducts as any)?.map((item: any) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl bg-card p-16 text-center shadow-soft">
                        <p className="mt-4 text-muted-foreground">
                            Chưa có sản phẩm liên quan
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
