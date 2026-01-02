'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'

import type { Header as HeaderType } from '@/payload-types'

type Props = {
  data: HeaderType
}

export const HeaderClient: React.FC<Props> = ({ data }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const { cart } = useCart()

  const navLinks =
    data?.navItems?.map((item: any) => ({
      label: item.link?.label || '',
      href: item.link?.url || '/',
    })) || []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-18 md:px-6 lg:h-20 lg:px-8">
        {/* Mobile + Tablet Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="shrink-0 w-fit">
              <Menu className="h-5 w-5" />
              <span className="text-xl  font-bold text-foreground">
                BabyThree
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="md:w-5xl sm:w-2xl p-4 bg-background">
            <div className="flex flex-col gap-6 pt-6">
              <nav className="flex flex-col gap-2">
                <Link href="/" className="flex items-center gap-2 px-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                    <span className="text-lg font-bold text-primary-foreground">B3</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">BabyThree</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border pt-4">
                <Link
                  href="/login"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <User className="h-5 w-5" />
                  Đăng nhập
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 items-center gap-2 transition-transform hover:scale-105 lg:flex hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary shadow-button md:h-10 md:w-10">
            <span className="text-base font-extrabold text-primary-foreground md:text-lg">
              B3
            </span>
          </div>
          <span className="hidden text-xl font-bold text-foreground sm:inline-block">
            BabyThree
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Desktop */}
          <div className="relative hidden xl:block w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm sản phẩm..."
              className="h-10 rounded-2xl bg-muted/50 pl-10 pr-4"
            />
          </div>

          {/* Search Toggle (Mobile + Tablet) */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setIsSearchOpen((v) => !v)}
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* Wishlist (Desktop only) */}
          <Button variant="ghost" size="icon" className="hidden xl:flex">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cart?.items?.length ? (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs font-bold text-primary-foreground">
                {cart.items.length}
              </Badge>
            ) : null}
          </Button>

          {/* Auth (Desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/account')}
          >
            <User className="h-5 w-5" />
          </Button>

          <Button
            className="hidden xl:flex rounded-2xl bg-primary px-6 font-semibold shadow-button hover:scale-105 hover:shadow-glow"
            onClick={() => router.push('/login')}
          >
            Đăng nhập
          </Button>
        </div>
      </div>

      {/* Mobile + Tablet Search */}
      {isSearchOpen && (
        <div className="border-t border-border p-4 xl:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder="Tìm sản phẩm..."
              className="h-10 rounded-2xl bg-muted/50 pl-10 pr-4"
            />
          </div>
        </div>
      )}
    </header>
  )
}
