import type { CollectionBeforeChangeHook } from 'payload'

export const generateOptionKey: CollectionBeforeChangeHook = async ({ data }) => {
  if (!data?.options) return data

  data.options = data.options.map((opt: any) => {
    if (!opt.label) return opt

    const key = opt.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return {
      ...opt,
      key,
    }
  })

  return data
}
