'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Tag } from 'lucide-react'

function formatPrice(price, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getDiscountedPrice(product) {
  const { price, discount_type, discount_value, discount_ends_at } = product
  if (!discount_type || !discount_value) return null
  if (discount_ends_at && new Date(discount_ends_at) < new Date()) return null
  if (discount_type === 'percentage') return price - (price * discount_value) / 100
  if (discount_type === 'fixed') return price - discount_value
  return null
}

function getDiscountLabel(product) {
  const { discount_type, discount_value } = product
  if (discount_type === 'percentage') return `-${discount_value}%`
  if (discount_type === 'fixed') return `-${formatPrice(discount_value, 'COP')}`
  return null
}

export default function ProductCard({ product, storeSlug, accentColor = '#4f46e5' }) {
  const discountedPrice = getDiscountedPrice(product)
  const discountLabel   = getDiscountLabel(product)
  const finalPrice      = discountedPrice ?? product.price
  const hasStock        = product.unit === 'UND' ? product.stock > 0 : true

  return (
    <Link
      href={`/${storeSlug}/p/${product.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: 'var(--surface-700)' }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--surface-600)]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
            🛍️
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountLabel && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-black text-white"
              style={{ background: '#ef4444' }}>
              {discountLabel}
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-bold text-white"
              style={{ background: accentColor }}>
              ⭐ Destacado
            </span>
          )}
          {!hasStock && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-bold text-white bg-gray-600">
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider truncate">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-2 flex items-end gap-2 flex-wrap">
          <span className="text-base font-black" style={{ color: accentColor }}>
            {formatPrice(finalPrice)}
          </span>
          {discountedPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Hover CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 py-2 text-center text-xs font-bold text-white
                   translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        style={{ background: accentColor }}
      >
        <ShoppingCart className="inline w-3.5 h-3.5 mr-1" />
        Ver producto
      </div>
    </Link>
  )
}
