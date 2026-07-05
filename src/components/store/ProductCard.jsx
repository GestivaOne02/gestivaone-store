'use client'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'

// Utility: format price in Colombian pesos
const formatCOP = (v) =>
  v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

// Category emoji map (matching gestivaone admin)
const CATEGORY_EMOJI = {
  'Alimentos': '🍎', 'Bebidas': '🥤', 'Limpieza': '🧹', 'Higiene': '🧴',
  'Tecnología': '💻', 'Ropa': '👗', 'Calzado': '👟', 'Hogar': '🏠',
  'Mascotas': '🐾', 'Juguetes': '🧸', 'Salud': '💊', 'Belleza': '💄',
  'Deportes': '⚽', 'Papelería': '📝', 'Otros': '📦',
}

// Badge components
const DiscountBadge = ({ pct }) => (
  <span className="badge badge-danger" style={{ fontSize: '0.6rem', padding: '0.15rem 0.45rem' }}>
    -{pct}%
  </span>
)
const FeaturedBadge = () => (
  <span className="badge badge-warning" style={{ fontSize: '0.6rem', padding: '0.15rem 0.45rem' }}>
    ⭐ Destacado
  </span>
)

export default function ProductCard({ product, storeSlug, accentColor }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const color = accentColor || '#4f46e5'

  // Intersection observer for staggered entrance animation
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hasDiscount = product.discount_value && product.discount_value > 0
  const discountPct = hasDiscount
    ? product.discount_type === 'percentage'
      ? Math.round(product.discount_value)
      : Math.round((product.discount_value / product.price) * 100)
    : 0
  const finalPrice = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price

  const emoji = CATEGORY_EMOJI[product.category] || '📦'
  const imageUrl = product.image_url && product.image_url !== 'none' ? product.image_url : null

  return (
    <Link
      href={`/${storeSlug}/p/${product.id}`}
      ref={ref}
      className={`product-card${visible ? ' visible' : ''}`}
      style={{ textDecoration: 'none', '--accent': color }}
    >
      {/* Image */}
      <div className="product-card-img">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-img-placeholder">{emoji}</div>
        )}

        {/* Badges */}
        <div className="product-badges">
          {product.featured && <FeaturedBadge />}
          {hasDiscount && discountPct > 0 && <DiscountBadge pct={discountPct} />}
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <div className="product-card-category">{product.category || 'Producto'}</div>
        <div className="product-card-name">{product.name}</div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
          <div className="product-card-price">{formatCOP(finalPrice)}</div>
          {hasDiscount && (
            <div className="product-card-original-price">{formatCOP(product.price)}</div>
          )}
        </div>

        <div className="product-card-cta">
          <button
            className="btn-add-cart"
            style={{ background: `linear-gradient(135deg, ${color}, #7c3aed)` }}
            onClick={(e) => e.preventDefault()}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Ver producto
          </button>
        </div>
      </div>
    </Link>
  )
}
