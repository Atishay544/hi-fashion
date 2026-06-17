'use client'
import { useState, useMemo } from 'react'
import VariantSelector from './VariantSelector'
import AddToCartButton from './AddToCartButton'
import ProductOffers from './ProductOffers'

export interface StoreSku {
  attributes: Record<string, string>
  stock: number
}

interface Offer { id: string; type: string; upfront_pct: number; discount_pct: number }

interface Props {
  product: { id: string; name: string; price: number; image: string | null; stock: number }
  variants: { id: string; name: string; options: unknown[] }[]
  skus: StoreSku[]
  initialOffers: Offer[]
}

function skuKey(attrs: Record<string, string>) {
  return Object.entries(attrs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('|')
}

export default function ProductActions({ product, variants, skus, initialOffers }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({})

  const variantNames = variants.map(v => v.name)
  const allSelected = variantNames.length > 0 && variantNames.every(n => !!selected[n])

  // Find the matching SKU only when all variants are chosen
  const matchedSku = useMemo(() => {
    if (!allSelected || skus.length === 0) return null
    const key = skuKey(selected)
    return skus.find(s => skuKey(s.attributes) === key) ?? null
  }, [selected, skus, allSelected])

  // Effective stock: matched SKU stock if variants exist + SKUs defined, else product.stock
  const effectiveStock = useMemo(() => {
    if (skus.length === 0) return product.stock          // no SKUs set — use product total
    if (!allSelected) return 1                           // not all chosen yet — don't block button on product stock
    return matchedSku?.stock ?? 0                        // show combo stock (0 if not found)
  }, [skus, allSelected, matchedSku, product.stock])

  // Unselected variant names for the prompt
  const unselectedVariants = variantNames.filter(n => !selected[n])

  return (
    <>
      {variants.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <VariantSelector
            variants={variants}
            skus={skus}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      )}

      <div className="border-t border-gray-100 pt-5">
        <ProductOffers price={product.price} initialOffers={initialOffers} />
      </div>

      <div className="border-t border-gray-100 pt-5">
        {variants.length > 0 && !allSelected ? (
          <div className="space-y-2">
            <button
              disabled
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed text-sm"
            >
              Please select {unselectedVariants.join(' & ')} to add to cart
            </button>
          </div>
        ) : (
          <AddToCartButton
            product={{ ...product, stock: effectiveStock }}
            variantAttributes={allSelected ? selected : undefined}
            skuLabel={allSelected && variants.length > 0
              ? variantNames.map(n => selected[n]).join(' / ')
              : undefined}
          />
        )}
      </div>
    </>
  )
}
