export type Variant = {
  id: string
  sku: string
  price: number
}

export type Product = {
  id: string
  name: string
  brand?: string | null
  category?: string | null
  description?: string | null
  images?: string[] | null
  variants?: Variant[]
}

export type CatalogItem = {
  id: string
  name: string
  brand?: string | null
  category?: string | null
  description?: string | null
  image?: string | null
  price: number | null
  sku?: string | null
  variantId?: string | null
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000"

function getPrimaryVariant(variants?: Variant[]) {
  if (!variants || variants.length === 0) {
    return null
  }
  return variants[0]
}

export async function getCatalogItems(): Promise<CatalogItem[]> {
  const response = await fetch(`${API_BASE_URL}/catalog/products`, {
    next: { revalidate: 60 },
  })
  if (!response.ok) {
    return []
  }
  const data = (await response.json()) as Product[]
  return data.map((product) => {
    const variant = getPrimaryVariant(product.variants)
    const rawPrice = variant?.price
    const parsedPrice =
      typeof rawPrice === "number"
        ? rawPrice
        : rawPrice
          ? Number(rawPrice)
          : null
    return {
      id: product.id,
      name: product.name,
      brand: product.brand ?? null,
      category: product.category ?? null,
      description: product.description ?? null,
      image: product.images?.[0] ?? null,
      price: Number.isFinite(parsedPrice) ? parsedPrice : null,
      sku: variant?.sku ?? null,
      variantId: variant?.id ?? null,
    }
  })
}
