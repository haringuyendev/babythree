// components/blocks/AboutStats.tsx
import React from 'react'

type Stat = {
  value: string
  label: string
}

type Props = {
  stats: Stat[]
}

export const AboutStats: React.FC<Props> = ({ stats }) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-extrabold text-primary md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
