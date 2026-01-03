// components/blocks/ProductGrid.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/payload-types'
import { ProductCard } from '@/components/Product/ProductCard'

type ProductGridBlockProps = {
  title: string
  subtitle?: string
  mode: 'manual' | 'auto'
  products?: Product[]
  autoConfig?: {
    filter: 'best' | 'new' | 'sale'
    limit?: number
  }
  viewAll?: {
    label?: string
    url?: string
  }
}

export async function ProductGrid({
  title,
  subtitle,
  mode,
  products = [],
  autoConfig,
  viewAll,
}: ProductGridBlockProps) {
  let resolvedProducts: Product[] = []

  if (mode === 'manual') {
    resolvedProducts = products
  }

  if (mode === 'auto' && autoConfig) {
    const { filter, limit = 4 } = autoConfig

    const params = new URLSearchParams()
    params.set('limit', String(limit))

    if (filter === 'sale') params.set('sale', 'true')
    if (filter === 'new') params.set('sort', '-createdAt')
    if (filter === 'best') params.set('sort', '-rating')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?${params.toString()}`,
      { cache: 'no-store' },
    )

    const data = await res.json()
    resolvedProducts = data?.docs || []
  }
  if (!resolvedProducts.length) return null
  console.log(resolvedProducts, products)
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {viewAll?.url && (
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-xl font-semibold text-primary hover:bg-primary/10 sm:flex"
            >
              <Link href={viewAll.url}>
                {viewAll.label || 'Xem tất cả'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resolvedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        {viewAll?.url && (
          <div className="mt-6 flex justify-center sm:hidden">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={viewAll.url}>
                {viewAll.label || 'Xem tất cả'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
