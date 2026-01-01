// components/blocks/Hero.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { RichText } from '@/components/RichText'

export function Hero({
  badgeText,
  title,
  highlight,
  content,
  primaryCTA,
  secondaryCTA,
  image,
}: any) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-baby-pink-light via-background to-baby-mint-light">
      <div className="container py-12 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Content */}
          <div className="order-2 space-y-6 text-center lg:order-1 lg:text-left">
            <div className="inline-block animate-bounce-soft rounded-full bg-baby-mint px-4 py-2 text-sm font-semibold text-secondary-foreground">
              {badgeText}
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {title}
              <span className="block text-primary">{highlight}</span>
            </h1>

            {content && <RichText data={content} className="mx-auto max-w-md text-lg text-muted-foreground lg:mx-0" enableGutter={false} />}

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-primary px-8 py-6 text-base font-bold shadow-button transition-all hover:scale-105 hover:shadow-glow"
              >
                <Link href={primaryCTA.url}>
                  {primaryCTA.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl border-2 border-primary/30 bg-transparent px-8 py-6 text-base font-bold text-foreground hover:bg-primary/10"
              >
                <Link href={secondaryCTA.url}>
                  {secondaryCTA.label}
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-baby-mint/20 blur-2xl" />
              <Image
                src={image?.url}
                alt={image?.alt || title}
                width={1080}
                height={1080}
                className="relative rounded-3xl shadow-card"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorations */}
      <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-baby-pink/30 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-60 w-60 rounded-full bg-baby-mint/30 blur-3xl" />
    </section>
  )
}
