'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingBag, Heart, ShoppingCart, User, Globe, ChevronDown,
  Truck, ShieldCheck, PhoneCall, CreditCard, X, MapPin, ChevronUp,
  SlidersHorizontal, Trash2, Check, Plus, GitCompare, ArrowRight
} from 'lucide-react'

const allCats = ['Todos', 'Tecnología', 'Celulares', 'Computadores', 'Electrodomésticos', 'Hogar y Cocina', 'Moda', 'Belleza', 'Deportes', 'Juguetes', 'Mascotas', 'Automotriz']

const TOP_BAR_ITEMS = [
  { text: 'Envíos gratis en pedidos superiores a $199.900', icon: Truck, iconColor: '#34d399' },
  { text: 'Paga con Addi, Sistecrédito o Contra entrega', icon: CreditCard, iconColor: '#fbbf24' },
  { text: 'Garantía en todos nuestros productos', icon: ShieldCheck, iconColor: '#60a5fa' },
  { text: 'Soporte 24/7 y asesoría personalizada', icon: PhoneCall, iconColor: '#f472b6' }
]

const formatCOP = (v) =>
  v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

const parseProducts = (products) => {
  return products.map(product => {
    const nameUpper = (product.name || '').toUpperCase()
    const descUpper = (product.description || '').toUpperCase()
    const fullText = `${nameUpper} ${descUpper}`

    // 1. Brand Extraction
    let brand = 'OTRO'
    const BRANDS = ['SAMSUNG', 'APPLE', 'MOTOROLA', 'XIAOMI', 'OPPO', 'TECNO', 'HONOR', 'NUBIA', 'REALME', 'VIVO', 'HUAWEI', 'IPHONE']
    for (const b of BRANDS) {
      if (fullText.includes(b)) {
        brand = b === 'IPHONE' ? 'APPLE' : b
        break
      }
    }

    // 2. Storage Extraction
    let storage = 'Otros'
    if (fullText.includes('1 TERA') || fullText.includes('1TB')) storage = '1 Tera'
    else if (fullText.includes('512 GB') || fullText.includes('512GB')) storage = '512 GB'
    else if (fullText.includes('256 GB') || fullText.includes('256GB')) storage = '256 GB'
    else if (fullText.includes('128 GB') || fullText.includes('128GB')) storage = '128 GB'
    else if (fullText.includes('64 GB') || fullText.includes('64GB')) storage = '64 GB'
    else if (fullText.includes('32 GB') || fullText.includes('32GB')) storage = '32 GB'

    // 3. RAM Extraction
    let ram = 'Otros'
    if (fullText.includes('16 GB') || fullText.includes('16GB')) ram = '16 GB'
    else if (fullText.includes('12 GB') || fullText.includes('12GB')) ram = '12 GB'
    else if (fullText.includes('8 GB') || fullText.includes('8GB')) ram = '8 GB'
    else if (fullText.includes('6 GB') || fullText.includes('6GB')) ram = '6 GB'
    else if (fullText.includes('4 GB') || fullText.includes('4GB')) ram = '4 GB'
    else if (fullText.includes('3 GB') || fullText.includes('3GB')) ram = '3 GB'

    // 4. Condition
    const isReconditioned = fullText.includes('REACONDICIONADO') || 
                            fullText.includes('REFURBISHED') || 
                            fullText.includes('USADO') || 
                            fullText.includes('OUTLET')

    // 5. Reference (Phone sub-family extraction)
    let phoneRef = 'Otros'
    const galaxyMatch = nameUpper.match(/GALAXY\s+([A-Z0-9]+)/)
    if (galaxyMatch) {
      phoneRef = `Galaxy ${galaxyMatch[1]}`
    } else if (nameUpper.includes('IPHONE')) {
      const iphoneMatch = nameUpper.match(/IPHONE\s+(\d+\s*(PRO\s*MAX|PRO|MINI|PLUS)?)/)
      phoneRef = iphoneMatch ? `iPhone ${iphoneMatch[1]}` : 'iPhone'
    } else if (nameUpper.includes('REDMI')) {
      const redmiMatch = nameUpper.match(/REDMI\s+(NOTE\s+\d+|\d+)/)
      phoneRef = redmiMatch ? `Redmi ${redmiMatch[1]}` : 'Redmi'
    } else if (nameUpper.includes('MOTO')) {
      const motoMatch = nameUpper.match(/MOTO\s+([A-Z0-9]+)/)
      phoneRef = motoMatch ? `Moto ${motoMatch[1]}` : 'Moto'
    }

    // 6. Pricing
    const hasDiscount = product.discount_value && product.discount_value > 0
    const finalPrice = hasDiscount
      ? product.discount_type === 'percentage'
        ? product.price * (1 - product.discount_value / 100)
        : product.price - product.discount_value
      : product.price

    return {
      ...product,
      brand,
      storage,
      ram,
      isReconditioned,
      phoneRef,
      finalPrice
    }
  })
}

export default function MarketplaceHome({ initialCompanies = [], initialProducts = [] }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Todos')
  const [catOpen, setCatOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)
  const [location, setLocation] = useState('Ubicación')
  
  // Filter & UI States
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedStorages, setSelectedStorages] = useState([])
  const [selectedRams, setSelectedRams] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [priceMinInput, setPriceMinInput] = useState('')
  const [priceMaxInput, setPriceMaxInput] = useState('')
  const [activeMinPrice, setActiveMinPrice] = useState(null)
  const [activeMaxPrice, setActiveMaxPrice] = useState(null)
  
  const [brandSearch, setBrandSearch] = useState('')
  const [showMoreBrands, setShowMoreBrands] = useState(false)
  
  // Accordion collapsed states
  const [collapsed, setCollapsed] = useState({
    brand: false,
    price: false,
    storage: false,
    ram: false,
    reconditioned: false
  })

  const catRef = useRef(null)
  const locRef = useRef(null)

  // Click outside listener for dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatOpen(false)
      }
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 1. Process all products to add rich metadata
  const enrichedProducts = useMemo(() => parseProducts(initialProducts), [initialProducts])

  // Helper to toggle array filter selections
  const toggleFilter = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value))
    } else {
      setList([...list, value])
    }
  }

  // 2. Dynamic Count Aggregations (under current category & search constraint)
  const baseFilteredProducts = useMemo(() => {
    return enrichedProducts.filter(p => {
      const matchesSearch = !search || p.name.toUpperCase().includes(search.toUpperCase()) || (p.description || '').toUpperCase().includes(search.toUpperCase())
      const matchesCat = selectedCat === 'Todos' || p.category === selectedCat
      return matchesSearch && matchesCat
    })
  }, [enrichedProducts, search, selectedCat])

  const counts = useMemo(() => {
    const brandMap = {}
    const storageMap = {}
    const ramMap = {}
    let reconditionedCount = 0
    const priceRanges = {
      '$100.000 - $500.000': 0,
      '$500.000 - $1.000.000': 0,
      '$1.000.000 - $2.000.000': 0,
      '$2.000.000 - $3.000.000': 0,
      '$3.000.000 - $5.000.000': 0,
      '$5.000.000 - Más': 0
    }

    baseFilteredProducts.forEach(p => {
      // Brand
      brandMap[p.brand] = (brandMap[p.brand] || 0) + 1
      // Storage
      if (p.storage !== 'Otros') {
        storageMap[p.storage] = (storageMap[p.storage] || 0) + 1
      }
      // RAM
      if (p.ram !== 'Otros') {
        ramMap[p.ram] = (ramMap[p.ram] || 0) + 1
      }
      // Reconditioned
      if (p.isReconditioned) {
        reconditionedCount++
      }
      // Price
      const pr = p.finalPrice
      if (pr >= 100000 && pr <= 500000) priceRanges['$100.000 - $500.000']++
      else if (pr > 500000 && pr <= 1000000) priceRanges['$500.000 - $1.000.000']++
      else if (pr > 1000000 && pr <= 2000000) priceRanges['$1.000.000 - $2.000.000']++
      else if (pr > 2000000 && pr <= 3000000) priceRanges['$2.000.000 - $3.000.000']++
      else if (pr > 3000000 && pr <= 5000000) priceRanges['$3.000.000 - $5.000.000']++
      else if (pr > 5000000) priceRanges['$5.000.000 - Más']++
    })

    return {
      brands: brandMap,
      storage: storageMap,
      ram: ramMap,
      reconditioned: reconditionedCount,
      prices: priceRanges
    }
  }, [baseFilteredProducts])

  // Clear all filters
  const resetAllFilters = () => {
    setSelectedBrands([])
    setSelectedStorages([])
    setSelectedRams([])
    setSelectedConditions([])
    setSelectedPriceRange('')
    setPriceMinInput('')
    setPriceMaxInput('')
    setActiveMinPrice(null)
    setActiveMaxPrice(null)
  }

  // Handle price custom range form submit
  const handleCustomPriceApply = (e) => {
    e.preventDefault()
    const minVal = priceMinInput !== '' ? parseFloat(priceMinInput) : null
    const maxVal = priceMaxInput !== '' ? parseFloat(priceMaxInput) : null
    setActiveMinPrice(minVal)
    setActiveMaxPrice(maxVal)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full font-sans antialiased text-slate-800">
      
      {/* ──────────────────────────────────────────
          1. TOP BAR — MARQUESINA GIRATORIA INFINITA (Fondo `#0b1329`)
      ────────────────────────────────────────── */}
      <div className="bg-[#0b1329] text-white border-b border-slate-800 overflow-hidden select-none py-8 shadow-sm">
        <motion.div
          className="flex flex-nowrap gap-20 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
        >
          {/* Double content list for seamless infinite loop */}
          {[...Array(2)].map((_, listIdx) => (
            <div key={listIdx} className="flex items-center gap-20 shrink-0">
              {TOP_BAR_ITEMS.map((item, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-4 text-base font-black uppercase tracking-widest text-slate-100">
                  <item.icon size={20} style={{ color: item.iconColor }} className="shrink-0 stroke-[2.5]" />
                  <span>{item.text}</span>
                  <span className="text-slate-700 font-bold ml-8">•</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ──────────────────────────────────────────
          2. HEADER — BUSCADOR PROTAGONISTA (Tema Claro, Fondo Blanco)
      ────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 pt-8 pb-10 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-10 sm:px-16 flex items-center justify-between gap-8">
          
          {/* A. Logo Gestiva */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {/* Custom SVG Icon: 'g' with an arrow at the tip of the tail */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#4f46e5]/10 border border-[#4f46e5]/30 text-[#4f46e5] transition-transform group-hover:scale-105">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                {/* Bowl of the 'g' */}
                <circle cx="12" cy="9" r="4" />
                {/* Tail of the 'g' looping up */}
                <path d="M16 9v6.5c0 2.5-2 4.5-4.5 4.5S7 18 7 15.5v-1" />
                {/* Arrowhead at the end of the tail pointing up */}
                <path d="M4.5 17L7 14.5L9.5 17" />
              </svg>
            </div>
            <span className="text-[24px] font-black tracking-tight text-[#0f172a] block">
              Gestiva<span className="text-[#4f46e5]">.Store</span>
            </span>
          </Link>

          {/* B. Buscador con Dropdown */}
          <div className="flex-grow max-w-2xl flex items-center bg-[#f8fafc] border border-slate-200/80 rounded-lg p-1 h-[50px] focus-within:border-[#4f46e5] focus-within:bg-white focus-within:shadow-md transition-all shadow-sm">
            {/* Dropdown de Categorías */}
            <div className="relative shrink-0 flex items-center h-full" ref={catRef}>
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 px-4 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer h-full border-r border-slate-200 bg-transparent rounded-l-lg"
              >
                <span>Todas las categorías</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute left-0 top-full mt-2.5 w-56 rounded-xl p-1.5 z-50 shadow-2xl bg-white border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  {allCats.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setSelectedCat(c); setCatOpen(false) }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${selectedCat === c ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Input de Búsqueda */}
            <div className="flex-1 flex items-center px-4 gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar productos, marcas y más..."
                className="w-full bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400 font-semibold"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={15} />
                </button>
              )}
            </div>
            {/* Botón de Buscar */}
            <button className="h-[42px] w-[42px] shrink-0 bg-[#4f46e5] hover:bg-[#3730a3] text-white rounded-md flex items-center justify-center transition-colors cursor-pointer mr-0.5 shadow-sm shadow-indigo-600/10">
              <Search size={17} />
            </button>
          </div>

          {/* C. Acciones del Header */}
          <div className="flex items-center gap-7 shrink-0 text-slate-600">
            <Link href="#" className="flex flex-col items-center gap-0.5 hover:text-slate-900 transition-colors p-1 hidden sm:flex">
              <ShoppingBag size={22} className="stroke-[1.5]" />
              <span className="text-[11px] font-bold tracking-wide">Pedidos</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-0.5 hover:text-slate-900 transition-colors p-1 hidden sm:flex">
              <Heart size={22} className="stroke-[1.5]" />
              <span className="text-[11px] font-bold tracking-wide">Favoritos</span>
            </Link>
            <div
              ref={locRef}
              className="relative flex flex-col items-center gap-0.5 hover:text-slate-900 transition-colors p-1 cursor-pointer hidden sm:flex"
            >
              <div
                onClick={() => setLocOpen(!locOpen)}
                className="flex flex-col items-center gap-0.5"
              >
                <MapPin size={22} className="stroke-[1.5]" />
                <span className="text-[11px] font-bold tracking-wide text-center truncate max-w-[70px]">{location}</span>
              </div>
              {locOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-[115%] w-[300px] rounded-2xl p-4.5 z-50 shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white border border-slate-100"
                >
                  <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-100">
                    <MapPin size={14} className="text-[#4f46e5] stroke-[2.5]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Seleccionar Ciudad</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira', 'Cúcuta', 'Ibagué', 'Manizales'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setLocation(c)
                          setLocOpen(false)
                        }}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 ${location === c ? 'text-white bg-[#4f46e5]' : 'text-slate-600 hover:text-[#4f46e5] hover:bg-slate-50'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-center gap-0.5 hover:text-slate-900 transition-colors p-1 cursor-pointer relative">
              <ShoppingCart size={22} className="stroke-[1.5]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center text-white bg-red-500">3</span>
              <span className="text-[11px] font-bold tracking-wide">Carrito</span>
            </div>
            <div className="w-px h-7 bg-slate-200 hidden sm:block" />
            <Link href="https://gestivaone.com/auth" target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold text-slate-700 hover:text-slate-900 transition-all hover:bg-slate-50">
              <User size={18} className="text-slate-500" />
              <span>Mi cuenta</span>
              <ChevronDown size={10} className="text-slate-400" />
            </Link>
          </div>

        </div>
      </header>

      {/* ──────────────────────────────────────────
          MAIN CONTENT — FILTER LAYOUT
      ────────────────────────────────────────── */}
      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* A. SIDEBAR FILTERS (Bottom Left / Desktop Left) */}
          <aside className="w-full lg:w-72 shrink-0 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm self-start">
            <SidebarFiltersContent />
          </aside>

          {/* B. MAIN WORKSPACE PLACEHOLDER */}
          <div className="flex-grow">
            {/* Próximas secciones se renderizan aquí */}
          </div>

        </div>
      </main>

    </div>
  )

  // ──────────────────────────────────────────
  // INNER COMPONENTS — SIDEBAR CONTENT
  // ──────────────────────────────────────────

  function SidebarFiltersContent() {
    // Dynamically filter brands matching user brand search string
    const brandEntries = Object.entries(counts.brands)
    const filteredBrandEntries = brandSearch
      ? brandEntries.filter(([brandName]) => brandName.includes(brandSearch.toUpperCase()))
      : brandEntries

    // Limit displayed brands list length
    const displayedBrands = showMoreBrands ? filteredBrandEntries : filteredBrandEntries.slice(0, 5)

    return (
      <div className="space-y-6">
        
        {/* Title */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <span className="text-sm font-black text-slate-900 uppercase tracking-wide">Filtrar por:</span>
          {(selectedBrands.length + selectedStorages.length + selectedRams.length + selectedConditions.length + (selectedPriceRange ? 1 : 0) + (activeMinPrice || activeMaxPrice ? 1 : 0)) > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-[10px] font-black text-[#4f46e5] hover:text-[#3730a3] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {/* 1. Marca Accordion Section */}
        <div className="border-b border-slate-200/80 pb-5">
          <button
            type="button"
            onClick={() => setCollapsed({ ...collapsed, brand: !collapsed.brand })}
            className="w-full flex items-center justify-between font-black text-slate-800 text-xs tracking-wide uppercase py-1 cursor-pointer"
          >
            <span>Marca</span>
            {collapsed.brand ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
          </button>
          
          {!collapsed.brand && (
            <div className="mt-3.5">
              {/* Internal brand search input */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  placeholder="Buscar por marca"
                  className="w-full bg-[#f8fafc] text-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 outline-none focus:border-[#4f46e5] focus:bg-white transition-all font-semibold placeholder:text-slate-400 placeholder:font-bold"
                />
                {brandSearch ? (
                  <button type="button" onClick={() => setBrandSearch('')} className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-600">
                    <X size={12} />
                  </button>
                ) : (
                  <Search size={12} className="absolute right-3.5 top-3.5 text-slate-400" />
                )}
              </div>

              {/* Brand list */}
              {displayedBrands.length > 0 ? (
                <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {displayedBrands.map(([brandName, count]) => {
                    const isChecked = selectedBrands.includes(brandName)
                    return (
                      <li key={brandName}>
                        <label className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-bold select-none">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brandName)}
                              className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] h-4 w-4 cursor-pointer"
                            />
                            <span>{brandName !== 'OTRO' ? brandName : 'OTRO / SIN MARCA'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">({count})</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-[10px] text-slate-400 font-bold py-2">No se encontraron marcas</div>
              )}

              {/* Show more/less toggle button */}
              {filteredBrandEntries.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowMoreBrands(!showMoreBrands)}
                  className="text-[10px] font-black text-slate-500 hover:text-slate-900 transition-colors mt-3 block cursor-pointer"
                >
                  {showMoreBrands ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 2. Rango de precio Accordion Section */}
        <div className="border-b border-slate-200/80 pb-5">
          <button
            type="button"
            onClick={() => setCollapsed({ ...collapsed, price: !collapsed.price })}
            className="w-full flex items-center justify-between font-black text-slate-800 text-xs tracking-wide uppercase py-1 cursor-pointer"
          >
            <span>Rango de precio</span>
            {collapsed.price ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
          </button>

          {!collapsed.price && (
            <div className="mt-3.5">
              
              {/* Range Links list */}
              <ul className="space-y-2">
                {Object.entries(counts.prices).map(([range, count]) => {
                  const isActive = selectedPriceRange === range
                  return (
                    <li key={range}>
                      <button
                        type="button"
                        onClick={() => setSelectedPriceRange(isActive ? '' : range)}
                        className={`w-full flex items-center justify-between text-left text-xs font-bold transition-all cursor-pointer ${isActive ? 'text-[#4f46e5] underline' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        <span>{range}</span>
                        <span className={`text-[10px] font-bold ${isActive ? 'text-[#4f46e5]' : 'text-slate-400'}`}>({count})</span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* Custom Min / Max pricing fields inputs */}
              <form onSubmit={handleCustomPriceApply} className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                <div className="relative flex-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Min.</label>
                  <input
                    type="number"
                    value={priceMinInput}
                    onChange={e => setPriceMinInput(e.target.value)}
                    placeholder="$"
                    className="w-full bg-[#f8fafc] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 outline-none focus:border-[#4f46e5] focus:bg-white font-bold"
                  />
                </div>
                <div className="text-slate-400 font-bold self-end mb-1">-</div>
                <div className="relative flex-1">
                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Max.</label>
                  <input
                    type="number"
                    value={priceMaxInput}
                    onChange={e => setPriceMaxInput(e.target.value)}
                    placeholder="$"
                    className="w-full bg-[#f8fafc] text-xs px-2.5 py-1.5 rounded-lg border border-slate-200/80 outline-none focus:border-[#4f46e5] focus:bg-white font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#4f46e5] hover:bg-[#3730a3] text-white p-2 rounded-lg self-end cursor-pointer transition-colors shadow-sm"
                  title="Aplicar filtro de precio"
                >
                  <ArrowRight size={14} />
                </button>
              </form>

            </div>
          )}
        </div>

        {/* 3. Almacenamiento Accordion Section */}
        {Object.keys(counts.storage).length > 0 && (
          <div className="border-b border-slate-200/80 pb-5">
            <button
              type="button"
              onClick={() => setCollapsed({ ...collapsed, storage: !collapsed.storage })}
              className="w-full flex items-center justify-between font-black text-slate-800 text-xs tracking-wide uppercase py-1 cursor-pointer"
            >
              <span>Almacenamiento</span>
              {collapsed.storage ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>

            {!collapsed.storage && (
              <ul className="space-y-2 mt-3.5 pr-1">
                {Object.entries(counts.storage).map(([storageVal, count]) => {
                  const isChecked = selectedStorages.includes(storageVal)
                  return (
                    <li key={storageVal}>
                      <label className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-bold select-none">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilter(selectedStorages, setSelectedStorages, storageVal)}
                            className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] h-4 w-4 cursor-pointer"
                          />
                          <span>{storageVal}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">({count})</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

        {/* 4. Memoria RAM Accordion Section */}
        {Object.keys(counts.ram).length > 0 && (
          <div className="border-b border-slate-200/80 pb-5">
            <button
              type="button"
              onClick={() => setCollapsed({ ...collapsed, ram: !collapsed.ram })}
              className="w-full flex items-center justify-between font-black text-slate-800 text-xs tracking-wide uppercase py-1 cursor-pointer"
            >
              <span>Memoria RAM</span>
              {collapsed.ram ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>

            {!collapsed.ram && (
              <ul className="space-y-2 mt-3.5 pr-1">
                {Object.entries(counts.ram).map(([ramVal, count]) => {
                  const isChecked = selectedRams.includes(ramVal)
                  return (
                    <li key={ramVal}>
                      <label className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-bold select-none">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleFilter(selectedRams, setSelectedRams, ramVal)}
                            className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] h-4 w-4 cursor-pointer"
                          />
                          <span>{ramVal}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">({count})</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}

        {/* 5. Reacondicionados Accordion Section */}
        {counts.reconditioned > 0 && (
          <div className="pb-2">
            <button
              type="button"
              onClick={() => setCollapsed({ ...collapsed, reconditioned: !collapsed.reconditioned })}
              className="w-full flex items-center justify-between font-black text-slate-800 text-xs tracking-wide uppercase py-1 cursor-pointer"
            >
              <span>Condición</span>
              {collapsed.reconditioned ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>

            {!collapsed.reconditioned && (
              <ul className="space-y-2 mt-3.5">
                <li>
                  <label className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-bold select-none">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes('Sí es reacondicionado')}
                        onChange={() => toggleFilter(selectedConditions, setSelectedConditions, 'Sí es reacondicionado')}
                        className="rounded border-slate-300 text-[#4f46e5] focus:ring-[#4f46e5] h-4 w-4 cursor-pointer"
                      />
                      <span>Sí es reacondicionado</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">({counts.reconditioned})</span>
                  </label>
                </li>
              </ul>
            )}
          </div>
        )}

      </div>
    )
  }
}
