'use client'

import Link from 'next/link'
import { ImageOff } from 'lucide-react'
import { formatCOP } from '@/lib/format'

// Tarjeta de producto minimalista: imagen (proporción fija), nombre (máx. 2 líneas),
// precio y descuento. Altura uniforme en toda la cuadrícula.
export default function LandingProductCard({ product }) {
  const href = product.storeSlug ? `/${product.storeSlug}/p/${product.id}` : null

  const inner = (
    <article className="group h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
      {/* Imagen en contenedor de proporción fija */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            width={320}
            height={240}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <ImageOff size={24} />
          </div>
        )}
        {product.hasDiscount && (
          <span className="absolute top-3 left-3 bg-white/95 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-md border border-red-100">
            -{product.pct}%
          </span>
        )}
      </div>

      {/* Texto siempre debajo de la imagen */}
      <div className="flex flex-col flex-grow p-4">
        <h3 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 min-h-[2.55em] group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto pt-3 flex items-baseline gap-2 min-w-0">
          <span className="text-[15px] font-bold text-slate-900 tabular-nums truncate">
            {formatCOP(product.finalPrice)}
          </span>
          {product.hasDiscount && (
            <span className="text-[11px] text-slate-400 line-through font-medium tabular-nums shrink-0">
              {formatCOP(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  )

  return href ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    inner
  )
}
