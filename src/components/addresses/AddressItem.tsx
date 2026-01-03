'use client'

import { Edit2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Address } from '@/store/api/address'
import { useAddress } from '@/hooks/useAddress'
import { CreateAddressModal, DeleteAddressModal } from './Modals'
import clsx from 'clsx'

type Props = {
  address: Address
}

export const AddressItem: React.FC<Props> = ({ address }) => {
  const { makeDefault } = useAddress()
  return (
    <div
      className={clsx(
        'border rounded-xl p-4 relative transition-colors',
        address.isDefault
          ? 'border-primary bg-primary/5'
          : 'border-border',
      )}
    >
      {/* DEFAULT BADGE */}
      {address.isDefault && (
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          Mặc định
        </Badge>
      )}

      {/* INFO */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{address.fullName}</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">
            {address.phone}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {address.addressLine}, {address.district},{' '}
          {address.city}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 mt-4">
        <CreateAddressModal
          addressID={address.id}
          initialData={address}
          trigger={
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              <Edit2 className="w-3 h-3" />
              Sửa
            </Button>
          }
        />

        {!address.isDefault && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => makeDefault(address.id)}
            >
              Đặt mặc định
            </Button>

            <DeleteAddressModal
              addressID={address.id}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              }
            />
          </>
        )}
      </div>

    </div>
  )
}
