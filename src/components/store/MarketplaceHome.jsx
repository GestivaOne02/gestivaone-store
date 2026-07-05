'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Search, ShoppingBag, Heart, ShoppingCart, User, Globe, ChevronDown,
  ChevronLeft, ChevronRight, Star, Percent, Truck, ShieldCheck,
  PhoneCall, MessageSquare, Zap, Clock, ArrowRight, Menu,
  Sparkles, Check, ExternalLink, X, MapPin, Package, CreditCard,
  BarChart3, Smartphone, Users, TrendingUp, Shield
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & MOCK DATA
   ═══════════════════════════════════════════════════════════ */

const fCOP = (v) => v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

const CATEGORIES = [
  { name: 'Tecnología', icon: '💻' },
  { name: 'Celulares', icon: '📱' },
  { name: 'Computadores', icon: '🖥️' },
  { name: 'Electrodomésticos', icon: '🔌' },
  { name: 'Hogar y Cocina', icon: '🏠' },
  { name: 'Moda', icon: '👗' },
  { name: 'Belleza', icon: '💄' },
  { name: 'Deportes', icon: '⚽' },
  { name: 'Juguetes', icon: '🧸' },
  { name: 'Mascotas', icon: '🐾' },
  { name: 'Automotriz', icon: '🚗' },
]

const TICKER_ITEMS = [
  '🚀 Crea tu tienda gratis',
  '💚 Sin tarjeta de crédito',
  '📦 Gestiona inventario',
  '💳 Controla pedidos',
  '📈 Haz crecer tu negocio',
  '🛒 Productos ilimitados',
  '🤝 Soporte personalizado',
  '📱 Comparte por WhatsApp',
  '⚡ Configuración en minutos',
]

const TICKER_ITEMS_2 = [
  '🔒 Datos respaldados y seguros',
  '📦 Envíos rápidos en Colombia',
  '🔥 +500 tiendas activas',
  '💰 0% comisiones de venta',
  '🎯 Panel administrativo completo',
  '📊 Reportes en tiempo real',
]

const MOCK_STORES = [
  { id: 'ms-1', name: 'ElectroMax', store_slug: 'electromax', store_settings: { accent_color: '#3b82f6', seo_description: 'Gadgets y tecnología importada de alta gama.', banner_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', category: 'Tecnología' }, rating: 4.8, reviews: 1205, products_count: 245 },
  { id: 'ms-2', name: 'TechStore', store_slug: 'techstore', store_settings: { accent_color: '#4f46e5', seo_description: 'Computadores de alto rendimiento y periféricos gamer.', banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', category: 'Tecnología' }, rating: 4.9, reviews: 892, products_count: 189 },
  { id: 'ms-3', name: 'Hogar Ideal', store_slug: 'hogarideal', store_settings: { accent_color: '#10b981', seo_description: 'Artículos de cocina, decoración y electrodomésticos.', banner_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', category: 'Hogar' }, rating: 4.7, reviews: 654, products_count: 312 },
  { id: 'ms-4', name: 'Moda Urbana', store_slug: 'modaurbana', store_settings: { accent_color: '#ec4899', seo_description: 'Tendencias en ropa casual y jeans urbanos.', banner_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80', category: 'Moda' }, rating: 4.6, reviews: 1104, products_count: 156 },
  { id: 'ms-5', name: 'Sport Center', store_slug: 'sportcenter', store_settings: { accent_color: '#f59e0b', seo_description: 'Implementos deportivos y ropa fitness.', banner_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80', category: 'Deportes' }, rating: 4.8, reviews: 743, products_count: 278 },
  { id: 'ms-6', name: 'Beauty Premium', store_slug: 'beautyshop', store_settings: { accent_color: '#8b5cf6', seo_description: 'Maquillaje profesional y skin care.', banner_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', category: 'Belleza' }, rating: 4.7, reviews: 532, products_count: 178 },
]

const MOCK_PRODUCTS = [
  { id: 'mp-1', name: 'Portátil Lenovo IdeaPad 3 Ryzen 5 16GB 512SSD', price: 2049900, category: 'Computadores', image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80', discount_type: 'amount', discount_value: 450000, featured: true, free_shipping: true, rating: 4.8, reviews: 124, company_id: 'ms-2' },
  { id: 'mp-2', name: 'Xiaomi Redmi Note 13 Pro 8GB RAM 256GB', price: 1059900, category: 'Celulares', image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80', discount_type: 'percentage', discount_value: 15, featured: true, free_shipping: true, rating: 4.7, reviews: 88, company_id: 'ms-1' },
  { id: 'mp-3', name: 'Audífonos JBL Tune 520BT Bluetooth 5.3', price: 199900, category: 'Tecnología', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', discount_type: 'percentage', discount_value: 30, featured: false, free_shipping: false, rating: 4.6, reviews: 256, company_id: 'ms-1' },
  { id: 'mp-4', name: 'Smartwatch Xiaomi Watch S2 AMOLED GPS', price: 729900, category: 'Tecnología', image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80', discount_type: 'percentage', discount_value: 18, featured: true, free_shipping: true, rating: 4.6, reviews: 178, company_id: 'ms-2' },
  { id: 'mp-5', name: 'Cámara Canon EOS Rebel T7 Kit 18-55mm', price: 1999900, category: 'Tecnología', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', discount_type: 'amount', discount_value: 500000, featured: true, free_shipping: true, rating: 4.7, reviews: 53, company_id: 'ms-2' },
  { id: 'mp-6', name: 'Freidora de Aire Oster 4L Digital 8 Programas', price: 399900, category: 'Hogar y Cocina', image_url: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=400&q=80', discount_type: 'percentage', discount_value: 20, featured: false, free_shipping: false, rating: 4.6, reviews: 145, company_id: 'ms-3' },
]

const HERO_SLIDES = [
  { title: 'Tecnología que transforma tu mundo', sub: 'Hasta 50% OFF en las mejores marcas. Envío gratis a todo el país.', cta: 'Ver ofertas', badge: 'MEGA OFERTAS', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Moda que define tu estilo', sub: 'Zapatillas, chaquetas y accesorios con pago contra entrega.', cta: 'Explorar colección', badge: 'TENDENCIAS 2026', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80' },
  { title: 'Equipa tu hogar con lo mejor', sub: 'Freidoras, cafeteras y licuadoras inteligentes. Garantía total.', cta: 'Comprar ahora', badge: 'HOGAR INTELIGENTE', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80' },
]

/* ═══════════════════════════════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════════════════════════════ */

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function MarketplaceHome({ initialCompanies = [], initialProducts = [] }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Todos')
  const [slide, setSlide] = useState(0)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef(null)

  // Countdown
  const [countdown, setCountdown] = useState({ h: 8, m: 45, s: 32 })
  useEffect(() => {
    const t = setInterval(() => setCountdown(p => {
      if (p.s > 0) return { ...p, s: p.s - 1 }
      if (p.m > 0) return { ...p, m: p.m - 1, s: 59 }
      if (p.h > 0) return { h: p.h - 1, m: 59, s: 59 }
      return { h: 8, m: 45, s: 32 }
    }), 1000)
    return () => clearInterval(t)
  }, [])

  // Carousel auto
  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  // Click outside dropdown
  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Merge DB data with mocks
  const stores = useMemo(() => {
    const list = [...initialCompanies]
    MOCK_STORES.forEach(m => { if (!list.some(c => c.store_slug === m.store_slug)) list.push(m) })
    return list
  }, [initialCompanies])

  const products = useMemo(() => {
    const list = [...initialProducts]
    MOCK_PRODUCTS.forEach(m => { if (!list.some(p => p.name === m.name)) list.push(m) })
    return list
  }, [initialProducts])

  const companyMap = useMemo(() => new Map(stores.map(c => [c.id, c])), [stores])

  // Derived
  const promos = useMemo(() => products.filter(p => p.discount_value > 0).slice(0, 6), [products])
  const featured = useMemo(() => products.filter(p => p.featured).slice(0, 8), [products])
  const freeShip = useMemo(() => products.filter(p => p.free_shipping || p.price >= 199900).slice(0, 6), [products])
  const allCats = useMemo(() => ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))], [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      const ms = !search || p.name.toLowerCase().includes(search.toLowerCase())
      const mc = selectedCat === 'Todos' || p.category === selectedCat
      return ms && mc
    })
  }, [products, search, selectedCat])

  const filteredStores = useMemo(() => {
    if (!search) return stores.slice(0, 12)
    return stores.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [stores, search])

  const pad = (n) => String(n).padStart(2, '0')

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <div className="min-h-screen text-gray-200 w-full overflow-x-hidden" style={{ background: '#08080d' }}>

      <div className="overflow-hidden select-none" style={{ background: 'linear-gradient(90deg, #0a0a14, #0e0e1a, #0a0a14)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.div
          className="flex items-center flex-nowrap gap-10 w-max py-2"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].map((_, loop) => (
            <div key={loop} className="flex items-center flex-nowrap gap-10 shrink-0">
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><Truck size={13} className="text-indigo-400" /><span className="text-gray-300">Envíos gratis desde $199.900</span></span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><CreditCard size={13} className="text-yellow-400" /><span className="text-gray-300">Addi · Sistecrédito · Contra entrega</span></span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><ShieldCheck size={13} className="text-emerald-400" /><span className="text-gray-300">Garantía en todos los productos</span></span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><PhoneCall size={13} className="text-sky-400" /><span className="text-gray-300">Soporte 24/7 por WhatsApp</span></span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><Shield size={13} className="text-purple-400" /><span className="text-gray-300">Compra 100% segura</span></span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><MapPin size={13} className="text-rose-400" /><span className="text-gray-300">Envíos a toda Colombia</span></span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-2 text-[11px] font-bold whitespace-nowrap"><Zap size={13} className="text-amber-400" /><span className="text-gray-300">Tu tienda online en 5 minutos</span></span>
              <span className="text-gray-600">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ──────────────────────────────────────────
          2. HEADER — buscador protagonista
      ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(8,8,13,0.95)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-[1440px] mx-auto px-8 py-5 flex items-center justify-between gap-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Zap size={20} className="text-white fill-white/20" />
            </div>
            <span className="text-lg font-black tracking-tight text-white hidden sm:block">
              gestiva<span className="text-indigo-400">.store</span>
            </span>
          </Link>

          {/* BUSCADOR (protagonista, espacioso y limpio) */}
          <div className="flex-1 max-w-2xl flex items-stretch rounded-xl overflow-hidden transition-all focus-within:border-indigo-500/30" style={{ background: '#111119', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Category dropdown */}
            <div className="relative shrink-0 hidden md:flex" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-2 px-4 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer h-full"
                style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Menu size={13} />
                <span className="hidden lg:inline">{selectedCat === 'Todos' ? 'Categorías' : selectedCat}</span>
                <ChevronDown size={11} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-xl p-1.5 z-50 shadow-2xl"
                    style={{ background: '#12121c', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {allCats.map(c => (
                      <button key={c} onClick={() => { setSelectedCat(c); setCatOpen(false) }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${selectedCat === c ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >{c}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Input */}
            <div className="flex-1 flex items-center px-4 gap-2.5">
              <Search size={16} className="text-gray-500 shrink-0" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos, marcas y tiendas..."
                className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500 font-medium py-3.5"
              />
              {search && <button onClick={() => setSearch('')} className="text-gray-500 hover:text-white cursor-pointer"><X size={15} /></button>}
            </div>
            {/* Button */}
            <button className="px-6 text-xs font-bold text-white cursor-pointer shrink-0 transition-colors hover:bg-indigo-700" style={{ background: '#4f46e5' }}>
              <Search size={16} />
            </button>
          </div>

          {/* Actions (Espaciadas y limpias) */}
          <div className="flex items-center gap-6 shrink-0 text-gray-400">
            <Link href="#" className="flex flex-col items-center gap-1 hover:text-white transition-colors p-1 hidden sm:flex">
              <ShoppingBag size={20} />
              <span className="text-[10px] font-bold tracking-wide">Pedidos</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1 hover:text-white transition-colors p-1 hidden sm:flex">
              <Heart size={20} />
              <span className="text-[10px] font-bold tracking-wide">Favoritos</span>
            </Link>
            <div className="flex flex-col items-center gap-1 hover:text-white transition-colors p-1 cursor-pointer relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full text-[9px] font-black flex items-center justify-center text-white" style={{ background: '#4f46e5' }}>3</span>
              <span className="text-[10px] font-bold tracking-wide">Carrito</span>
            </div>
            <div className="w-px h-7 bg-white/5 hidden sm:block" />
            <Link href="https://gestivaone.com/auth" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold hover:text-white transition-all hover:bg-white/5" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}>
              <User size={15} className="text-indigo-400" />
              <span>Mi cuenta</span>
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden max-w-[1440px] mx-auto px-6 pb-4">
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Search size={16} className="text-gray-500 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos, tiendas..." className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500" />
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────
          3. CATEGORY NAV STRIP — Limpio y Espacioso (Estilo Link, Sin Emojis)
      ────────────────────────────────────────── */}
      <nav style={{ background: '#0a0a12', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-[1440px] mx-auto px-8 flex items-center gap-8 overflow-x-auto no-scrollbar py-3.5">
          <button 
            onClick={() => setSelectedCat('Todos')}
            className={`text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all pb-1 border-b-2 ${selectedCat === 'Todos' ? 'text-indigo-400 border-indigo-400' : 'text-gray-400 hover:text-white border-transparent'}`}
          >
            Todos los productos
          </button>
          {CATEGORIES.map(c => (
            <button 
              key={c.name} 
              onClick={() => setSelectedCat(c.name)}
              className={`text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-all pb-1 border-b-2 flex items-center gap-1.5 ${selectedCat === c.name ? 'text-indigo-400 border-indigo-400' : 'text-gray-400 hover:text-white border-transparent'}`}
            >
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ──────────────────────────────────────────
          4. HERO — inmersivo, full width
      ────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(340px, 50vh, 520px)' }}>
        {/* Slide bg */}
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_SLIDES[slide].img})` }} />
        </AnimatePresence>
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,8,13,0.92) 0%, rgba(8,8,13,0.6) 50%, rgba(8,8,13,0.3) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #08080d 0%, transparent 40%)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl space-y-5">
            <motion.span key={`b-${slide}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="inline-block px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-white"
              style={{ background: 'rgba(79,70,229,0.8)', boxShadow: '0 0 20px rgba(79,70,229,0.3)' }}
            >{HERO_SLIDES[slide].badge}</motion.span>

            <motion.h1 key={`t-${slide}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
              className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
            >{HERO_SLIDES[slide].title}</motion.h1>

            <motion.p key={`s-${slide}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-sm text-gray-300 max-w-md leading-relaxed"
            >{HERO_SLIDES[slide].sub}</motion.p>

            <motion.div key={`c-${slide}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center gap-3">
              <button className="px-6 py-3 rounded-lg text-sm font-bold text-white cursor-pointer flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 20px rgba(79,70,229,0.4)' }}>
                {HERO_SLIDES[slide].cta} <ArrowRight size={16} />
              </button>
              <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
                className="px-4 py-3 rounded-lg text-xs font-semibold text-gray-300 hover:text-white cursor-pointer transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                Crear mi tienda
              </a>
            </motion.div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${i === slide ? 'w-8 bg-indigo-400' : 'w-3 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>

        {/* Mini promo card (desktop only) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-60 hidden xl:flex flex-col gap-4 z-20">
          {/* Payment Card */}
          <div className="rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden" 
               style={{ 
                 background: 'rgba(11,11,19,0.85)', 
                 border: '1px solid rgba(255,255,255,0.06)',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
               }}>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Paga a tu ritmo</p>
            <div className="grid grid-cols-2 gap-2">
              {/* Addi */}
              <div className="flex items-center justify-center h-8 rounded-lg text-[10px] font-black text-black tracking-tighter cursor-pointer hover:scale-105 transition-transform" 
                   style={{ background: '#E3FF00' }}
                   title="Paga con Addi">
                addi
              </div>
              {/* Sistecrédito */}
              <div className="flex items-center justify-center h-8 rounded-lg text-[9px] font-black text-white tracking-tight cursor-pointer hover:scale-105 transition-transform" 
                   style={{ background: '#004B87' }}
                   title="Paga con Sistecrédito">
                Sistecrédito
              </div>
              {/* Nequi */}
              <div className="flex items-center justify-center h-8 rounded-lg text-[10px] font-black text-[#da1c5c] tracking-tight cursor-pointer hover:scale-105 transition-transform" 
                   style={{ background: '#1E022F', border: '1px solid rgba(218,28,92,0.2)' }}
                   title="Paga con Nequi">
                nequi
              </div>
              {/* Contra Entrega */}
              <div className="flex items-center justify-center gap-1 h-8 rounded-lg text-[8px] font-extrabold text-emerald-300 cursor-pointer hover:scale-105 transition-transform" 
                   style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
                   title="Pago contra entrega">
                <Truck size={10} className="shrink-0" /> Contra entrega
              </div>
            </div>
            <p className="text-[9px] text-gray-500 text-center mt-3 font-medium">Cuotas sin interés o efectivo al recibir</p>
          </div>

          {/* Seller CTA Card */}
          <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
             className="rounded-2xl p-5 backdrop-blur-xl group cursor-pointer shadow-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
             style={{ 
               background: 'linear-gradient(135deg, rgba(79,70,229,0.25), rgba(124,58,237,0.15))', 
               border: '1px solid rgba(99,102,241,0.2)',
               boxShadow: '0 20px 40px rgba(79,70,229,0.15)'
             }}>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors" />
            
            <p className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Sparkles size={11} className="text-indigo-400" /> Vende en Gestiva
            </p>
            <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
              Crea tu tienda virtual gratis. Configuración rápida sin tarjetas.
            </p>
            <span className="text-[10px] font-black text-indigo-300 flex items-center gap-1 mt-3 group-hover:translate-x-1 transition-transform">
              Empezar ahora <ArrowRight size={11} />
            </span>
          </a>
        </div>
      </section>


      <div className="overflow-hidden select-none py-2.5" style={{ background: 'linear-gradient(90deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))' }}>
        <motion.div className="flex flex-nowrap gap-12 w-max" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 25, ease: 'linear', repeat: Infinity }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="text-[10px] font-black tracking-wider text-indigo-300/70 whitespace-nowrap">{t}</span>
          ))}
        </motion.div>
      </div>

      {/* ──────────────────────────────────────────
          MAIN CONTENT
      ────────────────────────────────────────── */}

      {search ? (
        /* ─── SEARCH RESULTS ─── */
        <main className="max-w-[1440px] mx-auto px-4 py-10 space-y-8">
          <h2 className="text-lg font-bold text-white">Resultados para &laquo;{search}&raquo;</h2>
          {filteredStores.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Tiendas ({filteredStores.length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStores.map(c => <StoreCard key={c.id} company={c} />)}
              </div>
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Productos ({filtered.length})</p>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm font-semibold text-white">Sin resultados</p>
                <p className="text-xs text-gray-500 mt-1">Prueba con otro término.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filtered.map(p => <ProductCard key={p.id} product={p} company={companyMap.get(p.company_id)} />)}
              </div>
            )}
          </div>
        </main>
      ) : selectedCat !== 'Todos' ? (
        /* ─── CATEGORY FILTER ─── */
        <main className="max-w-[1440px] mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{selectedCat}</h2>
            <span className="text-xs text-gray-500 font-semibold">{filtered.length} productos</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl mb-2">📦</p>
              <p className="text-sm font-semibold text-white">Categoría vacía</p>
              <p className="text-xs text-gray-500 mt-1">Aún no hay productos publicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} company={companyMap.get(p.company_id)} />)}
            </div>
          )}
        </main>
      ) : (
        /* ─── FULL MARKETPLACE DASHBOARD ─── */
        <div>


          {/* ─── TIENDAS DESTACADAS (horizontal scroll) ─── */}
          <Reveal>
            <section style={{ background: '#0a0a12' }} className="py-10">
              <div className="max-w-[1440px] mx-auto px-4">
                <SectionTitle emoji="🏪" title="Tiendas destacadas" link="Ver todas" />
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 mt-5">
                  {stores.slice(0, 8).map(c => (
                    <div key={c.id} className="shrink-0 w-[260px] sm:w-[300px]">
                      <StoreCard company={c} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Reveal>

          {/* ─── OFERTAS DEL DÍA ─── */}
          <Reveal>
            <section className="py-10" style={{ background: '#09090e' }}>
              <div className="max-w-[1440px] mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔥</span>
                    <div>
                      <h3 className="text-base font-black text-white">Ofertas del día</h3>
                      <p className="text-[10px] text-gray-500">Precios especiales por tiempo limitado</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                    <Clock size={13} />
                    <span>Termina en</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white" style={{ background: '#ef4444' }}>{pad(countdown.h)}</span>:
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white" style={{ background: '#ef4444' }}>{pad(countdown.m)}</span>:
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white" style={{ background: '#ef4444' }}>{pad(countdown.s)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {promos.map(p => <ProductCard key={p.id} product={p} company={companyMap.get(p.company_id)} />)}
                </div>
              </div>
            </section>
          </Reveal>

          {/* ─── BANNER GESTIVA 1 — PROMO SAAS PREMIUM ─── */}
          <Reveal>
            <section className="max-w-[1440px] mx-auto px-6 sm:px-8 py-12">
              <div 
                className="relative rounded-3xl overflow-hidden py-16 px-8 sm:px-12 lg:px-16" 
                style={{ 
                  background: 'linear-gradient(135deg, #0d0b21 0%, #151136 50%, #0d0b21 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
              >
                {/* Background glow effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column - Content */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-indigo-300 bg-indigo-500/10 border border-indigo-500/20">
                      <Sparkles size={11} /> GestivaOne · Software de Gestión
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                      ¿Tienes un negocio?<br className="hidden sm:inline" />
                      Crea tu tienda virtual hoy gratis
                    </h2>
                    
                    <p className="text-sm text-indigo-200/80 leading-relaxed max-w-xl">
                      Administra tu inventario en tiempo real, registra pedidos contra entrega, factura electrónicamente y publica automáticamente en nuestro marketplace sin complicaciones.
                    </p>
                    
                    {/* Checks row */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                        <Check size={13} /> Sin tarjeta de crédito
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                        <Check size={13} /> Listo en 5 minutos
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
                        <Check size={13} /> 0% comisiones de venta
                      </span>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="pt-2">
                      <a 
                        href="https://gestivaone.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-black text-indigo-950 bg-white hover:bg-gray-100 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
                      >
                        Probar Gestiva gratis <ArrowRight size={16} className="text-indigo-950" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column - Features Grid (2x2) */}
                  <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Package, title: 'Inventario inteligente', desc: 'Alertas de stock bajo y actualización automática.' },
                      { icon: BarChart3, title: 'Reportes en tiempo real', desc: 'Ventas, gastos y ganancias al instante.' },
                      { icon: Smartphone, title: 'Tienda virtual única', desc: 'Diseño adaptable con tu propio dominio.' },
                      { icon: Users, title: 'Fidelización de clientes', desc: 'Base de datos y campañas integradas.' },
                    ].map((f, i) => (
                      <div 
                        key={i} 
                        className="p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.03)', 
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-indigo-500/10 border border-indigo-500/20">
                          <f.icon size={16} className="text-indigo-400" />
                        </div>
                        <h4 className="text-xs font-bold text-white mb-1.5">{f.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </section>
          </Reveal>

          {/* ─── TICKER #2 ─── */}
          <div className="overflow-hidden select-none py-2.5" style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.06), rgba(52,211,153,0.06))' }}>
            <motion.div className="flex flex-nowrap gap-12 w-max" animate={{ x: ['-50%', '0%'] }} transition={{ duration: 30, ease: 'linear', repeat: Infinity }}>
              {[...TICKER_ITEMS_2, ...TICKER_ITEMS_2].map((t, i) => (
                <span key={i} className="text-[10px] font-black tracking-wider text-emerald-400/60 whitespace-nowrap">{t}</span>
              ))}
            </motion.div>
          </div>

          {/* ─── RECOMENDADOS ─── */}
          <Reveal>
            <section className="max-w-[1440px] mx-auto px-4 py-10">
              <SectionTitle emoji="⭐" title="Recomendados para ti" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5">
                {featured.map(p => <ProductCard key={p.id} product={p} company={companyMap.get(p.company_id)} />)}
              </div>
            </section>
          </Reveal>

          {/* ─── WHATSAPP ADVISOR ─── */}
          <Reveal>
            <section className="py-14" style={{ background: 'linear-gradient(180deg, #08080d 0%, #060a08 50%, #08080d 100%)' }}>
              <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: '3px solid rgba(37,211,102,0.3)' }}>
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                      alt="Asesora" className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full animate-pulse" style={{ background: '#25d366', border: '2px solid #08080d' }} />
                </div>

                {/* Chat simulation */}
                <div className="flex-1 space-y-3 max-w-lg">
                  <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-gray-300 leading-relaxed max-w-sm"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    ¡Hola! 👋 Soy Carolina del equipo de Gestiva. ¿Necesitas ayuda para crear tu tienda o configurar tus productos?
                  </div>
                  <div className="rounded-2xl rounded-bl-sm px-4 py-3 text-xs text-gray-300 leading-relaxed max-w-xs"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    Te acompaño en todo el proceso, sin costo 💚
                  </div>
                </div>

                {/* CTA */}
                <div className="shrink-0 text-center md:text-right space-y-3">
                  <h3 className="text-lg font-black text-white">¿Necesitas ayuda?</h3>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Configuramos tu tienda, subimos tus productos y te acompañamos sin costo.
                  </p>
                  <a href="https://wa.me/573022034253?text=Hola!%20Necesito%20ayuda%20para%20crear%20mi%20tienda%20en%20Gestiva"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    style={{ background: '#25d366', boxShadow: '0 4px 20px rgba(37,211,102,0.25)' }}>
                    <MessageSquare size={16} /> Hablar por WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </Reveal>

          {/* ─── BANNER GESTIVA 2 ─── */}
          <Reveal>
            <section className="relative overflow-hidden py-14" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #064e3b 100%)' }}>
              <div className="max-w-[1440px] mx-auto px-4 text-center relative z-10 max-w-2xl mx-auto space-y-5">
                <span className="inline-block px-2.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase text-emerald-300" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  CONTRA ENTREGA EN TODO COLOMBIA
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Tu tienda lista para vender en minutos
                </h2>
                <p className="text-sm text-emerald-200/70 leading-relaxed max-w-lg mx-auto">
                  Únete a Gestiva, sube tu catálogo y acepta pagos contra entrega automáticamente. Más de 500 negocios ya confían en nosotros.
                </p>
                <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold cursor-pointer transition-transform hover:scale-105"
                  style={{ background: 'white', color: '#065f46' }}>
                  Crear tienda gratis <ArrowRight size={14} />
                </a>
              </div>
            </section>
          </Reveal>

          {/* ─── ENVÍO GRATIS ─── */}
          <Reveal>
            <section className="max-w-[1440px] mx-auto px-4 py-10">
              <SectionTitle emoji="🚚" title="Productos con envío gratis" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5">
                {freeShip.map(p => <ProductCard key={p.id} product={p} company={companyMap.get(p.company_id)} />)}
              </div>
            </section>
          </Reveal>

          {/* ─── MÁS VENDIDOS ─── */}
          <Reveal>
            <section className="py-10" style={{ background: '#0a0a12' }}>
              <div className="max-w-[1440px] mx-auto px-4">
                <SectionTitle emoji="📈" title="Más vendidos" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5">
                  {products.slice(0, 6).map(p => <ProductCard key={p.id} product={p} company={companyMap.get(p.company_id)} />)}
                </div>
              </div>
            </section>
          </Reveal>

          {/* ─── FREE TRIAL CTA ─── */}
          <Reveal>
            <section className="relative overflow-hidden py-16 sm:py-24" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #1e1b4b 100%)' }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
              <div className="max-w-2xl mx-auto px-4 text-center relative z-10 space-y-6">
                <span className="inline-block px-3 py-1 rounded text-[9px] font-black tracking-widest uppercase text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  PRUEBA GESTIVA GRATIS · SIN COMPROMISO
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  Lleva tu negocio al siguiente nivel
                </h2>
                <p className="text-sm sm:text-base text-indigo-200/70 leading-relaxed max-w-lg mx-auto">
                  Sin tarjeta de crédito. Configuración en minutos. Publica productos ilimitados. Tu tienda virtual lista para facturar.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <a href="https://gestivaone.com/auth" target="_blank" rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl text-sm font-black cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl"
                    style={{ background: 'white', color: '#4c1d95' }}>
                    Crear mi tienda gratis <ArrowRight size={16} />
                  </a>
                </div>
                <p className="text-[10px] text-indigo-300/50">Listo en menos de 5 minutos · Sin tarjeta · Cancela cuando quieras</p>
              </div>
            </section>
          </Reveal>

        </div>
      )}

      {/* ──────────────────────────────────────────
          FOOTER
      ────────────────────────────────────────── */}
      <footer style={{ background: '#040407', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-[1440px] mx-auto px-4 pt-14 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  <Zap size={12} className="text-white fill-white/20" />
                </div>
                <span className="text-sm font-black text-white">gestiva<span className="text-indigo-400">.store</span></span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                Plataforma de facturación electrónica, inventarios y e-commerce para pymes y emprendedores de Colombia.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Navegación</h4>
              <div className="flex flex-col gap-2 text-xs text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Características</a>
                <a href="#" className="hover:text-white transition-colors">Planes</a>
                <a href="#soporte" className="hover:text-white transition-colors">Soporte</a>
                <a href="https://gestivaone.com" target="_blank" className="hover:text-white transition-colors">GestivaOne.com</a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legal</h4>
              <div className="flex flex-col gap-2 text-xs text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Términos y condiciones</a>
                <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-600" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span>&copy; {new Date().getFullYear()} GestivaOne. Todos los derechos reservados.</span>
            <span>Hecho con pasión en Colombia 🇨🇴</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function SectionTitle({ emoji, title, link }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-base font-black text-white">
        <span>{emoji}</span> {title}
      </h3>
      {link && <span className="text-[11px] font-semibold text-indigo-400 cursor-pointer hover:text-indigo-300">{link}</span>}
    </div>
  )
}

/* ─── Store Card ─── */
function StoreCard({ company }) {
  const accent = company.store_settings?.accent_color || '#4f46e5'
  const desc = company.store_settings?.seo_description || 'Tienda oficial en Gestiva.'
  const rating = company.rating || 4.7
  const reviews = company.reviews || 100
  const count = company.products_count || 10

  return (
    <Link href={`/${company.store_slug}`} className="block group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ background: '#0d0d18', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
      {/* Banner */}
      <div className="h-28 relative overflow-hidden">
        {company.store_settings?.banner_url ? (
          <img src={company.store_settings.banner_url} alt={company.name} className="w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}33, #0d0d18)` }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0d18 0%, transparent 60%)' }} />
      </div>
      {/* Body */}
      <div className="px-4 pb-4 relative">
        {/* Avatar */}
        <div className="-mt-7 mb-2 w-12 h-12 rounded-xl flex items-center justify-center text-base font-black text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)`, border: '3px solid #0d0d18' }}>
          {(company.name || 'G').charAt(0)}
        </div>
        <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{company.name}</h4>
        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{company.store_settings?.category || 'General'}</p>
        <p className="text-[11px] text-gray-400 leading-relaxed mt-2 line-clamp-2">{desc}</p>
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
            <Star size={10} className="text-yellow-400 fill-yellow-400" /> {rating} <span className="text-gray-600">({reviews})</span>
          </div>
          <span className="text-[9px] text-gray-500 font-medium">{count} productos</span>
        </div>
      </div>
    </Link>
  )
}

/* ─── Product Card — Estilo completo con toda la info ─── */
function ProductCard({ product, company }) {
  const hasDiscount = product.discount_value && product.discount_value > 0
  const finalPrice = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price

  const pct = hasDiscount
    ? product.discount_type === 'percentage'
      ? Math.round(product.discount_value)
      : Math.round((product.discount_value / product.price) * 100)
    : 0

  const img = product.image_url && product.image_url !== 'none' ? product.image_url : null
  const rating = product.rating || 4.5
  const reviews = product.reviews || 0
  const freeShip = product.free_shipping || product.price >= 199900
  const storeName = company?.name || 'Tienda'
  const category = product.category || ''

  return (
    <Link href={`/${company?.store_slug || 'tienda'}/p/${product.id}`}
      className="block group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: '#0d0d18', boxShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>

      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden" style={{ background: '#111118' }}>
        {img ? (
          <img src={img} alt={product.name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📦</div>
        )}

        {/* Discount badge */}
        {hasDiscount && pct > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black text-white"
            style={{ background: '#ef4444' }}>
            -{pct}%
          </span>
        )}

        {/* Free shipping badge */}
        {freeShip && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[8px] font-bold text-emerald-300 flex items-center gap-0.5"
            style={{ background: 'rgba(16,185,129,0.15)', backdropFilter: 'blur(4px)' }}>
            <Truck size={9} /> Envío gratis
          </span>
        )}
      </div>

      {/* INFO — completa */}
      <div className="p-3.5 space-y-2">
        {/* Category + Store name row */}
        <div className="flex items-center justify-between gap-2">
          {category && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 truncate">{category}</span>
          )}
          <span className="text-[9px] font-semibold text-gray-500 truncate max-w-[100px] text-right">{storeName}</span>
        </div>

        {/* Product name — full, 2 lines */}
        <h4 className="text-[12px] font-bold text-white leading-snug line-clamp-2 min-h-[34px] group-hover:text-indigo-300 transition-colors">
          {product.name}
        </h4>

        {/* Rating + reviews */}
        <div className="flex items-center gap-1.5">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[11px] font-bold text-white">{rating}</span>
          {reviews > 0 && <span className="text-[10px] text-gray-500">({reviews})</span>}
        </div>

        {/* Price */}
        <div className="pt-1 space-y-0.5">
          {hasDiscount && (
            <span className="text-[10px] text-gray-500 line-through block">{fCOP(product.price)}</span>
          )}
          <span className="text-base font-black text-white">{fCOP(finalPrice)}</span>
        </div>
      </div>
    </Link>
  )
}
