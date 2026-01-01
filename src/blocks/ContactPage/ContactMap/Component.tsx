
export const ContactMapBlock = ({
  title,
  embedUrl,
  height = 360,
  rounded = true,
}: any) => {
  return (
    <section className="space-y-4">
      {title && (
        <h3 className="text-xl font-bold text-foreground">
          {title}
        </h3>
      )}

      <div
        className={`overflow-hidden ${rounded ? 'rounded-2xl' : ''}`}
        style={{ height }}
      >
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  )
}
