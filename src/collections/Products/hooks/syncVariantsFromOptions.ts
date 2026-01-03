import type { CollectionAfterChangeHook } from 'payload'

type ProductOption = {
  key: string
  values: {
    id: string
    label: string
  }[]
}

/* ---------------- Cartesian Product ---------------- */
const cartesian = (arrays: any[][]): any[][] =>
  arrays.reduce(
    (acc, curr) =>
      acc.flatMap(a => curr.map(b => [...a, b])),
    [[]],
  )

/* ---------------- Normalize SKU ---------------- */
const normalizeSKU = (value: string) =>
  value
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeOptions = (
  value: unknown,
): Record<string, string> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  const result: Record<string, string> = {}

  for (const [k, v] of Object.entries(value)) {
    if (typeof v === 'string') {
      result[k] = v
    }
  }

  return result
}


/* ---------------- Stable Signature ---------------- */
const buildSignature = (options: Record<string, string>) =>
  Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|')

export const syncVariantsFromOptions: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const payload = req.payload
  const productId = doc.id
  const options: ProductOption[] = doc.options || []

  if (!doc.sku_code) return doc

  /* --------------------------------------------
     1. Nếu không có options → xoá variants
  -------------------------------------------- */
  if (!options.length) {
    const existing = await payload.find({
      collection: 'variants',
      where: { product: { equals: productId } },
      limit: 1000,
    })

    for (const v of existing.docs) {
      await payload.delete({
        collection: 'variants',
        id: v.id,
      })
    }

    return doc
  }

  /* --------------------------------------------
     2. Sinh combinations (key → valueId)
  -------------------------------------------- */
  const valueMatrix = options.map(opt =>
    opt.values.map(v => ({
      key: opt.key,
      valueId: v.id,
      label: v.label,
    })),
  )

  const combinations = cartesian(valueMatrix).map(parts => {
    const optionMap: Record<string, string> = {}
    const skuParts: string[] = []

    for (const p of parts) {
      optionMap[p.key] = p.valueId
      skuParts.push(normalizeSKU(p.label))
    }

    return {
      options: optionMap,
      skuPart: skuParts.join('-'),
      signature: buildSignature(optionMap),
    }
  })

  /* --------------------------------------------
     3. Load existing variants
  -------------------------------------------- */
  const existing = await payload.find({
    collection: 'variants',
    where: { product: { equals: productId } },
    limit: 1000,
  })

  const existingMap = new Map(
  existing.docs.map(v => [
    buildSignature(normalizeOptions(v.options)),
    v,
  ]),
)


  const seen = new Set<string>()

  /* --------------------------------------------
     4. Create missing variants
  -------------------------------------------- */
  for (const combo of combinations) {
    seen.add(combo.signature)

    if (!existingMap.has(combo.signature)) {
      const sku = `${doc.sku_code}-${combo.skuPart}`

      await payload.create({
        collection: 'variants',
        data: {
          product: productId,
          options: combo.options,   // ✅ key → valueId
          sku,
          price: doc.price,         // ✅ inherit
          stock: doc.stock,         // ✅ inherit
          isActive: true,
        },
      })
    }
  }

  /* --------------------------------------------
     5. Xoá variants không còn hợp lệ
  -------------------------------------------- */
  for (const [signature, variant] of existingMap) {
    if (!seen.has(signature)) {
      await payload.delete({
        collection: 'variants',
        id: variant.id,
      })
    }
  }

  return doc
}
