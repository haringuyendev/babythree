'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/components/Product/ProductCard'
import FilterSideBar from './FilterSideBar'

type Props = {
    products: any[]
    total: number
    categories: any[]
}

export default function ShopClient({ products, total, categories }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [gridCols, setGridCols] = useState<3 | 4>(4)

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="bg-muted/30 py-8">
            <div className="container">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Tất cả sản phẩm</h1>
                    <p className="text-muted-foreground">{total} sản phẩm</p>
                </div>

                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <aside className="hidden w-64 shrink-0 lg:block">
                        <div className="sticky top-24 rounded-2xl bg-card p-6 shadow-soft">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                                <SlidersHorizontal className="h-5 w-5" />
                                Bộ lọc
                            </h2>
                            <FilterSideBar categories={categories}/>
                        </div>
                    </aside>


                    {/* Main */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="mb-6 flex items-center justify-between rounded-xl bg-card p-4 shadow-soft">
                            <div className="flex items-center gap-3">
                                {/* Mobile filter */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="lg:hidden">
                                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                                            Bộ lọc
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left">
                                        <SheetHeader>
                                            <SheetTitle>Bộ lọc</SheetTitle>
                                        </SheetHeader>
                                        <FilterSideBar categories={categories}/>
                                    </SheetContent>
                                </Sheet>

                                {/* Grid toggle */}
                                <div className="hidden md:flex gap-1 bg-muted p-1 rounded-lg">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setGridCols(3)}
                                        className={gridCols === 3 ? 'bg-background shadow' : ''}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setGridCols(4)}
                                        className={gridCols === 4 ? 'bg-background shadow' : ''}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Sort */}
                            <Select onValueChange={(v) => updateParam('sort', v)}>
                                <SelectTrigger className="w-[140px] sm:w-[180px] rounded-xl border-border text-xs sm:text-sm">
                                    <SelectValue placeholder="Sắp xếp theo" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-popover">
                                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Grid */}
                        {products.length ? (
                            <div
                                className={`grid gap-4 ${gridCols === 3
                                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                    : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'
                                    }`}
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl bg-card p-16 text-center shadow-soft">
                                <div className="text-5xl">😢</div>
                                <p className="mt-4 text-muted-foreground">
                                    Không tìm thấy sản phẩm phù hợp
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
