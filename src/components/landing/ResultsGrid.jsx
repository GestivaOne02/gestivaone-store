'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SearchX, RotateCcw, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { computeFinalPrice, FREE_SHIPPING_THRESHOLD } from '@/lib/format'
import LandingProductCard from './LandingProductCard'

const PAGE_SIZE = 24

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mt-2" />
      </div>
    </div>
  )
}

// Resultados de búsqueda/filtros: consulta real a la BD desde el cliente,
// con estados de carga (skeletons), error y vacío.
export default function ResultsGrid({ filters, search, onClear }) {
  const [state, setState] = useState({ loading: true, error: false, products: [], total: null })
  const seq = useRef(0)

  const fetchResults = useCallback(async () => {
    const mySeq = ++seq.current
    setState((s) => ({ ...s, loading: true, error: false }))
    try {
      let q = supabase
        .from('products')
        .select(
          'id,company_id,name,description,price,category,stock,image_url,discount_type,discount_value,discount_ends_at',
          { count: 'exact' }
        )
        .eq('show_in_store', true)

      if (search?.term) q = q.ilike('name', `%${search.term}%`)
      const category = filters?.category || search?.category
      if (category) q = q.eq('category', category)
      if (filters?.minPrice != null) q = q.gte('price', filters.minPrice)
      if (filters?.maxPrice != null) q = q.lte('price', filters.maxPrice)
      if (filters?.onlyDeals) q = q.gt('discount_value', 0)
      if (filters?.inStock) q = q.gt('stock', 0)
      if (filters?.freeShipping) q = q.gte('price', FREE_SHIPPING_THRESHOLD)
      if (filters?.brands?.length) {
        q = q.or(filters.brands.map((b) => `name.ilike.%${b}%`).join(','))
      }
      if (filters?.storeId) q = q.eq('company_id', filters.storeId)

      if (filters?.sort === 'price_asc') q = q.order('price', { ascending: true })
      else if (filters?.sort === 'price_desc') q = q.order('price', { ascending: false })
      else q = q.order('created_at', { ascending: false })

      const { data, count, error } = await q.limit(PAGE_SIZE)
      if (error) throw error

      // Adjuntar tienda (nombre + slug) para los enlaces de las tarjetas
      const ids = [...new Set((data || []).map((p) => p.company_id).filter(Boolean))]
      let byId = new Map()
      if (ids.length) {
        const { data: companies } = await supabase
          .from('companies')
          .select('id,name,store_slug,store_enabled')
          .in('id', ids)
        byId = new Map((companies || []).map((c) => [c.id, c]))
      }
      const products = (data || []).map((p) => {
        const c = byId.get(p.company_id)
        return {
          ...p,
          ...computeFinalPrice(p),
          storeName: c?.name || null,
          storeSlug: c?.store_enabled ? c?.store_slug || null : null,
        }
      })
      if (seq.current !== mySeq) return
      setState({ loading: false, error: false, products, total: count ?? products.length })
    } catch {
      if (seq.current !== mySeq) return
      setState({ loading: false, error: true, products: [], total: null })
    }
  }, [filters, search])

  useEffect(() => {
    // Se difiere fuera del cuerpo síncrono del efecto (evita renders en cascada)
    const t = setTimeout(fetchResults, 0)
    return () => clearTimeout(t)
  }, [fetchResults])

  const title = search?.term
    ? `Resultados para “${search.term}”`
    : filters?.category || search?.category
      ? filters?.category || search?.category
      : 'Resultados'

  return (
    <section aria-labelledby="resultados-title" aria-busy={state.loading}>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 id="resultados-title" className="text-[20px] font-bold text-slate-900 tracking-tight">{title}</h2>
          {!state.loading && !state.error && state.total != null && (
            <p className="text-[12px] font-semibold text-slate-400 mt-0.5">
              {state.total} producto{state.total === 1 ? '' : 's'} encontrado{state.total === 1 ? '' : 's'}
              {state.total > PAGE_SIZE ? ` · mostrando ${PAGE_SIZE}` : ''}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <X size={13} /> Quitar filtros
        </button>
      </div>

      {state.loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!state.loading && state.error && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-[14px] font-bold text-slate-600">No pudimos cargar los resultados.</p>
          <p className="text-[12px] font-semibold text-slate-400 mt-1">Revisa tu conexión e inténtalo de nuevo.</p>
          <button
            type="button"
            onClick={fetchResults}
            className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-black px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reintentar
          </button>
        </div>
      )}

      {!state.loading && !state.error && state.products.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <SearchX size={32} className="mx-auto text-slate-300" />
          <p className="text-[14px] font-bold text-slate-600 mt-3">No encontramos productos con esos criterios.</p>
          <p className="text-[12px] font-semibold text-slate-400 mt-1">Prueba con otra búsqueda o ajusta los filtros.</p>
          <button
            type="button"
            onClick={onClear}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-black px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Ver todo el marketplace
          </button>
        </div>
      )}

      {!state.loading && !state.error && state.products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {state.products.map((p) => <LandingProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  )
}
