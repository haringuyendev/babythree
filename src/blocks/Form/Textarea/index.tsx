import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
    disabled?:boolean
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width,disabled }) => {
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

      <TextAreaComponent
        defaultValue={defaultValue}
        id={name}
        placeholder={label+'...'}
        rows={rows}
        className="min-h-[150px] rounded-xl border-border"
        {...register(name, { required: required })}
        disabled={disabled}
      />

      {errors[name] && <Error name={name} />}
    </Width>
  )
}
