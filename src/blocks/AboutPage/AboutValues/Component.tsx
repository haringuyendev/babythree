// components/blocks/AboutValues.tsx
import { RichText } from '@/components/RichText';
import Image from 'next/image';
import React from 'react'

type ValueItem = {
  icon: { url: string; alt?: string }
  title: string
  description: any
  backgroundColor?: string
}

type Props = {
  heading: string
  description?: any
  items: ValueItem[]
}

export const AboutValues: React.FC<Props> = ({
  heading,
  description,
  items,
}) => {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            {heading}
          </h2>
          {description && (
            <RichText data={description} className="mx-auto mt-4 max-w-2xl text-muted-foreground" enableGutter={false} />
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card ${
                item.backgroundColor
                  ? `bg-${item.backgroundColor}`
                  : 'bg-background'
              }`}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-soft">
                <Image
                  src={item.icon.url}
                  alt={item.icon.alt || item.title}
                  width={1080}
                  height={1080}
                  className="h-7 w-7 object-contain"
                />
              </div>

              <h3 className="mb-2 text-lg font-bold">
                {item.title}
              </h3>
              <RichText data={item.description} className="text-sm text-muted-foreground" enableGutter={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
