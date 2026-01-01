// components/blocks/contact/ContactFAQ.tsx
type FAQItem = {
  id: string
  question: string
  answer: string
}

type Props = {
  title?: string
  items: FAQItem[]
}

export const ContactFAQBlock = ({ title, items }: Props) => {
  return (
    <section className="space-y-6 pb-12">
      {title && (
        <h2 className="text-center text-2xl font-bold text-foreground">
          {title}
        </h2>
      )}

      <div className="mx-auto max-w-3xl space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-card p-6 shadow-soft"
          >
            <h3 className="font-bold text-foreground">
              {item.question}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
