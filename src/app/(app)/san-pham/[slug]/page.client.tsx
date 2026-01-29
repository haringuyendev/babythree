'use client'

import { useMemo, useState } from 'react'
import type { Media, Product } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichText } from '@/components/RichText'
import { ChevronLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { ProductCard } from '@/components/Product/ProductCard'
import { toast } from 'sonner'
import { useCart } from '@/hooks/useCart'

type SelectedOptions = Record<
  string,
  {
    id: string
    label: string
  }
>

export default function ProductDetailClient({ product }: { product: Product }) {
  /* ================= DATA ================= */

  const gallery =
    product.gallery?.filter((g) => typeof g.image === 'object').map((g) => g.image as Media) || []

  const variants = (product.variants as any)?.docs || []
  const { addToCart, loading } = useCart()
  /* ================= STATE ================= */
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // { color: "Red", size: "M" }
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  const isOptionSelectedComplete = useMemo(() => {
    if (!product.options?.length) return true
    return product.options.every((opt: any) => selectedOptions[opt.key])
  }, [product.options, selectedOptions])

  /* ================= RESOLVE VARIANT ================= */
  const selectedVariant = useMemo(() => {
    if (!variants.length) return null
    if (!isOptionSelectedComplete) return null

    return (
      variants.find((v: any) => {
        const opts = v.options || {}
        return Object.entries(selectedOptions).every(([key, value]) => opts[key] === value.id)
      }) || null
    )
  }, [variants, selectedOptions, isOptionSelectedComplete])

  /* ================= ADD TO CART ================= */
  const onAddToCart = async () => {
    if (variants.length > 0) {
      if (!isOptionSelectedComplete) {
        toast.error('Vui lòng chọn đầy đủ phân loại sản phẩm')
        return
      }

      if (!selectedVariant) {
        toast.error('Phiên bản sản phẩm không tồn tại')
        return
      }
    }

    await addToCart({
      product: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        gallery: product.gallery,
        options: product.options,
      },
      variant: selectedVariant
        ? {
            id: selectedVariant.id,
            options: selectedVariant.options,
          }
        : undefined,
      price: selectedVariant?.price ?? product.price,
      quantity,
    })
  }

  /* ================= UI ================= */
  return (
    <div className="container py-8">
      {/* Back */}
      <Button asChild variant="ghost" className="mb-4 -ml-3">
        <Link href="/san-pham">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Quay lại
        </Link>
      </Button>

      {/* ================= MAIN ================= */}
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
                className={`aspect-square w-20 rounded-xl border-2 ${
                  selectedImage === i ? 'border-primary' : 'border-transparent opacity-60'
                }`}
              >
                <Image src={img.url || ''} alt="" width={80} height={80} />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- INFO ---------- */}
        <div className="space-y-6">
          <p className="text-sm font-medium text-primary">
            {(product.categories?.[0] as any)?.title}
          </p>

          <h1 className="text-3xl font-bold">{product.title}</h1>

          {/* Rating (mock) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">4.7 (10 đánh giá)</span>
          </div>

          {/* PRICE */}
          <p className="text-2xl font-bold text-primary">
            {(selectedVariant?.price || product.price)?.toLocaleString('vi-VN')}₫
          </p>

          {/* EXCERPT */}
          {product.excerpt && <p className="text-muted-foreground">{product.excerpt}</p>}

          {/* ================= OPTIONS ================= */}
          {product.options?.map((opt: any) => (
            <div key={opt.key} className="space-y-2">
              <p className="font-semibold">
                {opt.label}:{' '}
                <span className="text-primary">
                  {selectedOptions[opt.key]?.label || 'Chưa chọn'}
                </span>
              </p>

              <div className="flex flex-wrap gap-2">
                {opt.values.map((v: any) => {
                  const active = selectedOptions[opt.key]?.id === v.id

                  return (
                    <button
                      key={v.id}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [opt.key]: {
                            id: v.id,
                            label: v.label,
                          },
                        }))
                      }
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-medium ${
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {v.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* ================= QUANTITY + CART ================= */}
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

            <Button className="flex-1 rounded-2xl" onClick={onAddToCart} disabled={loading}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {loading ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </Button>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      {product.contentTabs?.length ? (
        <div className="mt-12">
          <Tabs defaultValue={product.contentTabs[0].id || undefined}>
            <TabsList
              className={`h-auto w-full grid grid-cols-${product.contentTabs.length} gap-1 sm:gap-2 rounded-2xl bg-muted p-1 sm:p-2`}
            >
              {product.contentTabs.map((tab: any) => (
                <TabsTrigger
                  className="rounded-xl px-2 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-soft"
                  key={tab.id}
                  value={tab.id}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {product.contentTabs.map((tab: any) => (
              <TabsContent
                className="mt-6 rounded-2xl bg-card p-6 shadow-soft"
                key={tab.id}
                value={tab.id}
              >
                <RichText data={tab.content} enableGutter={false} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : null}
      {/* ================= REVIEWS ================= */}
      <div className="mt-12">
        <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-bold lg:text-2xl">Đánh giá từ khách hàng</h2>

          <div className="space-y-4">
            {[
              {
                name: 'Nguyễn Thị Mai',
                rating: 5,
                comment: 'Sản phẩm rất tốt, bé nhà mình rất thích!',
                date: '2 ngày trước',
              },
              {
                name: 'Trần Văn Hùng',
                rating: 4,
                comment: 'Chất lượng tốt, giao hàng nhanh.',
                date: '1 tuần trước',
              },
              {
                name: 'Lê Thị Hoa',
                rating: 5,
                comment: 'Đóng gói cẩn thận, sản phẩm đúng mô tả.',
                date: '2 tuần trước',
              },
            ].map((review, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>

                <div className="my-1 flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
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

      {/* ================= RELATED ================= */}
      {product.relatedProducts?.length ? (
        <div className="mt-12">
          <h2 className="text-lg font-bold lg:text-2xl">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {(product.relatedProducts as any).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
