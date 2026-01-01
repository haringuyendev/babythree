// components/blocks/AboutStory.tsx
import { RichText } from '@/components/RichText'
import Image from 'next/image'
import React from 'react'

type Props = {
  title: string
  content: any
  image: {
    url: string
    alt?: string
  }
}

export const AboutStory: React.FC<Props> = ({
  title,
  content,
  image,
}) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-primary/20 to-baby-mint/20 blur-2xl" />
            <Image
              src={image?.url}
              alt={image?.alt || title}
              width={1080}
              height={1080}
              className="relative rounded-3xl shadow-card"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold md:text-4xl">
              {title}
            </h2>

            {content && <RichText data={content} className="space-y-4 text-muted-foreground" enableGutter={false} />}
          </div>
        </div>
      </div>
    </section>
  )
}
