'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAddress } from '@/hooks/useAddress'
import { Address } from '@/store/api/address'

type Props = {
  trigger: React.ReactNode
  addressID?: string
  initialData?: Partial<Address>
}

export const CreateAddressModal = ({
  trigger,
  addressID,
  initialData,
}: Props) => {
  const { addAddress, editAddress } = useAddress()
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    phone: initialData?.phone || '',
    addressLine: initialData?.addressLine || '',
    district: initialData?.district || '',
    city: initialData?.city || '',
  })

  async function onSubmit() {
    if (addressID) {
      await editAddress(addressID, form)
    } else {
      await addAddress(form)
    }
    setOpen(false)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addressID ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />
            <Input
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <Input
              placeholder="Địa chỉ"
              value={form.addressLine}
              onChange={(e) =>
                setForm({ ...form, addressLine: e.target.value })
              }
            />
            <Input
              placeholder="Quận / Huyện"
              value={form.district}
              onChange={(e) =>
                setForm({ ...form, district: e.target.value })
              }
            />
            <Input
              placeholder="Tỉnh / Thành phố"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />
          </div>

          <Button className="mt-6 w-full" onClick={onSubmit}>
            {addressID ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
export const DeleteAddressModal = ({ addressID, trigger }: Props) => {
  const [open, setOpen] = useState(false)
  const { removeAddress } = useAddress()

  async function onDelete() {
    if (!addressID) return
    await removeAddress(addressID)
    setOpen(false)
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá địa chỉ?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Hành động này không thể hoàn tác.
          </p>

          <div className="flex gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Xoá
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}