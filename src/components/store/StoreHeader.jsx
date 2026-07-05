'use client'

import Image from 'next/image'
import { ShoppingBag, Star, MapPin, Phone, Globe } from 'lucide-react'

export default function StoreHeader({ company }) {
  const { name, logo_url, store_settings, country } = company

  const accentColor = store_settings?.accent_color || '#4f46e5'
  const whatsapp    = store_settings?.whatsapp_contact || ''

  return (
    <header
      className="w-full sticky top-0 z-50 glass border-b"
      style={{ borderBottomColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo + Name */}
        <div className="flex items-center gap-3 min-w-0">
          {logo_url ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10">
              <Image
                src={logo_url}
                alt={`Logo de ${name}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xl"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)` }}
            >
              {name?.[0]?.toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-bold text-white text-base leading-tight truncate">
              {name}
            </h1>
            {country && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {country}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#25d366' }}
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          )}

          <div
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white/70"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Tienda</span>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div
        className="py-1.5 text-center text-xs font-medium tracking-wide"
        style={{ background: accentColor, color: '#fff' }}
      >
        🔒 Compra segura · 🚚 Envío a todo el país · ⭐ Garantía de satisfacción
      </div>
    </header>
  )
}
