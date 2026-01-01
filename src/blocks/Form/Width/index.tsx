import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const getColSpan = (width?: number | string) => {
    if (!width) return 'col-span-12'

    if (typeof width === 'string') {
      if (width.includes('50')) return 'col-span-6'
      return 'col-span-12'
    }

    if (width === 50) return 'lg:col-span-6 col-span-12'
    return 'col-span-12'
  }
  return (
    <div className={`${getColSpan(width)} w-full mb-4`}>
      {children}
    </div>
  )
}
