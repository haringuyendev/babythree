import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'

export const Select: React.FC<
  SelectField & {
    control: Control
    errors: Partial<FieldErrorsImpl>
    disabled?:boolean
  }
> = ({ name, control, errors, label, options, required, width, defaultValue,disabled }) => {
  return (
    <Width width={width}>
      <Label className="block text-sm font-medium mb-2" htmlFor={name}>
        {label}
        {required && (
          <span className="required text-red-500">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue={defaultValue} 
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value)

          return (
            <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className="w-full h-12 bg-secondary border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" id={name} disabled={disabled}>
                <SelectValue placeholder={label} />
              </SelectTrigger>  
              <SelectContent>
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </SelectComponent>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
