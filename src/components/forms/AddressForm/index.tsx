'use client'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Address, Config, User } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { deepMergeSimple } from 'payload/shared'
import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { useAddress } from '@/hooks/useAddress'

export interface AddressFormValue {
  customer: string | User;
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  ward?: string | null;
  district?: string | null;
  city: string;
  isDefault?: boolean | null;
}
type Props = {
  addressID?: Config['db']['defaultIDType']
  initialData?: Omit<AddressFormValue, 'id' | 'updatedAt' | 'createdAt'> & { country?: string }
  callback?: (data: Partial<Address>) => void
  /**
   * If true, the form will not submit to the API.
   */
  skipSubmission?: boolean
}

export const AddressForm: React.FC<Props> = ({
  addressID,
  initialData,
  callback,
  skipSubmission,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddressFormValue>({
    defaultValues: initialData,
  })

  const { addAddress, editAddress } = useAddress()

  const onSubmit = useCallback(
    async (data: AddressFormValue) => {
      const newData = deepMergeSimple(initialData || {}, data)

      if (!skipSubmission) {
        if (addressID) {
          await editAddress(addressID, newData)
        } else {
          await addAddress(newData)
        }
      }

      if (callback) {
        callback(newData)
      }
    },
    [initialData, skipSubmission, callback, addressID, addAddress, editAddress],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <FormItem>
            <Label htmlFor="fullName">Họ và tên*</Label>
            <Input
              autoComplete="family-name"
              id="fullName"
              {...register('fullName', { required: 'Họ và tên is required.' })}
            />
            {errors.fullName && <FormError message={errors.fullName.message} />}
          </FormItem>
        </div>

        <FormItem>
          <Label htmlFor="phone">Số điện thoại*</Label>
          <Input type="tel" id="phone" autoComplete="mobile tel" {...register('phone', { required: 'Số điện thoại is required.' })} />
          {errors.phone && <FormError message={errors.phone.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input id="email" autoComplete="email" {...register('email', { required: 'Email is required.' })} />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="addressLine">Địa chỉ*</Label>
          <Input
            id="addressLine"
            autoComplete="address-line"
            {...register('addressLine', { required: 'Địa chỉ is required.' })}
          />
          {errors.addressLine && <FormError message={errors.addressLine.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="ward">Quận/Huyện</Label>
          <Input id="ward" autoComplete="ward" {...register('ward', { required: 'Quận/Huyện is required.' })} />
          {errors.ward && <FormError message={errors.ward.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="city">Thành phố*</Label>
          <Input
            id="city"
            autoComplete="address-level2"
            {...register('city', { required: 'Thành phố is required.' })}
          />
          {errors.city && <FormError message={errors.city.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="district">Phường/Xã</Label>
          <Input id="district" autoComplete="district" {...register('district', { required: 'Phường/Xã is required.' })} />
          {errors.district && <FormError message={errors.district.message} />}
        </FormItem>
      </div>

      <Button type="submit">Lưu</Button>
    </form>
  )
}
