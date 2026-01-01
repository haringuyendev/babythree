// components/blocks/AboutHero.tsx
import { RichText } from '@/components/RichText'
import React from 'react'

export const AboutHero: React.FC<any> = ({
    title,
    highlight,
    content,
}) => {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-baby-pink-light via-background to-baby-mint-light py-16 md:py-24">
            <div className="container text-center">
                <h1 className="text-4xl font-extrabold md:text-5xl lg:text-6xl">
                    {title.replace(highlight, '')}{' '}
                    <span className="text-primary">{highlight}</span>
                </h1>
                {content && <RichText data={content} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" enableGutter={false} />}

            </div>

            {/* Decorative */}
            <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-baby-pink/30 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-baby-mint/30 blur-3xl" />
        </section>
    )
}
