'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * QuantityOffers
 * Displays multi-buy offer cards: 1 unit, 2x1, 3x2, etc.
 * Inspired by high-conversion LATAM product pages.
 *
 * @param {number}   basePrice      - Unit price
 * @param {number}   selected       - Currently selected quantity
 * @param {function} onSelect       - Callback(qty, finalPrice)
 * @param {string}   accentColor    - Brand color
 * @param {number}   discountedPrice - Pre-discounted unit price (optional)
 */
export default function QuantityOffers({
  basePrice,
  discountedPrice,
  selected,
  onSelect,
  accentColor = '#4f46e5',
}) {
  const unitPrice = discountedPrice ?? basePrice

  const offers = [
    {
      qty: 1,
      label: '1 Unidad',
      tag: null,
      pct: 0,
      totalPrice: unitPrice,
    },
    {
      qty: 2,
      label: '2 Unidades',
      tag: '¡MÁS VENDIDO!',
      pct: 10,
      totalPrice: unitPrice * 2 * 0.9,
    },
    {
      qty: 3,
      label: '3 Unidades',
      tag: 'MEJOR PRECIO',
      pct: 20,
      totalPrice: unitPrice * 3 * 0.8,
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Elige tu oferta
      </p>
      {offers.map((offer) => {
        const isSelected = selected === offer.qty
        return (
          <button
            key={offer.qty}
            type="button"
            onClick={() => onSelect(offer.qty, offer.totalPrice)}
            className="relative flex items-center justify-between gap-3 p-4 rounded-2xl border-2 text-left w-full transition-all duration-200"
            style={{
              borderColor: isSelected ? accentColor : 'rgba(255,255,255,0.08)',
              background: isSelected ? `${accentColor}18` : 'var(--surface-700)',
            }}
          >
            {/* Tag badge */}
            {offer.tag && (
              <span
                className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-xs font-black text-white"
                style={{ background: offer.pct >= 20 ? '#10b981' : accentColor }}
              >
                {offer.tag}
              </span>
            )}

            {/* Selector circle */}
            <span
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor: isSelected ? accentColor : 'rgba(255,255,255,0.3)',
                background:  isSelected ? accentColor : 'transparent',
              }}
            >
              {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </span>

            {/* Label + per-unit info */}
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-white">{offer.label}</span>
              {offer.pct > 0 && (
                <span className="text-xs" style={{ color: '#10b981' }}>
                  Ahorras {offer.pct}% — {formatPrice(unitPrice * offer.qty - offer.totalPrice)} de descuento
                </span>
              )}
            </span>

            {/* Total price */}
            <span className="flex flex-col items-end flex-shrink-0">
              <span className="text-base font-black" style={{ color: isSelected ? accentColor : '#fff' }}>
                {formatPrice(offer.totalPrice)}
              </span>
              {offer.qty > 1 && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(unitPrice * offer.qty)}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
