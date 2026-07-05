'use client'

import { useState } from 'react'
import Image from 'next/image'
import QuantityOffers from './QuantityOffers'
import CodForm from './CodForm'
import { Phone, Check, ShieldCheck, HelpCircle } from 'lucide-react'

function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ProductViewClient({ product, company, storeSlug }) {
  const accentColor = company.store_settings?.accent_color || '#4f46e5'
  const whatsapp = company.store_settings?.whatsapp_contact || ''

  // Offers state
  const [selectedQty, setSelectedQty] = useState(1)
  const [totalPrice, setTotalPrice] = useState(product.price)

  const handleSelectOffer = (qty, price) => {
    setSelectedQty(qty)
    setTotalPrice(price)
  }

  // Scroll to checkout form
  const scrollToCheckout = () => {
    const formElement = document.getElementById('checkout-form-container')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      
      {/* Column 1: Image & Description (lg:col-span-7) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Product Main Card */}
        <div className="p-4 rounded-2xl border border-subtle bg-surface-800">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-surface-700">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                📦
              </div>
            )}
          </div>
        </div>

        {/* Product Description */}
        <div className="p-6 rounded-2xl border border-subtle bg-surface-800">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3">
            Descripción del Producto
          </h3>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {product.description || 'Este producto no cuenta con descripción detallada en este momento. Si tienes dudas, contáctanos directamente a nuestro WhatsApp.'}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl border border-subtle bg-surface-800 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <TruckIcon className="w-7 h-7" style={{ color: accentColor }} />
            <span className="text-xs font-bold text-white leading-tight">Envío Gratis</span>
            <span className="text-[10px] text-gray-400">A todo el país</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span className="text-xs font-bold text-white leading-tight">Compra Segura</span>
            <span className="text-[10px] text-gray-400">Paga al recibir</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <HelpCircle className="w-7 h-7 text-amber-400" />
            <span className="text-xs font-bold text-white leading-tight">Soporte 24/7</span>
            <span className="text-[10px] text-gray-400">Atención WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Column 2: Buy Interface & Forms (lg:col-span-5) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Name and Pricing Header */}
        <div className="p-6 rounded-2xl border border-subtle bg-surface-800 flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {product.category || 'Categoría'}
          </span>
          <h2 className="text-2xl font-black text-white leading-tight">
            {product.name}
          </h2>

          <div className="flex items-end gap-3 mt-1">
            <span className="text-3xl font-black" style={{ color: accentColor }}>
              {formatPrice(product.price)}
            </span>
            <span className="px-2 py-0.5 rounded-lg text-xs font-black text-white bg-emerald-500 uppercase tracking-wider">
              Envío gratis
            </span>
          </div>
        </div>

        {/* Dynamic Quantity Offer Cards */}
        <div className="p-6 rounded-2xl border border-subtle bg-surface-800">
          <QuantityOffers
            basePrice={product.price}
            selected={selectedQty}
            onSelect={handleSelectOffer}
            accentColor={accentColor}
          />
        </div>

        {/* Checkout Form */}
        <div id="checkout-form-container">
          <CodForm
            product={product}
            quantity={selectedQty}
            totalPrice={totalPrice}
            storeSlug={storeSlug}
            companyId={company.id}
            accentColor={accentColor}
          />
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Viewport */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-subtle bg-surface-900/95 backdrop-blur-md flex items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            Total a Pagar ({selectedQty} {selectedQty === 1 ? 'ud' : 'uds'}):
          </span>
          <span className="text-lg font-black text-white">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <button
          type="button"
          onClick={scrollToCheckout}
          className="px-6 py-3.5 rounded-xl font-bold text-white text-xs uppercase tracking-widest shadow-lg flex-1 text-center"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            boxShadow: `0 4px 14px ${accentColor}30`,
          }}
        >
          Pedir Ahora
        </button>
      </div>

    </div>
  )
}

function TruckIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}
