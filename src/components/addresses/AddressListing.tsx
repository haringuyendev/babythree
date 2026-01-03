'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useAddress } from '@/hooks/useAddress'
import { AddressItem } from '@/components/addresses/AddressItem'
import { CreateAddressModal } from '@/components/addresses/Modals'

export const AddressListing = () => {
  const { addresses, isLoading } = useAddress()

  if (isLoading) {
    return <p className="text-muted-foreground">Đang tải địa chỉ...</p>
  }

  return (
    <Card className="border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Địa chỉ giao hàng</CardTitle>
            <CardDescription>
              Quản lý địa chỉ nhận hàng của bạn
            </CardDescription>
          </div>

          <CreateAddressModal
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Thêm địa chỉ
              </Button>
            }
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {addresses.length === 0 && (
          <p className="text-muted-foreground">
            Bạn chưa có địa chỉ nào.
          </p>
        )}

        {addresses.map((address) => (
          <AddressItem key={address.id} address={address} />
        ))}
      </CardContent>
    </Card>
  )
}
