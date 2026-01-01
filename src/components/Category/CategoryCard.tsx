// components/products/CategoryCard.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/payload-types'
import Image from 'next/image'

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { title, slug, image, productCount } = category;

  return (
    <Link
      href={`/products?category=${slug}`}
      className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card bg-baby-pink-light hover:bg-baby-pink"
    >
      {/* Image */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background/50 p-2">
        <Image
          src={typeof image === 'object' && (image as unknown as { url?: string })?.url ? (image as unknown as { url?: string }).url as string : ''}
          alt={typeof category.title === 'string' ? category.title : 'Category'}
          width={64}
          height={64}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{productCount} sản phẩm</p>
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  )
}
