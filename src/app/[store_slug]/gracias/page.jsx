'use client'

import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const formatCOP = (v) =>
  v == null ? '$0' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

// Icons
const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34d399' }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const ShoppingBagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const params       = useParams()
  const storeSlug    = params.store_slug

  const invoiceId  = searchParams.get('invoiceId')
  const total      = searchParams.get('total')
  const clientName = searchParams.get('name') || ''

  const [company, setCompany]         = useState(null)
  const [accentColor, setAccentColor] = useState('#4f46e5')
  const [whatsapp, setWhatsapp]       = useState('')

  useEffect(() => {
    async function loadBrand() {
      if (!storeSlug) return
      const { data } = await supabase
        .from('companies')
        .select('name, store_settings')
        .eq('store_slug', storeSlug)
        .single()
      if (data) {
        setCompany(data)
        setAccentColor(data.store_settings?.accent_color || '#4f46e5')
        setWhatsapp(data.store_settings?.whatsapp_contact || '')
      }
    }
    loadBrand()
  }, [storeSlug])

  const handleWhatsApp = () => {
    if (!whatsapp) return
    const cleaned = whatsapp.replace(/\D/g, '')
    const msg = `Hola ${company?.name || ''}, acabo de realizar un pedido con código *${invoiceId}* por valor de *${formatCOP(total)}*. ¿Me pueden confirmar el envío? ¡Gracias!`
    window.open(`https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-900)',
      color: 'var(--text-foreground)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        opacity: 0.05, top: '-150px', left: '50%', transform: 'translateX(-50%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
        opacity: 0.06, bottom: '-80px', right: '-50px',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      {/* Card */}
      <div
        className="animate-scale-in"
        style={{
          width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1,
        }}
      >
        {/* Success icon */}
        <div className="thanks-hero">
          <div className="thanks-icon-wrap">
            <CheckCircleIcon />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            ¡Pedido recibido!
          </h1>
          {clientName && (
            <p style={{ color: 'var(--muted-500)', fontSize: '0.9rem' }}>
              Gracias, <strong style={{ color: 'var(--text-foreground)' }}>{decodeURIComponent(clientName)}</strong>. Pronto nos comunicamos contigo.
            </p>
          )}
        </div>

        {/* Details card */}
        <div className="card-surface" style={{ marginBottom: '1rem', overflow: 'hidden' }}>
          {/* Top accent */}
          <div style={{ height: '3px', background: `linear-gradient(90deg, ${accentColor}, #7c3aed)` }} />

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Reference */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Referencia</span>
              <span style={{
                fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-foreground)',
                background: 'var(--surface-700)', padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem', letterSpacing: '0.04em', border: '1px solid var(--border-subtle)'
              }}>
                {invoiceId || 'WEB-XXXXXX'}
              </span>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total a pagar</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', color: accentColor }}>
                {formatCOP(total)}
              </span>
            </div>

            {/* Payment method */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pago</span>
              <span className="badge badge-success">
                <TruckIcon /> Contra entrega
              </span>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div style={{
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(52,211,153,0.15)',
          borderRadius: '0.85rem', padding: '1rem', marginBottom: '1.25rem',
          display: 'flex', gap: '0.65rem', alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>📦</span>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-foreground)', marginBottom: '0.2rem' }}>¿Qué sigue?</div>
            <p style={{ fontSize: '0.76rem', color: 'var(--muted-500)', lineHeight: 1.6 }}>
              Estamos preparando tu pedido. Te contactaremos pronto para coordinar la entrega. Pagas en efectivo al recibir.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {whatsapp && (
            <button
              onClick={handleWhatsApp}
              className="btn"
              style={{
                width: '100%', minHeight: '50px', fontSize: '0.9rem',
                background: '#25d366', color: '#fff',
                boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
              }}
            >
              <WhatsAppIcon />
              Confirmar por WhatsApp
            </button>
          )}

          <Link
            href={`/${storeSlug}`}
            className="btn btn-secondary"
            style={{ width: '100%', minHeight: '46px', fontSize: '0.875rem' }}
          >
            <ShoppingBagIcon />
            Seguir comprando
          </Link>
        </div>

        {/* Powered by */}
        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--muted-400)', marginTop: '1.75rem' }}>
          Tecnología de{' '}
          <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontWeight: 600 }}>
            GestivaOne
          </a>
        </p>
      </div>
    </div>
  )
}
