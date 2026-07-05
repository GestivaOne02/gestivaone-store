'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Search, ShoppingBag, Heart, ShoppingCart, User, Globe, ChevronDown,
  ChevronLeft, ChevronRight, Star, Percent, Truck, ShieldCheck, HelpCircle,
  PhoneCall, MessageSquare, Zap, Clock, ArrowRight, Lock, Plus, Menu, Store,
  Languages, Tag, Sparkles, Check, Play, ExternalLink
} from 'lucide-react'

/* ─── Format Price ─── */
const fCOP = (v) => v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

/* ─── Category Emoji / Details ─── */
const CATEGORIES_LIST = [
  { name: 'Tecnología', icon: '💻', count: 145 },
  { name: 'Computadores', icon: '🖥️', count: 89 },
  { name: 'Celulares y Tablets', icon: '📱', count: 210 },
  { name: 'Electrodomésticos', icon: '🔌', count: 64 },
  { name: 'Hogar y Cocina', icon: '🏠', count: 320 },
  { name: 'Moda y Accesorios', icon: '👗', count: 540 },
  { name: 'Belleza y Cuidado', icon: '💄', count: 180 },
  { name: 'Deportes y Aire libre', icon: '⚽', count: 95 },
  { name: 'Juguetes y Niños', icon: '🧸', count: 120 },
  { name: 'Mascotas', icon: '🐾', count: 75 },
  { name: 'Automotriz', icon: '🚗', count: 42 }
]

const TICKER_TEXTS_1 = [
  '🚀 CREA TU TIENDA ONLINE GRATIS EN GESTIVA',
  '💚 SIN TARJETA DE CRÉDITO NI COSTOS OCULTOS',
  '📦 GESTIONA TU INVENTARIO EN TIEMPO REAL',
  '💳 CONTROLA PEDIDOS CONTRA ENTREGA (COD)',
  '📈 HAZ CRECER TU NEGOCIO DESDE HOY',
  '🛒 PUBLICA PRODUCTOS ILIMITADOS SIN LÍMITE'
]

const TICKER_TEXTS_2 = [
  '⚡ CONFIGURACIÓN EN SOLO MINUTOS',
  '🤝 SOPORTE PERSONALIZADO POR WHATSAPP',
  '📱 COMPARTE TU ENLACE POR REDES SOCIALES',
  '📦 ENVÍOS RÁPIDOS EN TODA COLOMBIA',
  '🔒 DATOS RESPALDADOS Y SEGUROS',
  '🔥 ÚNETE A LAS MÁS DE 500 TIENDAS ACTIVAS'
]

// Fallback high-quality mock stores
const MOCK_COMPANIES = [
  {
    id: 'mock-1',
    name: 'ElectroMax Colombia',
    store_slug: 'electromax',
    logo_url: '',
    store_settings: {
      accent_color: '#3b82f6',
      seo_description: 'Especialistas en gadgets y tecnología importada de alta gama. Los mejores precios del mercado.',
      banner_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      category: 'Tecnología'
    },
    rating: 4.8,
    reviews: 1205,
    products_count: 245
  },
  {
    id: 'mock-2',
    name: 'TechStore Bogotá',
    store_slug: 'techstore',
    logo_url: '',
    store_settings: {
      accent_color: '#4f46e5',
      seo_description: 'Tu tienda de confianza para computadores de alto rendimiento y periféricos gamer.',
      banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
      category: 'Tecnología'
    },
    rating: 4.9,
    reviews: 892,
    products_count: 189
  },
  {
    id: 'mock-3',
    name: 'Hogar Ideal',
    store_slug: 'hogarideal',
    logo_url: '',
    store_settings: {
      accent_color: '#10b981',
      seo_description: 'Todo lo que necesitas para tu hogar. Artículos de cocina, decoración y electrodomésticos.',
      banner_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
      category: 'Hogar y Cocina'
    },
    rating: 4.7,
    reviews: 654,
    products_count: 312
  },
  {
    id: 'mock-4',
    name: 'Moda Urbana Jeans',
    store_slug: 'modaurbana',
    logo_url: '',
    store_settings: {
      accent_color: '#ec4899',
      seo_description: 'Últimas tendencias en ropa casual, jeans y chaquetas de colección urbana para jóvenes.',
      banner_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
      category: 'Moda y Accesorios'
    },
    rating: 4.6,
    reviews: 1104,
    products_count: 156
  },
  {
    id: 'mock-5',
    name: 'Sport Center',
    store_slug: 'sportcenter',
    logo_url: '',
    store_settings: {
      accent_color: '#f59e0b',
      seo_description: 'Implementos deportivos, tenis para running, pesas y ropa fitness para atletas de alto nivel.',
      banner_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80',
      category: 'Deportes'
    },
    rating: 4.8,
    reviews: 743,
    products_count: 278
  },
  {
    id: 'mock-6',
    name: 'Beauty Shop Premium',
    store_slug: 'beautyshop',
    logo_url: '',
    store_settings: {
      accent_color: '#8b5cf6',
      seo_description: 'Maquillaje profesional, cuidado capilar y productos de skin care de las marcas más reconocidas.',
      banner_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80',
      category: 'Belleza y Cuidado'
    },
    rating: 4.7,
    reviews: 532,
    products_count: 178
  }
]

// Fallback high-quality mock products
const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Portátil Lenovo IdeaPad 3 AMD Ryzen 5',
    price: 2049900,
    category: 'Computadores',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
    show_in_store: true,
    discount_type: 'amount',
    discount_value: 450000,
    featured: true,
    free_shipping: true,
    rating: 4.8,
    reviews: 124,
    company_id: 'mock-2'
  },
  {
    id: 'prod-2',
    name: 'Xiaomi Redmi Note 13 Pro 8GB/256GB',
    price: 1059900,
    category: 'Celulares y Tablets',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
    show_in_store: true,
    discount_type: 'percentage',
    discount_value: 15,
    featured: true,
    free_shipping: true,
    rating: 4.7,
    reviews: 88,
    company_id: 'mock-1'
  },
  {
    id: 'prod-3',
    name: 'Audífonos JBL Tune 520BT Bluetooth',
    price: 199900,
    category: 'Tecnología',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    show_in_store: true,
    discount_type: 'percentage',
    discount_value: 30,
    featured: false,
    free_shipping: false,
    rating: 4.6,
    reviews: 256,
    company_id: 'mock-1'
  },
  {
    id: 'prod-4',
    name: 'Reloj Xiaomi Watch S2 Pantalla AMOLED',
    price: 729900,
    category: 'Tecnología',
    image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80',
    show_in_store: true,
    discount_type: 'percentage',
    discount_value: 18,
    featured: true,
    free_shipping: true,
    rating: 4.6,
    reviews: 178,
    company_id: 'mock-2'
  },
  {
    id: 'prod-5',
    name: 'Cámara Canon EOS Rebel T7 Reflex',
    price: 1999900,
    category: 'Tecnología',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    show_in_store: true,
    discount_type: 'amount',
    discount_value: 500000,
    featured: true,
    free_shipping: true,
    rating: 4.7,
    reviews: 53,
    company_id: 'mock-2'
  },
  {
    id: 'prod-6',
    name: 'Freidora de Aire Oster 4L Digital',
    price: 599900,
    category: 'Hogar y Cocina',
    image_url: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&w=400&q=80',
    show_in_store: true,
    discount_type: 'percentage',
    discount_value: 20,
    featured: false,
    free_shipping: false,
    rating: 4.6,
    reviews: 145,
    company_id: 'mock-3'
  }
]

export default function MarketplaceHome({ initialCompanies = [], initialProducts = [] }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Todos')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Countdown timer for "Ofertas del día"
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 32 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else {
          return { hours: 8, minutes: 45, seconds: 32 } // reset
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto carousel rotation
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(slideInterval)
  }, [])

  // Merge database items with beautiful fallback mocks so page looks extremely complete
  const allCompanies = useMemo(() => {
    const list = [...initialCompanies]
    // Filter duplicates
    MOCK_COMPANIES.forEach(m => {
      if (!list.some(c => c.store_slug === m.store_slug || c.name === m.name)) {
        list.push(m)
      }
    })
    return list
  }, [initialCompanies])

  const allProducts = useMemo(() => {
    const list = [...initialProducts]
    MOCK_PRODUCTS.forEach(m => {
      if (!list.some(p => p.name === m.name)) {
        list.push(m)
      }
    })
    return list
  }, [initialProducts])

  // Lookups
  const companyMap = useMemo(() => {
    return new Map(allCompanies.map(c => [c.id, c]))
  }, [allCompanies])

  // Extract unique categories available
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map(p => p.category).filter(Boolean))
    return ['Todos', ...Array.from(cats)]
  }, [allProducts])

  // Filter products based on search term & category selector
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      const matchCat = selectedCat === 'Todos' || p.category === selectedCat
      return matchSearch && matchCat
    })
  }, [allProducts, search, selectedCat])

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!search) return allCompanies.slice(0, 12)
    return allCompanies.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.store_settings?.seo_description && c.store_settings.seo_description.toLowerCase().includes(search.toLowerCase()))
    )
  }, [allCompanies, search])

  // Partition products for sections
  const promoProducts = useMemo(() => {
    return allProducts.filter(p => p.discount_value && p.discount_value > 0).slice(0, 6)
  }, [allProducts])

  const featuredProducts = useMemo(() => {
    return allProducts.filter(p => p.featured).slice(0, 6)
  }, [allProducts])

  const freeShippingProducts = useMemo(() => {
    return allProducts.filter(p => p.free_shipping || p.price >= 199900).slice(0, 6)
  }, [allProducts])

  const bestSellers = useMemo(() => {
    return [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 6)
  }, [allProducts])

  const newStores = useMemo(() => {
    return allCompanies.slice(0, 4)
  }, [allCompanies])

  const carouselSlides = [
    {
      title: 'Tecnología que transforma tu mundo',
      desc: 'Las mejores marcas con hasta 50% OFF y envíos gratis a todo el país.',
      btnText: 'Ver ofertas de Tecnología',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      badge: 'MEGA OFERTAS',
      color: 'from-blue-600/90 to-indigo-900/95'
    },
    {
      title: 'Moda que define tu propio estilo',
      desc: 'Zapatillas, chaquetas y accesorios urbanos con pago contra entrega en casa.',
      btnText: 'Explorar Colección',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      badge: 'TENDENCIAS 2026',
      color: 'from-pink-600/90 to-purple-900/95'
    },
    {
      title: 'Equipa tu hogar con lo mejor',
      desc: 'Freidoras, cafeteras y licuadoras inteligentes. Garantía asegurada.',
      btnText: 'Comprar Hogar',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      badge: 'CASA INTELIGENTE',
      color: 'from-emerald-600/90 to-teal-900/95'
    }
  ]

  return (
    <div className="min-h-screen bg-[#06060a] text-gray-100 font-sans selection:bg-brand-500 selection:text-white pb-10">
      
      {/* ─── 1. TOP BENEFITS BAR ─── */}
      <div className="bg-surface-900/90 border-b border-white/5 py-2 px-4 text-[10px] sm:text-xs text-muted-500 font-medium">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
            <span className="flex items-center gap-1.5 text-brand-300">
              <Truck size={12} className="text-brand-400" />
              Envíos gratis en pedidos superiores a $199.900
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-yellow-400" />
              Paga con Addi, Sistecrédito o Contra entrega
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-success-400" />
              Garantía en todos nuestros productos
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <a href="#soporte" className="hover:text-brand-400 transition-colors">Soporte 24/7</a>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-brand-400">
              <Globe size={11} />
              CO (COP)
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. STICKY MAIN HEADER ─── */}
      <header className="sticky top-0 z-50 bg-[#06060a]/90 backdrop-blur-xl border-b border-white/5 py-4 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center font-black text-brand-400 text-lg shadow-[0_0_15px_rgba(79,70,229,0.15)]">
              <Zap size={18} className="text-brand-400 fill-brand-400/20" />
            </div>
            <span className="text-lg font-black tracking-tight text-white uppercase sm:block">
              gestiva<span className="text-brand-400 font-extrabold">.store</span>
            </span>
          </Link>

          {/* Buscador y Dropdown de Categorías */}
          <div className="flex-1 max-w-2xl hidden md:flex items-center bg-surface-800 border border-white/5 hover:border-brand-500/30 rounded-xl overflow-hidden shadow-inner transition-all group">
            
            {/* Categorías Dropdown */}
            <div className="relative shrink-0 border-r border-white/5">
              <select
                value={selectedCat}
                onChange={e => setSelectedCat(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold text-gray-300 py-3 pl-4 pr-8 focus:ring-0 focus:outline-none cursor-pointer hover:text-white"
              >
                <option value="Todos">Todas las categorías</option>
                {categories.filter(c => c !== 'Todos').map(c => (
                  <option key={c} value={c} className="bg-surface-800">{c}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 flex items-center pl-3">
              <Search size={16} className="text-gray-500 mr-2 shrink-0 group-hover:text-brand-400 transition-colors" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Busca productos, tiendas o marcas en Colombia..."
                className="w-full bg-transparent text-xs py-3 text-white border-none outline-none focus:ring-0 placeholder:text-gray-500 font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="bg-white/10 hover:bg-white/20 hover:text-white text-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] mr-3 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => {}}
              className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-5 py-3 h-full cursor-pointer transition-colors"
            >
              Buscar
            </button>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-5 shrink-0">
            
            {/* Pedidos */}
            <Link href="#pedidos" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-semibold relative py-1">
              <ShoppingBag size={16} />
              <span className="hidden lg:inline">Pedidos</span>
            </Link>

            {/* Favoritos */}
            <Link href="#favoritos" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-semibold relative py-1">
              <Heart size={16} />
              <span className="hidden lg:inline">Favoritos</span>
            </Link>

            {/* Carrito */}
            <div className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-semibold relative py-1 cursor-pointer">
              <div className="relative">
                <ShoppingCart size={16} />
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#06060a]">
                  3
                </span>
              </div>
              <span className="hidden lg:inline">Carrito</span>
            </div>

            <span className="text-white/10 hidden sm:inline">|</span>

            {/* Perfil / Cuenta */}
            <Link href="https://gestivaone.com/auth" target="_blank" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 border border-white/5 hover:border-brand-500/20 text-xs font-bold text-gray-200 transition-all">
              <User size={14} className="text-brand-400" />
              <span>Mi cuenta</span>
              <ChevronDown size={12} className="text-gray-500" />
            </Link>
          </div>
        </div>

        {/* Móvil: Buscador visible en segunda línea */}
        <div className="max-w-[1400px] mx-auto mt-3 md:hidden flex items-center bg-surface-800 border border-white/5 rounded-xl overflow-hidden shadow-inner px-3">
          <Search size={16} className="text-gray-500 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Busca productos, tiendas o categorías..."
            className="w-full bg-transparent text-xs py-2 text-white border-none outline-none focus:ring-0 placeholder:text-gray-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="bg-white/10 text-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] ml-2 cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
      </header>

      {/* ─── 3. HERO GRID COMPOSICIÓN (100% ANCHO DE PANTALLA) ─── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Col 1: Categorías Sidebar (Menú Lateral) */}
          <div className="lg:col-span-3 bg-surface-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shrink-0 hidden lg:flex">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-gray-300 tracking-wider pb-3 border-b border-white/5 mb-3">
                <Menu size={14} className="text-brand-400" />
                <span>Todas las categorías</span>
              </div>
              <div className="flex flex-col gap-1">
                {CATEGORIES_LIST.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCat(cat.name)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      selectedCat === cat.name
                        ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-surface-800 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[9px] text-gray-600 bg-surface-800 px-1.5 py-0.5 rounded">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedCat('Todos')}
              className="w-full text-center py-2.5 mt-4 bg-surface-800 hover:bg-surface-700 text-xs font-bold text-gray-400 hover:text-white rounded-xl border border-white/5 transition-colors cursor-pointer"
            >
              Ver todas las categorías
            </button>
          </div>

          {/* Col 2: Banner Principal / Carrusel */}
          <div className="lg:col-span-6 rounded-2xl relative overflow-hidden min-h-[300px] lg:min-h-full flex flex-col justify-end p-6 sm:p-10 border border-white/5 shadow-2xl">
            {/* Background Slides */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${carouselSlides[currentSlide].img})` }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-[#06060a]/75 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-900/90 via-transparent to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 space-y-4 max-w-lg">
              <span className="inline-block bg-brand-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)] animate-pulse">
                {carouselSlides[currentSlide].badge}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {carouselSlides[currentSlide].title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 drop-shadow">
                {carouselSlides[currentSlide].desc}
              </p>
              
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setSelectedCat('Todos')}
                  className="btn btn-primary text-xs flex items-center gap-1 px-5 py-2.5 cursor-pointer shadow-lg hover:shadow-brand-500/20"
                >
                  <span>{carouselSlides[currentSlide].btnText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-5 right-5 flex items-center gap-2 z-20">
              {carouselSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === i ? 'bg-brand-400 w-6' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Col 3: Promociones / SaaS Stack Lateral */}
          <div className="lg:col-span-3 flex flex-col gap-6 justify-between items-stretch">
            
            {/* Card Superior: Paga como prefieras */}
            <div className="bg-surface-900 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4 flex-1">
              <div>
                <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">Paga como prefieras</h3>
                <p className="text-[11px] text-gray-500 leading-normal mb-4">
                  Compra de forma flexible en cualquier tienda del marketplace con múltiples alternativas seguras.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-800/80 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center justify-center font-bold text-[10px] text-white">
                    Addi
                  </div>
                  <div className="bg-surface-800/80 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center justify-center font-bold text-[10px] text-white">
                    Sistecrédito
                  </div>
                  <div className="bg-surface-800/80 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center justify-center font-bold text-[10px] text-white">
                    Mercado Pago
                  </div>
                  <div className="bg-surface-800/80 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center justify-center font-bold text-[10px] text-white">
                    Contra entrega
                  </div>
                </div>
              </div>
              <Link href="#pagos" className="text-[10px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start mt-2">
                <span>Ver métodos de pago</span>
                <ChevronRight size={11} />
              </Link>
            </div>

            {/* Card Inferior: Vende con Gestiva */}
            <div className="bg-gradient-to-br from-brand-600/90 to-indigo-900/95 border border-brand-500/20 rounded-2xl p-5 flex flex-col justify-between gap-3 flex-1 relative overflow-hidden group">
              <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              
              <div className="space-y-1">
                <span className="inline-block bg-white/10 text-white font-black text-[8px] tracking-widest px-2 py-0.5 rounded uppercase">
                  Crea tu Tienda
                </span>
                <h3 className="text-sm font-black text-white leading-tight">Vende con Gestiva</h3>
                <p className="text-[10px] text-brand-200 leading-normal">
                  Crea tu tienda virtual hoy, gestiona tu stock y publica tus productos en este marketplace.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="https://gestivaone.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2 bg-white text-brand-700 text-[10px] font-black hover:bg-brand-50 rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  Crear mi tienda gratis
                </a>
                <span className="text-[8px] text-brand-300 text-center block">Sin tarjetas · Configuración en 5 min</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 4. TRUST BADGES ROW ─── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-surface-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 text-brand-400">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Envíos gratis</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">En pedidos desde $199.900</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-l-0 sm:border-l border-white/5 pl-0 sm:pl-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 text-brand-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Paga seguro</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Tus compras protegidas</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-l-0 lg:border-l border-white/5 pl-0 lg:pl-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 text-brand-400">
              <Zap size={18} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Garantía total</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">30 días de garantía total</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-l-0 sm:border-l border-white/5 pl-0 sm:pl-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 text-brand-400">
              <PhoneCall size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Soporte 24/7</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Estamos para ayudarte</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. INFINITE MOVING TICKERS (BARRAS ANIMADAS EN DIVERSOS COLORES) ─── */}
      <section className="mt-8 space-y-3 overflow-hidden select-none">
        
        {/* Ticker 1: Purple Theme */}
        <div className="bg-brand-600/10 border-t border-b border-brand-500/20 py-2.5">
          <motion.div
            className="flex gap-16 w-max white-space-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
          >
            {[...TICKER_TEXTS_1, ...TICKER_TEXTS_1].map((text, i) => (
              <span key={i} className="text-[10px] font-black text-brand-300 tracking-wider flex items-center gap-2">
                <Sparkles size={11} className="text-yellow-400 animate-spin" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Ticker 2: Emerald Theme */}
        <div className="bg-emerald-600/10 border-t border-b border-emerald-500/20 py-2.5">
          <motion.div
            className="flex gap-16 w-max white-space-nowrap"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          >
            {[...TICKER_TEXTS_2, ...TICKER_TEXTS_2].map((text, i) => (
              <span key={i} className="text-[10px] font-black text-emerald-400 tracking-wider flex items-center gap-2">
                <Check size={11} className="text-emerald-500" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>

      </section>

      {/* ─── 6. MAIN EXPLORATION MARKETPLACE ─── */}
      <main className="max-w-[1400px] mx-auto px-4 mt-10">

        {/* CATEGORY SELECTOR CAROUSEL (Rápido & Circular) */}
        <div className="mb-10">
          <div className="section-header">
            <span className="section-title">📂 Categorías populares</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {CATEGORIES_LIST.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCat(cat.name)}
                className={`flex flex-col items-center gap-3 bg-surface-900 border px-6 py-5 rounded-2xl min-w-[110px] text-center transition-all cursor-pointer ${
                  selectedCat === cat.name
                    ? 'border-brand-500 bg-brand-500/10 text-white'
                    : 'border-white/5 hover:border-brand-500/30 text-gray-400 hover:text-white hover:bg-surface-800'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold tracking-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* IF SEARCH IS ACTIVE */}
        {search ? (
          <div className="space-y-10">
            <div className="section-header">
              <span className="section-title">🔍 Resultados para «{search}» ({filteredProducts.length + filteredCompanies.length})</span>
            </div>

            {/* Stores */}
            {filteredCompanies.length > 0 && (
              <div>
                <h3 className="text-xs font-extrabold uppercase text-brand-400 tracking-wider mb-4">Tiendas encontradas ({filteredCompanies.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map(c => (
                    <StoreCard key={c.id} company={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            <div>
              <h3 className="text-xs font-extrabold uppercase text-brand-400 tracking-wider mb-4">Productos encontrados ({filteredProducts.length})</h3>
              {filteredProducts.length === 0 ? (
                <div className="bg-surface-900 border border-white/5 rounded-2xl text-center py-12 px-4">
                  <span className="text-3xl block mb-2">🔍</span>
                  <h4 className="text-sm font-bold text-white mb-1">Sin coincidencias</h4>
                  <p className="text-xs text-gray-500">Prueba ajustando el término de búsqueda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredProducts.map(p => {
                    const comp = companyMap.get(p.company_id)
                    return <ProductCard key={p.id} product={p} company={comp} />
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* STANDARD CATEGORIZED CONTENT */
          <div className="space-y-12">
            
            {selectedCat !== 'Todos' ? (
              <div>
                <div className="section-header">
                  <span className="section-title">Resultados de «{selectedCat}»</span>
                  <span className="section-count">{filteredProducts.length}</span>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="bg-surface-900 border border-white/5 rounded-2xl text-center py-12">
                    <span className="text-3xl block mb-2">📦</span>
                    <h4 className="text-sm font-bold text-white mb-1">Categoría vacía</h4>
                    <p className="text-xs text-gray-500">Aún no hay productos en esta sección.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredProducts.map(p => {
                      const comp = companyMap.get(p.company_id)
                      return <ProductCard key={p.id} product={p} company={comp} />
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* DASHBOARD FULL SECTIONS */
              <div className="space-y-12">
                
                {/* A. TIENDAS DESTACADAS */}
                <div>
                  <div className="section-header">
                    <span className="section-title">🏪 Tiendas destacadas</span>
                    <span className="text-[10px] font-bold text-brand-400 cursor-pointer hover:text-brand-300">Ver todas</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCompanies.slice(0, 6).map(c => (
                      <StoreCard key={c.id} company={c} />
                    ))}
                  </div>
                </div>

                {/* B. OFERTAS DEL DÍA (WITH COUNTDOWN TIMER) */}
                {promoProducts.length > 0 && (
                  <div className="bg-surface-900/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🔥</span>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-tight">Ofertas del día</h3>
                          <p className="text-[10px] text-gray-500">Descuentos únicos actualizados en tiempo real</p>
                        </div>
                      </div>
                      
                      {/* Timer */}
                      <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 px-3 py-1.5 rounded-xl text-danger-400 font-extrabold text-xs">
                        <Clock size={13} className="animate-pulse" />
                        <span>Termina en:</span>
                        <span className="bg-danger-500 text-white px-1.5 py-0.5 rounded font-mono text-[10px]">
                          {timeLeft.hours.toString().padStart(2, '0')}
                        </span>
                        <span>:</span>
                        <span className="bg-danger-500 text-white px-1.5 py-0.5 rounded font-mono text-[10px]">
                          {timeLeft.minutes.toString().padStart(2, '0')}
                        </span>
                        <span>:</span>
                        <span className="bg-danger-500 text-white px-1.5 py-0.5 rounded font-mono text-[10px]">
                          {timeLeft.seconds.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {promoProducts.map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <ProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

                {/* INTERCALATED ELEGANT BANNER 1 */}
                <div className="bg-gradient-to-r from-brand-900/40 via-surface-900/90 to-surface-900 border border-brand-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded uppercase tracking-widest">
                      Ecosistema Gestiva
                    </span>
                    <h3 className="text-base font-black text-white">Administra tu inventario y controla pedidos fácilmente</h3>
                    <p className="text-xs text-gray-500 leading-normal max-w-xl">
                      ¿Cansado de configurar producto por producto? Gestiva te permite controlar todo desde un solo panel administrativo. Más económico y eficiente.
                    </p>
                  </div>
                  <a
                    href="https://gestivaone.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Saber más</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* C. NUEVAS TIENDAS */}
                {newStores.length > 0 && (
                  <div>
                    <div className="section-header">
                      <span className="section-title">🌱 Nuevas tiendas virtuales</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {newStores.map(c => (
                        <StoreCard key={c.id} company={c} />
                      ))}
                    </div>
                  </div>
                )}

                {/* D. PRODUCTOS RECOMENDADOS (FEATURED) */}
                {featuredProducts.length > 0 && (
                  <div>
                    <div className="section-header">
                      <span className="section-title">⭐ Recomendados para ti</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {featuredProducts.map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <ProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

                {/* INTERCALATED ELEGANT BANNER 2 */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-surface-900/90 to-surface-900 border border-emerald-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded uppercase tracking-widest">
                      Garantía contra entrega
                    </span>
                    <h3 className="text-base font-black text-white">Tu tienda lista para vender en minutos sin tarjeta de crédito</h3>
                    <p className="text-xs text-gray-500 leading-normal max-w-xl">
                      Únete hoy a Gestiva y sube tu catálogo. Acepta cobros locales con Addi y contra entrega de manera automatizada.
                    </p>
                  </div>
                  <a
                    href="https://gestivaone.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary text-xs flex items-center gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-500 border-none shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  >
                    <span>Crear tienda gratis</span>
                    <ArrowRight size={12} />
                  </a>
                </div>

                {/* E. PRODUCTOS CON ENVÍO GRATIS */}
                {freeShippingProducts.length > 0 && (
                  <div>
                    <div className="section-header">
                      <span className="section-title">🚚 Productos con envío gratis</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {freeShippingProducts.map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <ProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

                {/* F. MÁS VENDIDOS */}
                {bestSellers.length > 0 && (
                  <div>
                    <div className="section-header">
                      <span className="section-title">📈 Productos más vendidos</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {bestSellers.map(p => {
                        const comp = companyMap.get(p.company_id)
                        return <ProductCard key={p.id} product={p} company={comp} />
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* ─── 7. PREMIUM WHATSAPP ADVISOR BLOCK ─── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-16" id="soporte">
        <div className="bg-gradient-to-br from-surface-900 via-surface-900 to-emerald-950/30 border border-white/5 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
          
          {/* Cover glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Advisor avatar/illustration */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 p-1">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                alt="Asesora de Gestiva"
                className="w-full h-full object-cover rounded-full filter saturate-100 shadow-md"
              />
            </div>
            {/* Active green status badge */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-surface-900 rounded-full animate-pulse" />
          </div>

          <div className="flex-1 space-y-3 text-center md:text-left">
            <span className="inline-block bg-emerald-500/15 text-emerald-400 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-500/20">
              SOPORTE 1A1 PERSONALIZADO
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
              ¿Necesitas ayuda para comenzar a vender?
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
              Nuestros asesores técnicos de GestivaOne configuran tu catálogo digital, te ayudan a organizar tus productos y responden tus dudas sin costo adicional.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] text-gray-500">
              <span className="flex items-center gap-1">✔️ Carga masiva de catálogo</span>
              <span className="text-white/10">•</span>
              <span className="flex items-center gap-1">✔️ Conexión contra entrega</span>
              <span className="text-white/10">•</span>
              <span className="flex items-center gap-1">✔️ Soporte ilimitado</span>
            </div>
          </div>

          {/* Chat Button */}
          <a
            href="https://wa.me/573022034253?text=Hola!%20Necesito%20asesoria%20personalizada%20para%20crear%20mi%20tienda%20online%20en%20Gestiva"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-[#25d366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,211,102,0.3)] shrink-0 cursor-pointer"
          >
            <MessageSquare size={16} className="fill-white/10" />
            <span>Hablar por WhatsApp</span>
          </a>
        </div>
      </section>

      {/* ─── 8. FREE TRIAL HERO CONVERSION BANNER ─── */}
      <section className="max-w-[1400px] mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 border border-brand-500/35 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-glow">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <span className="inline-block bg-white/15 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
              PRUEBA GESTIVAONE GRATIS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Lleva tu negocio al siguiente nivel hoy mismo
            </h2>
            <p className="text-xs sm:text-sm text-brand-200 leading-relaxed">
              Sin tarjeta de crédito. Configuración en minutos. Publica productos ilimitados y pon tu tienda virtual a facturar de inmediato.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <a
                href="https://gestivaone.com/auth"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-700 hover:bg-brand-50 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 shadow-xl"
              >
                <span>Crear mi tienda gratis</span>
                <ArrowRight size={14} />
              </a>
              <span className="text-[10px] text-brand-300">Listo en menos de 5 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. MARKETPLACE FOOTER ─── */}
      <footer className="border-t border-white/5 mt-20 pt-16 pb-10 bg-[#040407]">
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/25 flex items-center justify-center font-bold text-brand-400 text-base">
                <Zap size={14} className="text-brand-400 fill-brand-400/10" />
              </div>
              <span className="text-base font-black text-white uppercase tracking-tight">
                gestiva<span className="text-brand-400">.store</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              Plataforma digital integrada de facturación, administración de inventarios y canales e-commerce autónomos para emprendimientos y pymes de Colombia.
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Enlaces rápidos</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-500 font-semibold">
              <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
              <a href="#precios" className="hover:text-white transition-colors">Planes de Pago</a>
              <a href="#soporte" className="hover:text-white transition-colors">Ayuda y Soporte</a>
              <a href="https://gestivaone.com" target="_blank" className="hover:text-white transition-colors">Sitio corporativo</a>
            </div>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-500 font-semibold">
              <a href="#terminos" className="hover:text-white transition-colors">Términos y condiciones</a>
              <a href="#privacidad" className="hover:text-white transition-colors">Política de privacidad</a>
              <a href="#cookies" className="hover:text-white transition-colors">Uso de cookies</a>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[10px] text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} GestivaOne. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-gray-600 font-medium flex items-center gap-1">
            Diseñado con pasión en Colombia 🇨🇴
          </p>
        </div>
      </footer>

    </div>
  )
}

/* ─── Sub-Component: Store Card (Tarjeta de Tienda Premium) ─── */
function StoreCard({ company }) {
  const accent = company.store_settings?.accent_color || '#4f46e5'
  const desc = company.store_settings?.seo_description || 'Explora nuestra tienda oficial en Gestiva y haz tus pedidos.'
  const rating = company.rating || 4.7
  const reviews = company.reviews || 240
  const productsCount = company.products_count || 14
  
  return (
    <Link
      href={`/${company.store_slug}`}
      className="group bg-surface-900 border border-white/5 hover:border-brand-500/35 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative shadow-md hover:shadow-xl hover:-translate-y-1"
    >
      {/* Banner de fondo de la tienda */}
      <div className="h-24 relative overflow-hidden bg-surface-800 shrink-0">
        {company.store_settings?.banner_url ? (
          <img
            src={company.store_settings.banner_url}
            alt={company.name}
            className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-surface-800 to-surface-700 opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 to-transparent" />
      </div>

      {/* Cuerpo de la tienda */}
      <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
        
        {/* Avatar/Logo flotante */}
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div
            className="w-14 h-14 rounded-2xl border-4 border-surface-900 flex items-center justify-center text-lg font-black text-white shadow-lg shrink-0 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}
          >
            {(company.name || 'G').charAt(0).toUpperCase()}
          </div>
          
          <span className="px-2 py-0.5 rounded-full bg-surface-800 border border-white/5 text-[9px] font-bold text-gray-400 text-center">
            🏪 Tienda Oficial
          </span>
        </div>

        <div>
          <h4 className="text-sm font-black text-white group-hover:text-brand-400 transition-colors leading-tight truncate">
            {company.name}
          </h4>
          <span className="text-[10px] text-gray-500 font-semibold tracking-tight mt-0.5 block">
            {company.store_settings?.category || 'General'}
          </span>
          <p className="text-[11px] text-gray-400 leading-relaxed mt-2.5 line-clamp-2 h-9">
            {desc}
          </p>
        </div>

        {/* Info adicional & botón visitar */}
        <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-white/5">
          <div className="flex flex-col gap-0.5 text-left">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300">
              <Star size={11} className="text-yellow-400 fill-yellow-400" />
              <span>{rating}</span>
              <span className="text-gray-500 font-semibold">({reviews})</span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium">{productsCount} productos</span>
          </div>

          <div
            className="px-4 py-2 rounded-lg text-[10px] font-extrabold text-white transition-all group-hover:bg-brand-500/10 cursor-pointer border border-white/5"
            style={{ '--accent': accent }}
          >
            Visitar Tienda
          </div>
        </div>

      </div>
    </Link>
  )
}

/* ─── Sub-Component: Product Card (Tarjeta de Producto Premium) ─── */
function ProductCard({ product, company }) {
  const hasDiscount = product.discount_value && product.discount_value > 0
  const finalPrice = hasDiscount
    ? product.discount_type === 'percentage'
      ? product.price * (1 - product.discount_value / 100)
      : product.price - product.discount_value
    : product.price

  const discountPct = hasDiscount
    ? product.discount_type === 'percentage'
      ? Math.round(product.discount_value)
      : Math.round((product.discount_value / product.price) * 100)
    : 0

  const accentColor = company?.store_settings?.accent_color || '#4f46e5'
  const imageUrl = product.image_url && product.image_url !== 'none' ? product.image_url : null
  const rating = product.rating || 4.7
  const reviews = product.reviews || 48
  const freeShipping = product.free_shipping || product.price >= 199900

  return (
    <Link
      href={`/${company?.store_slug}/p/${product.id}`}
      className="group bg-surface-900 border border-white/5 hover:border-brand-500/35 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col relative shadow-md hover:shadow-xl hover:-translate-y-1"
    >
      {/* Imagen del Producto */}
      <div className="aspect-square bg-surface-800 relative overflow-hidden shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-35 bg-gradient-to-br from-surface-800 to-surface-700">
            📦
          </div>
        )}

        {/* Badges Flotantes */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && discountPct > 0 && (
            <span className="bg-danger-500 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Percent size={9} />
              -{discountPct}%
            </span>
          )}
          {product.featured && (
            <span className="bg-yellow-500 text-black font-extrabold text-[8px] uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
              ⭐ DESTACADO
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo del Producto */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Tienda origen y Categoría */}
          <div className="flex items-center justify-between gap-2 mb-1 text-[9px] font-semibold text-gray-500">
            <span className="uppercase tracking-wider">{product.category || 'Catálogo'}</span>
            <span className="text-brand-400 font-extrabold truncate max-w-[70px]">
              {company?.name || 'Tienda'}
            </span>
          </div>

          <h4 className="text-xs font-bold text-gray-200 line-clamp-2 leading-snug group-hover:text-white transition-colors h-8">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2 text-[9px] text-gray-400 font-bold">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span>{rating}</span>
            <span className="text-gray-600 font-medium">({reviews})</span>
          </div>
        </div>

        {/* Precios & Envíos */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm font-black text-white">{fCOP(finalPrice)}</span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-500 line-through font-semibold">
                {fCOP(product.price)}
              </span>
            )}
          </div>

          {/* Shipping badge */}
          <div className="min-h-[14px] mt-1.5">
            {freeShipping && (
              <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 tracking-wider">
                <Truck size={10} />
                ENVÍO GRATIS
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}
