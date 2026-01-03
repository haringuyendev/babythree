// components/products/ProductCard.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/payload-types'
import { useRouter } from 'next/navigation'

type ProductCardProps = {
  product: Product
}
export const resolveProductPrice = (product: any) => {
  const variants = product?.variants?.docs || []
  if (!variants.length) {
    return {
      min: product.price,
      max: product.price,
      hasVariant: false,
    }
  }

  const prices = variants
    .filter((v: any) => v.isActive)
    .map((v: any) => v.price)

  if (!prices.length) {
    return {
      min: product.price,
      max: product.price,
      hasVariant: false,
    }
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    hasVariant: true,
  }
}
export function ProductCard({ product }: ProductCardProps) {
  const {
    title,
    slug,
    price,
    salePrice,
    gallery,
    rating,
    categories,
    reviewsCount,
    badge,
    ageRange,
  } = product as any
  const router=useRouter()
  const category = categories?.[0]?.title || 'Đồ cho bé';
  const image = gallery?.[0]?.image
  const discount = salePrice && price ? Math.round((1 - salePrice / price) * 100) : 0
  const { min, max } = resolveProductPrice(product)

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card p-3 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Image */}
      <Link
        href={`/san-pham/${slug}`}
        className="relative block overflow-hidden rounded-xl"
      >
        <div className="aspect-square overflow-hidden rounded-xl bg-muted">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || title}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {badge === 'sale' && discount > 0 && (
            <Badge className="rounded-lg bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
          {badge === 'new' && (
            <Badge className="rounded-lg bg-success px-2 py-1 text-xs font-bold">
              Mới
            </Badge>
          )}
          {badge === 'hot' && (
            <Badge className="rounded-lg bg-warning px-2 py-1 text-xs font-bold">
              Hot
            </Badge>
          )}
        </div>

        {/* Quick action */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/90 shadow-soft backdrop-blur-sm hover:bg-background"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      {/* Content */}
      <div className="mt-3 space-y-2">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{category}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-muted-foreground">
              {rating || 0} ({reviewsCount || 0})
            </span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/san-pham/${slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-foreground transition-colors hover:text-primary">
            {title}
          </h3>
        </Link>

        {/* Age range (placeholder) */}
        {ageRange && <p className="text-xs text-muted-foreground">Phù hợp: {ageRange.minAge}–{ageRange.maxAge} tuổi</p>}

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="font-bold text-primary">
              {min === max
                ? `${min?.toLocaleString('vi-VN')??''}₫`
                : `Từ ${min?.toLocaleString('vi-VN')??''}₫`}
            </p>
          </div>

          <Button
            size="sm"
            className="h-9 rounded-xl bg-primary px-3 shadow-button transition-all hover:scale-105"
            onClick={() => {
              router.push(`/san-pham/${slug}`)
            }}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Thêm</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
