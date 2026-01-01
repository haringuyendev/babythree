'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { useState } from 'react'

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function FilterSidebar({ categories }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 1500000])

  const toggleParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    const current = params.get(key)
    const values = current ? current.split(',') : []

    const nextValues = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value]

    if (nextValues.length === 0) {
      params.delete(key)
    } else {
      params.set(key, nextValues.join(','))
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }
const selectedCategories =
  searchParams.get('category')?.split(',') ?? []

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-bold">Danh mục</h3>

      {categories?.map((cat: any) => (
        <div key={cat?.id} className="flex items-center gap-2">
          <Checkbox onCheckedChange={() => toggleParam('category', cat?.slug)} checked={selectedCategories.includes(cat?.slug)} />
          <Label className="text-primary">{cat?.title}</Label>
        </div>
      ))}

      <div className="space-y-3">
        <h3 className="font-bold text-foreground">Giá</h3>
        <Slider
          value={priceRange}
          onValueChange={(value) => {
            setPriceRange(value)
            router.push(`?minPrice=${value[0]}&maxPrice=${value[1]}`)
          }}
          max={1500000}
          step={50000}
          className="py-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push('/san-pham')}
      >
        Xóa bộ lọc
      </Button>
    </div>
  )
}
