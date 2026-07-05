'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

/* ─── Format Price ─── */
const fCOP = (v) => v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

/* ─── Constants ─── */
const TICKER_SAAS = [
  '🚀 Crea tu tienda gratis',
  '💚 Sin tarjeta de crédito',
  '📦 Gestiona tu inventario',
  '📈 Haz crecer tu negocio',
  '📱 Comparte por WhatsApp',
  '⚡ Configuración en 5 minutos',
  '💰 0% de comisiones por venta',
  '🚀 Crea tu tienda gratis',
  '💚 Sin tarjeta de crédito',
  '📦 Gestiona tu inventario',
  '📈 Haz crecer tu negocio'
]

const CATEGORY_ICONS = {
  'Alimentos': '🍎', 'Bebidas': '🥤', 'Limpieza': '🧹', 'Higiene': '🧴',
  'Tecnología': '💻', 'Ropa': '👗', 'Calzado': '👟', 'Hogar': '🏠',
  'Mascotas': '🐾', 'Juguetes': '🧸', 'Salud': '💊', 'Belleza': '💄',
  'Deportes': '⚽', 'Papelería': '📝', 'Otros': '📦'
}

const FAQ_ITEMS = [
  { q: '¿Qué es gestiva.store?', a: 'Es el centro comercial virtual donde se listan de forma automática todos los productos y tiendas que utilizan el software de administración GestivaOne. Aquí los clientes pueden descubrir y comprar directamente a comercios locales de toda Colombia.' },
  { q: '¿Cómo puedo crear mi propia tienda online?', a: 'Es sumamente fácil. Te registras en GestivaOne, cargas tus productos e inventario, y con un solo interruptor activas tu tienda virtual con tu propio enlace personalizado. Automáticamente tus productos aparecerán en este marketplace.' },
  { q: '¿Gestiva cobra comisiones por las ventas?', a: 'No, en lo absoluto. Gestiva es una herramienta de administración en la nube. Todas las ventas y pagos que realicen tus clientes llegan de forma directa a ti, sin intermediarios ni comisiones de plataforma.' },
  { q: '¿Qué métodos de pago puedo ofrecer a mis clientes?', a: 'El método preferido por los compradores en Colombia y configurado por defecto es el pago Contra Entrega (COD), donde el cliente paga al recibir. También puedes indicar tus datos para transferencias bancarias o integrar pasarelas en tu canal privado.' }
]

/* ─── Icons ─── */
const IC = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Store: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Chevron: ({ up }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>,
  Star: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Info: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Sparkles: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m9.9 9.9l.707-.707M10 14l2-2 2 2"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
}

/* ─── Infinite Moving Ticker Component ─── */
function InfiniteTicker() {
  return (
    <div style={{ overflow: 'hidden', background: 'rgba(79, 70, 229, 0.08)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '0.65rem 0', userSelect: 'none' }}>
      <motion.div
        style={{ display: 'flex', gap: '3rem', width: 'max-content', whiteSpace: 'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {TICKER_SAAS.map((item, idx) => (
          <span key={idx} style={{ fontSize: '0.72rem', fontWeight: 800, color: '#c7d2fe', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── FAQ Accordion Item ─── */
function FAQAccordion({ item, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.06 }} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', textAlign: 'left', padding: '1.1rem 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', color: '#fff' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e5e7eb' }}>{item.q}</span>
        <span style={{ color: open ? '#818cf8' : '#4b5563' }}><IC.Chevron up={open} /></span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height:0, opacity:0 }} transition={{ duration: 0.25 }}>
            <p style={{ fontSize: '0.825rem', color: '#9ca3af', lineHeight: 1.7, paddingBottom: '1.1rem' }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MarketplaceHome({ initialCompanies, initialProducts }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Todos')

  // Create a map to lookup companies by ID
  const companyMap = useMemo(() => {
    return new Map(initialCompanies.map(c => [c.id, c]))
  }, [initialCompanies])

  // Extract unique categories available
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category).filter(Boolean))
    return ['Todos', ...Array.from(cats)]
  }, [initialProducts])

  // Filter products based on search term & category selector
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      const matchCat = selectedCat === 'Todos' || p.category === selectedCat
      return matchSearch && matchCat
    })
  }, [initialProducts, search, selectedCat])

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!search) return initialCompanies.slice(0, 12) // Show first 12 stores if not searching
    return initialCompanies.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.store_settings?.seo_description && c.store_settings.seo_description.toLowerCase().includes(search.toLowerCase()))
    )
  }, [initialCompanies, search])

  // Partition products for sections if not searching
  const promoProducts = useMemo(() => {
    return initialProducts.filter(p => p.discount_value && p.discount_value > 0).slice(0, 8)
  }, [initialProducts])

  const featuredProducts = useMemo(() => {
    return initialProducts.filter(p => p.featured).slice(0, 8)
  }, [initialProducts])

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* ─── Top Header / Navbar ─── */}
      <header style={{ position: 'sticky', top:0, zIndex:100, backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-store" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem' }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '0.95rem' }}>
              G
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>
              gestiva<span style={{ color: '#818cf8' }}>.store</span>
            </span>
          </Link>

          {/* SaaS CTA link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-brand hide-mobile" style={{ fontSize: '0.62rem', fontWeight: 800 }}>
              🚀 {initialCompanies.length} tiendas online activas
            </span>
            <a
              href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff',
                fontSize: '0.78rem', minHeight: '34px', padding: '0.45rem 1rem', borderRadius: '0.6rem'
              }}
            >
              Crear mi tienda gratis
            </a>
          </div>

        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section style={{ position: 'relative', paddingTop: '2.5rem', paddingBottom: '2rem' }}>
        <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)', opacity: 0.8, filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="container-store" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '780px' }}>
          
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge badge-brand" style={{ marginBottom: '1rem', padding: '0.3rem 0.85rem', fontSize: '0.65rem' }}>
              ✨ Compra local en toda Colombia
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem', color: '#fff' }}>
              Descubre productos únicos y apoya a comercios independientes
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Compra directo a los negocios sin intermediarios. ¿Tienes un comercio? Crea tu propia tienda virtual y publica tus productos aquí al instante.
            </p>
          </motion.div>

          {/* Search box panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1.25rem', padding: '0.5rem', maxWidth: '540px', margin: '0 auto 1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <span style={{ color: '#6b7280', paddingLeft: '0.75rem' }}><IC.Search /></span>
            <input
              type="text"
              placeholder="Busca productos, tiendas o categorías..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none', color: '#fff',
                fontSize: '0.9rem', outline: 'none', padding: '0.6rem 0.25rem', fontFamily: 'inherit'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ×
              </button>
            )}
          </motion.div>

          {/* Quick SaaS CTA link */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <a
              href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', minHeight: '38px', padding: '0.5rem 1.1rem', borderRadius: '0.65rem' }}
            >
              💻 Registrar mi Negocio
            </a>
            <a
              href="https://wa.me/573022034253?text=Hola!%20Quiero%20saber%20mas%20sobre%20GestivaOne" target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', minHeight: '38px', padding: '0.5rem 1.1rem', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              💬 Asesoría por WhatsApp
            </a>
          </motion.div>

        </div>
      </section>

      {/* ─── Infinite SaaS Ticker ─── */}
      <InfiniteTicker />

      {/* ─── MAIN CONTENT ─── */}
      <main className="container-store" style={{ padding: '2.5rem 1rem' }}>

        {/* 1. SEARCH RESULTS VIEW (if typing something) */}
        {search ? (
          <div>
            <div className="section-header">
              <span className="section-title">Resultados de búsqueda ({filteredProducts.length + filteredCompanies.length})</span>
            </div>

            {/* Matching Stores */}
            {filteredCompanies.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                  Tiendas encontradas ({filteredCompanies.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }} className="stores-search-grid">
                  <style>{`
                    @media(min-width:640px){.stores-search-grid{grid-template-columns:repeat(2,1fr)!important}}
                    @media(min-width:1024px){.stores-search-grid{grid-template-columns:repeat(3,1fr)!important}}
                  `}</style>
                  {filteredCompanies.map(c => (
                    <StoreCard key={c.id} company={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Matching Products */}
            <div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                Productos encontrados ({filteredProducts.length})
              </h3>

              {filteredProducts.length === 0 ? (
                <div className="empty-state animate-fade-in" style={{ padding: '3rem 1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>🔍</div>
                  <div className="empty-state-title">No hay productos que coincidan</div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Prueba con otro término o explora las categorías del marketplace.</p>
                </div>
              ) : (
                <div className="products-grid stagger">
                  {filteredProducts.map(p => {
                    const comp = companyMap.get(p.company_id)
                    return <MarketProductCard key={p.id} product={p} company={comp} />
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 2. REGULAR MARKETPLACE VIEW (Dashboard) */
          <div>
            
            {/* Category Filter Quick Bar */}
            <div style={{ overflowX: 'auto', display: 'flex', gap: '0.45rem', paddingBottom: '1.25rem', marginBottom: '1.5rem', scrollbarWidth: 'none' }} className="no-scrollbar">
              {categories.map(cat => {
                const icon = CATEGORY_ICONS[cat] || '📦'
                const isSelected = selectedCat === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none',
                      padding: '0.45rem 1rem', borderRadius: '0.75rem', fontSize: '0.78rem',
                      fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                      background: isSelected ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? '#fff' : '#9ca3af',
                      border: isSelected ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <span>{icon}</span>
                    <span>{cat}</span>
                  </button>
                )
              })}
            </div>

            {/* Dynamic category filter results */}
            {selectedCat !== 'Todos' ? (
              <div>
                <div className="section-header">
                  <span className="section-title">Categoría: {selectedCat}</span>
                  <span className="section-count">{filteredProducts.length} productos</span>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="empty-state animate-fade-in">
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>📦</div>
                    <div className="empty-state-title">Categoría vacía</div>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Ninguna tienda ha publicado productos en esta sección todavía.</p>
                  </div>
                ) : (
                  <div className="products-grid stagger">
                    {filteredProducts.map(p => {
                      const comp = companyMap.get(p.company_id)
                      return <MarketProductCard key={p.id} product={p} company={comp} />
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* All sections standard view */
              <div>
                {/* ── Tiendas Destacadas ── */}
                {initialCompanies.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-header">
                      <span className="section-title">🏪 Descubre Tiendas Locales</span>
                      <span className="section-count">{initialCompanies.length} activas</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1rem' }} className="stores-grid">
                      <style>{`
                        @media(min-width:640px){.stores-grid{grid-template-columns:repeat(2,1fr)!important}}
                        @media(min-width:1024px){.stores-grid{grid-template-columns:repeat(4,1fr)!important}}
                      `}</style>
                      {initialCompanies.slice(0, 8).map(c => (
                        <StoreCard key={c.id} company={c} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Ofertas Especiales ── */}
                {promoProducts.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-header">
                      <span className="section-title">🔥 Ofertas Imperdibles</span>
                      <span className="badge badge-danger">Descuentos de hoy</span>
                    </div>
                    <div className="products-grid">
                      {promoProducts.map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <MarketProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

                {/* ── SaaS Banner Promocional 1 ── */}
                <section style={{ marginBottom: '3.5rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.04) 100%)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '1.25rem', padding: '2rem', display: 'flex', flexDirection: 'column', mdDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', textAlign: 'left' }} className="saas-banner">
                    <style>{`
                      @media(min-width:768px){.saas-banner{flex-direction:row!important}}
                    `}</style>
                    <div style={{ flex: 1 }}>
                      <span className="badge badge-brand" style={{ marginBottom: '0.75rem', fontSize: '0.62rem' }}>GESTIVAONE SAAS</span>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                        ¿Tienes un negocio y quieres vender por internet?
                      </h2>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.6, margin:0 }}>
                        Crea tu catálogo digital hoy mismo, controla tu inventario, registra pedidos y sube tus productos a este marketplace central de forma gratuita.
                      </p>
                    </div>
                    <a
                      href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ flexShrink:0 }}
                    >
                      Empezar gratis <IC.ArrowRight />
                    </a>
                  </div>
                </section>

                {/* ── Productos Destacados ── */}
                {featuredProducts.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-header">
                      <span className="section-title">⭐ Productos Recomendados</span>
                      <span className="badge badge-warning">Destacados</span>
                    </div>
                    <div className="products-grid">
                      {featuredProducts.map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <MarketProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

                {/* ── Todos los Productos (Feed General) ── */}
                {initialProducts.length > 0 && (
                  <div style={{ marginBottom: '3rem' }}>
                    <div className="section-header">
                      <span className="section-title">📦 Catálogo del Marketplace</span>
                      <span className="section-count">{initialProducts.length} productos</span>
                    </div>
                    <div className="products-grid">
                      {initialProducts.slice(0, 16).map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <MarketProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* ─── WhatsApp Assesor Support Banner ─── */}
      <section style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '3.5rem 0' }}>
        <div className="container-store" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>💚</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            ¿Necesitas ayuda para montar tu negocio?
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Nuestro equipo de asesores de GestivaOne te acompaña de forma gratuita en la configuración de tus inventarios, creación de la tienda y conexión con el catálogo.
          </p>
          <a
            href="https://wa.me/573022034253?text=Hola!%20Necesito%20ayuda%20para%20crear%20mi%20tienda%20en%20Gestiva"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ background: '#25d366', boxShadow: '0 6px 20px rgba(37,211,102,0.3)', minHeight: '48px', fontSize: '0.9rem' }}
          >
            <IC.Phone /> Chatear con un Asesor
          </a>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container-store" style={{ maxWidth: '720px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Preguntas frecuentes</h2>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>Todo lo que necesitas saber sobre el funcionamiento del catálogo.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '1.25rem', padding: '0.5rem 1.5rem' }}>
            {FAQ_ITEMS.map((item, idx) => (
              <FAQAccordion key={idx} item={item} i={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SaaS Trial Banner 2 ─── */}
      <section style={{ paddingBottom: '4rem' }}>
        <div className="container-store">
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)', filter: 'blur(30px)' }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', marginBottom: '0.75rem' }}>
                🚀 EMPIEZA HOY GRATIS
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                Vende por internet sin pagar comisiones
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Prueba GestivaOne por 14 días. No requiere tarjeta de crédito. Cancela en cualquier momento.
              </p>
              <a
                href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
                className="btn"
                style={{ background: '#fff', color: '#059669', fontWeight: 900, boxShadow: '0 8px 20px rgba(0,0,0,0.15)', minHeight: '46px' }}
              >
                Crear Mi Cuenta Ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marketplace Footer ─── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 1rem', background: '#07070a', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.4rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '0.8rem' }}>
            G
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            gestiva<span style={{ color: '#818cf8' }}>.store</span>
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: '#4b5563', lineHeight: 1.6 }}>
          © {new Date().getFullYear()} GestivaOne. Todos los derechos reservados. <br />
          Plataforma de facturación, inventarios y canales virtuales para pymes y emprendedores de Colombia.
        </p>
      </footer>

    </div>
  )
}

/* ─── Sub-Component: Store Card ─── */
function StoreCard({ company }) {
  const accent = company.store_settings?.accent_color || '#4f46e5'
  const desc = company.store_settings?.seo_description || 'Explora nuestra tienda oficial en Gestiva y haz tus pedidos.'
  
  return (
    <Link
      href={`/${company.store_slug}`}
      className="card-surface-hover"
      style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', textDecoration: 'none', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '0.65rem',
            background: `linear-gradient(135deg, ${accent}, #7c3aed)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 900, color: '#fff', flexShrink: 0
          }}
        >
          {(company.name || 'G').charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {company.name}
          </h4>
          <span style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>🏪 Tienda Oficial</span>
        </div>
      </div>

      <p style={{ fontSize: '0.74rem', color: '#9ca3af', lineHeight: 1.5, margin: '0 0 1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
        {desc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize: '#4b5563', fontSize: '0.65rem', fontWeight: 700, color: '#818cf8' }}>
          Ver Catálogo
        </span>
        <span style={{ color: accent }}><IC.ArrowRight /></span>
      </div>
    </Link>
  )
}

/* ─── Sub-Component: Marketplace Product Card ─── */
function MarketProductCard({ product, company }) {
  const hasDiscount = product.discount_value && product.discount_value > 0
  const finalPrice = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price

  const accentColor = company?.store_settings?.accent_color || '#4f46e5'
  const emoji = CATEGORY_ICONS[product.category] || '📦'
  const imageUrl = product.image_url && product.image_url !== 'none' ? product.image_url : null

  return (
    <Link
      href={`/${company?.store_slug}/p/${product.id}`}
      className="product-card visible animate-scale-in"
      style={{ textDecoration: 'none' }}
    >
      <div className="product-card-img" style={{ background: 'var(--surface-700)', position: 'relative' }}>
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="product-card-img-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.5rem' }}>
            {emoji}
          </div>
        )}

        <div className="product-badges">
          {product.featured && <span className="badge badge-warning" style={{ fontSize: '0.58rem' }}>⭐ Destacado</span>}
          {hasDiscount && <span className="badge badge-danger" style={{ fontSize: '0.58rem' }}>-{product.discount_type === 'percentage' ? Math.round(product.discount_value) : Math.round((product.discount_value/product.price)*100)}%</span>}
        </div>
      </div>

      <div className="product-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <span className="product-card-category" style={{ fontSize: '0.62rem' }}>{product.category || 'Catálogo'}</span>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: accentColor, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '80px' }}>
            {company?.name || 'Tienda'}
          </span>
        </div>

        <h4 className="product-card-name" style={{ fontSize: '0.8rem', fontWeight: 700, minHeight: '36px' }}>{product.name}</h4>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: 'auto' }}>
          <span className="product-card-price" style={{ fontSize: '0.95rem' }}>{fCOP(finalPrice)}</span>
          {hasDiscount && <span className="product-card-original-price" style={{ fontSize: '0.68rem' }}>{fCOP(product.price)}</span>}
        </div>
      </div>
    </Link>
  )
}
