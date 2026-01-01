import Image from 'next/image'



export const ContactInfoBlock = ({ items }: any) => {
  return (
    <section className="space-y-6">
      {items.map((item: any) => (
        <div key={item.id} className="flex gap-4 items-start my-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: item.backgroundColor || '#f5f5f5',
            }}
          >
            <Image
              src={item.icon.url}
              alt={item.icon.alt || item.title}
              width={24}
              height={24}
            />
          </div>

          <div className='my-0'>
            <h3 className="font-bold text-foreground m-0">
              {item.title}
            </h3>
            <p className="text-muted-foreground m-0">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
