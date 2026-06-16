'use client'
import { useState } from 'react'
import { useProductImages } from './ProductImageProvider'

interface VariantOption {
  value: string
  images: string[]
}

interface Variant {
  id: string
  name: string
  options: (string | VariantOption)[]
}

function normalize(o: unknown): VariantOption {
  if (typeof o === 'string') return { value: o, images: [] }
  if (o && typeof o === 'object' && 'value' in o) {
    const opt = o as { value: unknown; images?: unknown }
    return {
      value: String(opt.value),
      images: Array.isArray(opt.images) ? (opt.images as string[]) : [],
    }
  }
  return { value: String(o), images: [] }
}

export default function VariantSelector({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const { defaultImages, setActiveImages } = useProductImages()

  if (!variants || variants.length === 0) return null

  function handleSelect(variantName: string, opt: VariantOption) {
    const isDeselect = selected[variantName] === opt.value

    setSelected(prev => ({
      ...prev,
      [variantName]: isDeselect ? '' : opt.value,
    }))

    // Only switch gallery images if this option has variant-specific images
    if (opt.images.length > 0) {
      setActiveImages(isDeselect ? defaultImages : opt.images)
    }
  }

  return (
    <div className="space-y-5">
      {variants.map(v => {
        const opts = (Array.isArray(v.options) ? v.options : []).map(normalize)
        return (
          <div key={v.id}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-sm font-semibold text-gray-900">{v.name}</span>
              {selected[v.name] && (
                <span className="text-sm text-gray-500">
                  : <span className="font-medium text-gray-700">{selected[v.name]}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {opts.map(opt => {
                const isActive = selected[v.name] === opt.value
                const hasImages = opt.images.length > 0
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(v.name, opt)}
                    className={`relative min-w-11 px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-150 ${
                      isActive
                        ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {opt.value}
                    {hasImages && (
                      <span
                        className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                          isActive ? 'bg-white text-gray-900' : 'bg-indigo-500 text-white'
                        }`}
                        title={`${opt.images.length} photos`}
                      >
                        {opt.images.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
