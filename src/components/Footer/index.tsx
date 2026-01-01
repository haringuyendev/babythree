import type { Footer } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer', 1)()
  const {
    brand,
    socials,
    quickLinks,
    contact,
    newsletter,
    bottom,
  } = footer

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        {/* ================= GRID ================= */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* ========== BRAND ========== */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {brand?.logo && typeof brand.logo === 'object' ? (
                <Image
                  src={brand.logo.url!}
                  alt={brand.logo.alt || brand?.name || ''}
                  width={40}
                  height={40}
                  className="rounded-2xl"
                />
              ) : <Link href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">B3</span>
                </div>
                <span className="text-xl font-bold text-foreground">BabyThree</span>
              </Link>}
              <span className="text-xl font-bold text-foreground">
                {brand?.name}
              </span>
            </Link>

            {brand?.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {brand.description}
              </p>
            )}

            {/* Socials */}
            {socials && socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary"
                  >
                    {item.icon && typeof item.icon === 'object' && (
                      <Image
                        src={item.icon.url!}
                        alt={item.icon.alt || 'social'}
                        width={20}
                        height={20}
                      />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ========== QUICK LINKS (MULTI COLUMNS) ========== */}
          {quickLinks && quickLinks.map((column, i) => (
            <div key={i} className="space-y-4">
              <h3 className="text-base font-bold text-foreground">
                {column.title}
              </h3>
              <nav className="flex flex-col gap-2">
                {column.items && column.items.map((item, j) => (
                  <Link
                    key={j}
                    href={item.url}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* ========== CONTACT + NEWSLETTER ========== */}
          <div className="space-y-6">
            {/* Contact */}
            {contact && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground">
                  {contact.title}
                </h3>

                <div className="space-y-3">
                  {contact.items && contact.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      {item.icon && typeof item.icon === 'object' && (
                        <Image
                          src={item.icon.url!}
                          alt={item.icon.alt || 'icon'}
                          width={16}
                          height={16}
                          className="mt-0.5"
                        />
                      )}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter */}
            {newsletter && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  {newsletter.title}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="email"
                    placeholder={newsletter.placeholder || 'Email của bạn...'}
                    className="h-10 rounded-xl bg-background"
                  />
                  <Button className="rounded-xl bg-primary px-4 shadow-button hover:scale-105">
                    {newsletter.buttonLabel}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground text-center">
            {bottom?.copyright}
          </p>

          {bottom?.links && bottom.links.length > 0 && (
            <div className="flex gap-6 text-sm text-muted-foreground">
              {bottom.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url || '/'}
                  className="hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
