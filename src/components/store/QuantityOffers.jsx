'use client'

const formatCOP = (v) =>
  v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

const OFFERS = [
  { qty: 1,  discount: 0,  label: '1 unidad',   highlight: false },
  { qty: 2,  discount: 10, label: '2 unidades',  highlight: false },
  { qty: 3,  discount: 20, label: '3 unidades',  highlight: true, tag: 'Más popular' },
]

const CheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

export default function QuantityOffers({ basePrice, selectedOffer, onSelect, accentColor }) {
  const color = accentColor || '#4f46e5'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{
        fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted-500)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem'
      }}>
        Ofertas por cantidad
      </div>

      {OFFERS.map((offer) => {
        const unitPrice = basePrice * (1 - offer.discount / 100)
        const total = unitPrice * offer.qty
        const isSelected = selectedOffer.qty === offer.qty
        const savings = offer.discount > 0 ? basePrice * (offer.discount / 100) * offer.qty : 0

        return (
          <button
            key={offer.qty}
            onClick={() => onSelect({ qty: offer.qty, discount: offer.discount })}
            className={`quantity-offer-card${isSelected ? ' selected' : ''}`}
            style={{
              width: '100%', cursor: 'pointer', textAlign: 'left', position: 'relative',
              ...(isSelected ? {
                borderColor: color,
                background: `${color}12`,
                boxShadow: `0 0 0 1px ${color}33, 0 4px 12px ${color}22`,
              } : {}),
            }}
          >
            {/* Popular tag */}
            {offer.highlight && (
              <span className="badge badge-success" style={{
                position: 'absolute', top: '-8px', right: '10px',
                fontSize: '0.58rem', padding: '0.15rem 0.5rem'
              }}>
                ⭐ {offer.tag}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              {/* Left */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                {/* Check circle */}
                <div style={{
                  width: '1.4rem', height: '1.4rem', borderRadius: '50%', flexShrink: 0,
                  background: isSelected ? color : 'var(--surface-700)',
                  border: `2px solid ${isSelected ? color : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {isSelected && <CheckCircle />}
                </div>

                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--text-foreground)', lineHeight: 1.2 }}>
                    {offer.label}
                    {offer.discount > 0 && (
                      <span className="badge badge-danger" style={{ marginLeft: '0.4rem', fontSize: '0.58rem', verticalAlign: 'middle' }}>
                        -{offer.discount}%
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <div style={{ fontSize: '0.67rem', color: 'var(--success-400)', fontWeight: 600, marginTop: '0.1rem' }}>
                      Ahorras {formatCOP(savings)}
                    </div>
                  )}
                </div>
              </div>

              {/* Right — price */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--text-foreground)', letterSpacing: '-0.02em' }}>
                  {formatCOP(total)}
                </div>
                {offer.qty > 1 && (
                  <div style={{ fontSize: '0.62rem', color: 'var(--muted-400)', fontWeight: 500 }}>
                    {formatCOP(unitPrice)} c/u
                  </div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
