// components/blocks/FeaturesBlock.tsx
import Image from 'next/image'

type FeatureItem = {
  icon?: {
    url?: string
    alt?: string
  }
  title: string
  description?: string
}

export function FeaturesBlock({
  items,
}: {
  items: FeatureItem[]
}) {
  return (
    <section className="border-y border-border bg-card py-6 sm:py-8">
      <div className="container grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-xl p-3 text-center sm:flex-row sm:text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Image src={item.icon?.url || ''} alt={item.icon?.alt || ''} width={24} height={24} className="h-6 w-6" loading="lazy" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
