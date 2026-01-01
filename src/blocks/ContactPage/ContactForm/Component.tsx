// components/blocks/contact/ContactForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

type Props = {
  title: string
  submitText?: string
  successMessage?: string
}

export const ContactFormBlock = ({
  title,
  submitText = 'Gửi tin nhắn',
  successMessage = 'Gửi thành công!',
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: gọi API submit contact
    await new Promise((r) => setTimeout(r, 1000))

    toast.success('Thành công', {
      description: successMessage,
    })

    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section className="rounded-3xl bg-card p-8 shadow-card">
      <h2 className="mb-6 text-xl font-bold text-foreground">
        {title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Họ và tên *</Label>
            <Input required />
          </div>

          <div className="space-y-2">
            <Label>Số điện thoại *</Label>
            <Input type="tel" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" />
        </div>

        <div className="space-y-2">
          <Label>Tiêu đề *</Label>
          <Input required />
        </div>

        <div className="space-y-2">
          <Label>Nội dung *</Label>
          <Textarea required className="min-h-[140px]" />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6"
        >
          {isSubmitting ? 'Đang gửi...' : submitText}
        </Button>
      </form>
    </section>
  )
}
