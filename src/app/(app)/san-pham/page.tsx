// app/(shop)/shop/page.tsx
import ShopClient from '@/components/Product/ProductPage/ProductList'
import { getProductByQuery, getProductCategory } from '@/actions/product'

type SearchParams = {
  q?: string
  category?: string
  age?: string | string[]
  brand?: string | string[]
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const {
    q,
    category,
    age,
    brand,
    minPrice,
    maxPrice,
    sort = '-createdAt',
  } = await searchParams
  const products=await getProductByQuery({q,category,age,brand,minPrice,maxPrice,sort})

  const catergories = await getProductCategory()

  return <ShopClient products={products.docs} total={products.totalDocs} categories={catergories.docs} />
}
