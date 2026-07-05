'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// Trust/shipping icons
const ShieldCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
)
const Truck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const Star = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

export default function StoreHeader({ company, productName }) {
  const [scrolled, setScrolled] = useState(false)
  const accentColor = company?.store_settings?.accent_color || '#4f46e5'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic tab title on tab focus/unfocus with psychological triggers
  useEffect(() => {
    let originalTitle = document.title
    let intervalId = null
    let messageIndex = 0

    // Construct highly persuasive psychological triggers based on product context
    const messages = productName 
      ? [
          `🛒 ¿Olvidaste tu ${productName}?`,
          `🔥 ¡Alguien más está viendo tu ${productName}!`,
          `⏳ Tu reserva de ${productName} vencerá pronto...`,
          `⚡ Completa tu compra y paga en casa`
        ]
      : [
          '🛒 ¿Te vas sin llevar nada hoy?',
          '🔥 ¡Pago contra entrega activo!',
          '⏳ Envíos gratis por tiempo limitado',
          '⚡ Asegura tu producto antes de que se agote'
        ]

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save current title if it's not already one of our temporary notifications
        if (!messages.includes(document.title)) {
          originalTitle = document.title
        }
        
        messageIndex = 0
        document.title = messages[0]
        
        intervalId = setInterval(() => {
          messageIndex = (messageIndex + 1) % messages.length
          document.title = messages[messageIndex]
        }, 2200)
      } else {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }
        document.title = originalTitle
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (intervalId) clearInterval(intervalId)
      document.title = originalTitle
    }
  }, [productName])

  const firstLetter = (company?.name || 'G').charAt(0).toUpperCase()

  return (
    <header
      className="store-header"
      style={{
        background: scrolled
          ? 'rgba(10,10,15,0.95)'
          : 'rgba(10,10,15,0.75)',
        boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="container-store">
        <div className="store-header-inner">

          {/* Logo + Name */}
          <Link href={`/${company?.store_slug}`} className="store-logo-wrap" style={{ gap: '0.75rem' }}>
            <div
              className="store-logo-icon"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #7c3aed)` }}
            >
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 900, position: 'relative', zIndex: 1 }}>
                {firstLetter}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="store-name">{company?.name || 'Tienda'}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--muted-400)', fontWeight: 600 }}>Tienda Oficial</div>
            </div>
          </Link>

          {/* Trust Badges */}
          <div className="trust-bar" style={{ gap: '0.4rem' }}>
            <div className="trust-pill hide-mobile">
              <ShieldCheck /> Compra Segura
            </div>
            <div className="trust-pill">
              <Truck /> Paga al recibir
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
