// components/blocks/CategoryGrid.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/Category/CategoryCard'
import type { Category } from '@/payload-types'

export function CategoryGrid({
  title,
  subtitle,
  categories,
  viewAll,
}: {
  title: string
  subtitle?: string
  categories: Category[]
  viewAll?: {
    label?: string
    url?: string
  }
}) {
  if (!categories?.length) return null

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
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
