import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
export const Number: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    disabled?:boolean
  }
> = ({ name, defaultValue, errors, label, register, required, width,disabled }) => {
  return (
    <Width width={width}>
      <Label className="block text-sm text-foreground font-medium mb-2" htmlFor={name}>
        {label}

        {required && (
          <span className="required text-red-500">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={defaultValue}
        placeholder={label+'...'}
        id={name}
        type="number"
        className="h-12 rounded-xl border-order"
        {...register(name, { required })}
        disabled={disabled}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
