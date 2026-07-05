'use client'
import { useState } from 'react'
import CodForm from './CodForm'
import QuantityOffers from './QuantityOffers'

const formatCOP = (v) =>
  v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

const CATEGORY_EMOJI = {
  'Alimentos': '🍎', 'Bebidas': '🥤', 'Limpieza': '🧹', 'Higiene': '🧴',
  'Tecnología': '💻', 'Ropa': '👗', 'Calzado': '👟', 'Hogar': '🏠',
  'Mascotas': '🐾', 'Juguetes': '🧸', 'Salud': '💊', 'Belleza': '💄',
  'Deportes': '⚽', 'Papelería': '📝', 'Otros': '📦',
}

// Icons
const ShoppingCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const Star = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

export default function ProductViewClient({ product, company, storeSlug }) {
  const [selectedOffer, setSelectedOffer] = useState({ qty: 1, discount: 0 })
  const [showForm, setShowForm] = useState(false)
  const accentColor = company?.store_settings?.accent_color || '#4f46e5'

  const hasDiscount = product.discount_value && product.discount_value > 0
  const baseDiscount = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.discount_value
      : (product.discount_value / product.price) * 100
    : 0
  const basePrice = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price

  const finalUnitPrice = basePrice * (1 - selectedOffer.discount / 100)
  const finalTotal = finalUnitPrice * selectedOffer.qty

  const imageUrl = product.image_url && product.image_url !== 'none' ? product.image_url : null
  const emoji = CATEGORY_EMOJI[product.category] || '📦'

  return (
    <>
      {/* Product layout grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }}
        className="animate-slide-up"
      >
        {/* Image */}
        <div className="product-detail-img-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem', background: 'linear-gradient(135deg, var(--surface-700), var(--surface-600))'
            }}>
              {emoji}
            </div>
          )}

          {/* Badges overlay */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {product.featured && (
              <span className="badge badge-warning">
                <Star /> Destacado
              </span>
            )}
            {hasDiscount && (
              <span className="badge badge-danger">
                -{Math.round(baseDiscount)}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Category */}
          <div className="badge badge-brand" style={{ alignSelf: 'flex-start' }}>
            {product.category || 'Producto'}
          </div>

          {/* Name */}
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="product-detail-price" style={{ color: accentColor === '#4f46e5' ? '#a5b4fc' : accentColor }}>
              {formatCOP(basePrice)}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '1rem', color: 'var(--muted-400)', textDecoration: 'line-through', fontWeight: 500 }}>
                {formatCOP(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div style={{
              background: 'var(--surface-800)', border: '1px solid var(--border-subtle)',
              borderRadius: '0.85rem', padding: '1rem 1.1rem'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-500)', lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Offers */}
          <QuantityOffers
            basePrice={basePrice}
            selectedOffer={selectedOffer}
            onSelect={setSelectedOffer}
            accentColor={accentColor}
          />

          {/* Total display */}
          <div style={{
            background: 'var(--surface-800)', border: '1px solid var(--border-subtle)',
            borderRadius: '0.85rem', padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total a pagar
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-foreground)', letterSpacing: '-0.02em' }}>
                {formatCOP(finalTotal)}
              </div>
            </div>
            {selectedOffer.qty > 1 && (
              <div className="badge badge-success">
                {selectedOffer.qty} uds × {formatCOP(finalUnitPrice)} c/u
              </div>
            )}
          </div>

          {/* CTA Button — only on desktop */}
          <button
            className="btn btn-primary hide-mobile"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #7c3aed)`,
              boxShadow: `0 6px 20px ${accentColor}55`,
              width: '100%',
              minHeight: '52px',
              fontSize: '1rem',
            }}
            onClick={() => setShowForm(true)}
          >
            <ShoppingCart />
            Pedir ahora — Pago contra entrega
          </button>

          {/* COD Form (inline on desktop) */}
          {showForm && (
            <div className="animate-slide-up">
              <CodForm
                product={product}
                company={company}
                selectedOffer={selectedOffer}
                finalTotal={finalTotal}
                accentColor={accentColor}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom CTA — mobile only */}
      <div className="sticky-cta" style={{ display: showForm ? 'none' : undefined }}>
        <div className="sticky-cta-price">
          <span style={{ fontSize: '0.65rem', color: 'var(--muted-400)', fontWeight: 600, textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-foreground)' }}>
            {formatCOP(finalTotal)}
          </span>
        </div>
        <button
          className="btn btn-primary"
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${accentColor}, #7c3aed)`,
            boxShadow: `0 6px 20px ${accentColor}55`,
            minHeight: '48px'
          }}
          onClick={() => {
            setShowForm(true)
            setTimeout(() => {
              document.getElementById('cod-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
          }}
        >
          <ShoppingCart />
          Pedir ahora
        </button>
      </div>

      {/* Anchor for form scroll */}
      <div id="cod-form-anchor" style={{ marginTop: '2rem' }}>
        {showForm && (
          <div className="animate-slide-up">
            <CodForm
              product={product}
              company={company}
              selectedOffer={selectedOffer}
              finalTotal={finalTotal}
              accentColor={accentColor}
              mobile
            />
          </div>
        )}
      </div>
    </>
  )
}
