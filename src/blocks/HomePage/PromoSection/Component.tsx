// components/blocks/PromoBanner.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function PromoBanner({
    iconType,
    emoji,
    iconImage,
    title,
    description,
    cta,
    backgroundType,
    gradient,
    backgroundImage,
}: any) {

    return (
        <section className="py-12 md:py-16">
            <div className="container">
                <div
                    className={`relative overflow-hidden rounded-3xl p-8 text-center md:p-12 ${backgroundType === 'gradient' ? '' : ''
                        }`}
                    style={
                        backgroundType === 'image' && backgroundImage?.url
                            ? {
                                backgroundImage: `url(${backgroundImage.url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }
                            : 
                        backgroundType==='gradient' ? { background: `linear-gradient(135deg, ${gradient?.[0]?.color || 'from-primary to-baby-pink-dark'}, ${gradient?.[1]?.color || 'from-primary to-baby-pink-dark'})` } : { backgroundColor: 'white' }
                    }
                >
                    <div className="relative z-10 mx-auto max-w-2xl text-primary-foreground">
                        {/* Icon */}
                        {iconType === 'emoji' && (
                            <span className="mb-4 inline-block text-4xl">{emoji}</span>
                        )}

                        {iconType === 'image' && iconImage?.url && (
                            <Image
                                src={iconImage.url}
                                alt={iconImage.alt || 'icon'}
                                width={56}
                                height={56}
                                className="mx-auto mb-4"
                            />
                        )}

                        <h2 className="mb-4 text-2xl text-background font-bold md:text-4xl">
                            {title}
                        </h2>

                        {description && (
                            <p className="mb-6 text-background/80">
                                {description}
                            </p>
                        )}

                        <Button
                            asChild
                            size="lg"
                            className="rounded-2xl bg-background px-8 py-6 font-bold text-foreground shadow-card transition-all hover:scale-105"
                        >
                            <Link href={cta.url}>{cta.label}</Link>
                        </Button>
                    </div>

                    {/* Overlay for image background */}
                    {backgroundType === 'image' && (
                        <div className="absolute inset-0 bg-black/30" />
                    )}
                </div>
            </div>
        </section>
    )
}
