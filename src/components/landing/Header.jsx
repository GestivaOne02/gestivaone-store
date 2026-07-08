'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Search, ChevronDown, Package, Heart, ShoppingCart, User, X,
} from 'lucide-react'

// Header principal: logo, buscador con selector de categorías y accesos
export default function Header({ categories = [], onSearch }) {
  const [term, setTerm] = useState('')
  const [cat, setCat] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    onSearch?.({ term: term.trim(), category: cat })
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[68px] flex items-center gap-4 lg:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Gestiva.store — inicio">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="9" r="4" />
              <path d="M16 9v6.5c0 2.5-2 4.5-4.5 4.5S7 18 7 15.5v-1" />
            </svg>
          </span>
          <span className="text-[20px] font-black tracking-tight text-slate-900 hidden sm:block">
            gestiva<span className="text-blue-600">.store</span>
          </span>
        </Link>

        {/* Buscador */}
        <form
          onSubmit={submit}
          role="search"
          className="flex-grow max-w-2xl hidden md:flex items-center h-11 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/15 transition-all"
        >
          <div className="relative h-full shrink-0" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen(!catOpen)}
              aria-expanded={catOpen}
              className="flex items-center gap-1.5 h-full px-3.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 border-r border-slate-200 cursor-pointer max-w-[170px]"
            >
              <span className="truncate">{cat || 'Todas las categorías'}</span>
              <ChevronDown size={12} className={`shrink-0 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 max-h-80 overflow-y-auto rounded-xl p-1.5 z-50 shadow-xl bg-white border border-slate-100">
                <button
                  type="button"
                  onClick={() => { setCat(''); setCatOpen(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-bold cursor-pointer transition-colors ${!cat ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Todas las categorías
                </button>
                {categories.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => { setCat(c.name); setCatOpen(false) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-bold cursor-pointer transition-colors ${cat === c.name ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {c.name} <span className="text-slate-300 font-semibold">({c.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <label htmlFor="mk-search" className="sr-only">Buscar productos</label>
          <input
            id="mk-search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar productos, marcas y más..."
            className="flex-1 h-full px-3.5 bg-transparent text-[13px] font-semibold text-slate-800 outline-none placeholder:text-slate-400 min-w-0"
          />
          {term && (
            <button type="button" onClick={() => setTerm('')} aria-label="Limpiar búsqueda" className="text-slate-400 hover:text-slate-600 px-1 cursor-pointer">
              <X size={14} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Buscar"
            className="h-[36px] w-[44px] mr-1 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Acciones */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto text-slate-600" aria-label="Accesos rápidos">
          <a href="https://gestivaone.com/auth" target="_blank" rel="noopener noreferrer" className="hidden lg:flex flex-col items-center gap-0.5 hover:text-blue-700 transition-colors px-2.5 py-1">
            <Package size={20} className="stroke-[1.7]" />
            <span className="text-[10px] font-bold">Pedidos</span>
          </a>
          <button type="button" className="hidden lg:flex flex-col items-center gap-0.5 hover:text-blue-700 transition-colors px-2.5 py-1 cursor-pointer">
            <Heart size={20} className="stroke-[1.7]" />
            <span className="text-[10px] font-bold">Favoritos</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-0.5 hover:text-blue-700 transition-colors px-2.5 py-1 cursor-pointer relative">
            <ShoppingCart size={20} className="stroke-[1.7]" />
            <span className="text-[10px] font-bold hidden sm:block">Carrito</span>
          </button>
          <div className="w-px h-7 bg-slate-200 mx-1 hidden sm:block" />
          <a
            href="https://gestivaone.com/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User size={17} className="text-slate-500" />
            <span className="hidden sm:inline">Mi cuenta</span>
            <ChevronDown size={11} className="text-slate-400 hidden sm:block" />
          </a>
        </nav>
      </div>

      {/* Buscador móvil */}
      <form onSubmit={submit} role="search" className="md:hidden px-4 pb-3">
        <div className="flex items-center h-10 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-blue-500 focus-within:bg-white transition-all">
          <label htmlFor="mk-search-m" className="sr-only">Buscar productos</label>
          <input
            id="mk-search-m"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar productos, marcas y más..."
            className="flex-1 h-full px-3.5 bg-transparent text-[13px] font-semibold text-slate-800 outline-none placeholder:text-slate-400 min-w-0"
          />
          <button type="submit" aria-label="Buscar" className="h-[32px] w-[40px] mr-1 shrink-0 bg-blue-600 text-white rounded-md flex items-center justify-center">
            <Search size={15} />
          </button>
        </div>
      </form>
    </header>
  )
}
