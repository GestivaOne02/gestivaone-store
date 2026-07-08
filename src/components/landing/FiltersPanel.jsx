'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { formatCOP } from '@/lib/format'

const EMPTY_DRAFT = {
  category: '',
  minPrice: null,
  maxPrice: null,
  brands: [],
  onlyDeals: false,
  inStock: false,
  freeShipping: false,
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-100 pb-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-[12px] font-semibold text-slate-700 py-1 cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown size={14} className={`text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

// Panel de filtros (columna izquierda del hero + drawer móvil).
// Los valores (categorías, marcas, tope de precio) vienen de la BD.
export default function FiltersPanel({ categories = [], brands = [], maxPrice = 5000000, onApply, applied }) {
  const [draft, setDraft] = useState(applied || EMPTY_DRAFT)
  const [brandSearch, setBrandSearch] = useState('')
  const [showAllCats, setShowAllCats] = useState(false)

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const sliderMin = draft.minPrice ?? 0
  const sliderMax = draft.maxPrice ?? maxPrice
  const pct = (v) => Math.min(100, Math.max(0, (v / maxPrice) * 100))

  const visibleBrands = useMemo(() => {
    const filtered = brandSearch
      ? brands.filter((b) => b.includes(brandSearch.toUpperCase()))
      : brands
    return filtered.slice(0, 10)
  }, [brands, brandSearch])

  const visibleCats = showAllCats ? categories : categories.slice(0, 6)

  const activeCount =
    (draft.category ? 1 : 0) +
    (draft.minPrice != null || draft.maxPrice != null ? 1 : 0) +
    draft.brands.length +
    (draft.onlyDeals ? 1 : 0) +
    (draft.inStock ? 1 : 0) +
    (draft.freeShipping ? 1 : 0)

  const clear = () => {
    setDraft(EMPTY_DRAFT)
    setBrandSearch('')
    onApply?.(null)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-[13px] font-bold text-slate-900">Filtros</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Categoría */}
      <Section title="Categoría">
        <ul className="space-y-0.5">
          {visibleCats.map((c) => {
            const active = draft.category === c.name
            return (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => set({ category: active ? '' : c.name })}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className={`text-[11px] shrink-0 ${active ? 'text-blue-400' : 'text-slate-300'}`}>
                    {c.count}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {categories.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAllCats(!showAllCats)}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 mt-2 px-2.5 cursor-pointer"
          >
            {showAllCats ? 'Ver menos' : `Ver todas (${categories.length})`}
          </button>
        )}
        {categories.length === 0 && (
          <p className="text-[11px] text-slate-400 font-medium px-2.5">Sin categorías disponibles</p>
        )}
      </Section>

      {/* Precio */}
      <Section title="Precio">
        <div className="px-1">
          <div className="relative h-1 bg-slate-100 rounded-full my-3">
            <div
              className="absolute h-full bg-blue-600 rounded-full"
              style={{ left: `${pct(sliderMin)}%`, right: `${100 - pct(sliderMax)}%` }}
            />
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={50000}
              value={sliderMin}
              aria-label="Precio mínimo"
              onChange={(e) => set({ minPrice: Math.min(Number(e.target.value), sliderMax - 50000) })}
              className="mk-range absolute inset-0 w-full"
            />
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={50000}
              value={sliderMax}
              aria-label="Precio máximo"
              onChange={(e) => set({ maxPrice: Math.max(Number(e.target.value), sliderMin + 50000) })}
              className="mk-range absolute inset-0 w-full"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 tabular-nums">
            <span>{formatCOP(sliderMin)}</span>
            <span>{sliderMax >= maxPrice ? `${formatCOP(maxPrice)}+` : formatCOP(sliderMax)}</span>
          </div>
        </div>
      </Section>

      {/* Marca */}
      {brands.length > 0 && (
        <Section title="Marca" defaultOpen={false}>
          <div className="relative mb-2.5">
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Buscar marca"
              aria-label="Buscar marca"
              className="w-full bg-slate-50 text-[12px] px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:bg-white font-medium placeholder:text-slate-400"
            />
            {brandSearch ? (
              <button type="button" onClick={() => setBrandSearch('')} aria-label="Limpiar búsqueda de marca" className="absolute right-2.5 top-2.5 text-slate-400 cursor-pointer">
                <X size={13} />
              </button>
            ) : (
              <Search size={13} className="absolute right-3 top-2.5 text-slate-300" />
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {visibleBrands.map((b) => {
              const active = draft.brands.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    set({ brands: active ? draft.brands.filter((x) => x !== b) : [...draft.brands, b] })
                  }
                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-700'}`}
                >
                  {b}
                </button>
              )
            })}
            {visibleBrands.length === 0 && (
              <p className="text-[11px] text-slate-400 font-medium">No se encontraron marcas</p>
            )}
          </div>
        </Section>
      )}

      {/* Disponibilidad y ofertas */}
      <Section title="Disponibilidad" defaultOpen={false}>
        {[
          { key: 'onlyDeals', label: 'Solo con descuento' },
          { key: 'freeShipping', label: 'Envío gratis' },
          { key: 'inStock', label: 'Disponible ahora' },
        ].map((opt) => (
          <label key={opt.key} className="flex items-center gap-2.5 py-1.5 text-[12px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={draft[opt.key]}
              onChange={(e) => set({ [opt.key]: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 cursor-pointer accent-blue-600"
            />
            {opt.label}
          </label>
        ))}
      </Section>

      <button
        type="button"
        onClick={() => onApply?.(draft)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
      >
        Aplicar filtros{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>
    </div>
  )
}
