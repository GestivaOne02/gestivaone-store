'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react'
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

const AVAILABILITY_OPTS = [
  { key: 'onlyDeals', label: 'Solo con descuento' },
  { key: 'freeShipping', label: 'Envío gratis' },
  { key: 'inStock', label: 'Disponible ahora' },
]

/* ── Contenido de cada sección (compartido por flyout y acordeón) ── */

function CategoryList({ categories, draft, set, onPick }) {
  return (
    <ul className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
      {categories.map((c) => {
        const active = draft.category === c.name
        return (
          <li key={c.name}>
            <button
              type="button"
              onClick={() => {
                set({ category: active ? '' : c.name })
                onPick?.()
              }}
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
      {categories.length === 0 && (
        <li className="text-[11px] text-slate-400 font-medium px-2.5">Sin categorías disponibles</li>
      )}
    </ul>
  )
}

function PriceControls({ draft, set, maxPrice }) {
  const sliderMin = draft.minPrice ?? 0
  const sliderMax = draft.maxPrice ?? maxPrice
  const pct = (v) => Math.min(100, Math.max(0, (v / maxPrice) * 100))
  return (
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
  )
}

function BrandPicker({ brands, draft, set }) {
  const [brandSearch, setBrandSearch] = useState('')
  const visible = useMemo(() => {
    const filtered = brandSearch
      ? brands.filter((b) => b.includes(brandSearch.toUpperCase()))
      : brands
    return filtered.slice(0, 10)
  }, [brands, brandSearch])
  return (
    <div>
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
        {visible.map((b) => {
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
        {visible.length === 0 && (
          <p className="text-[11px] text-slate-400 font-medium">No se encontraron marcas</p>
        )}
      </div>
    </div>
  )
}

function AvailabilityToggles({ draft, set }) {
  return (
    <div>
      {AVAILABILITY_OPTS.map((opt) => (
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
    </div>
  )
}

/* ── Acordeón (solo drawer móvil, donde no empuja la página) ── */
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

// Panel de filtros. variant="flyout" (desktop): filas fijas con flecha que abren
// el contenido en un panel lateral flotante — la columna nunca crece hacia abajo.
// variant="accordion" (drawer móvil): secciones desplegables clásicas.
export default function FiltersPanel({
  categories = [],
  brands = [],
  maxPrice = 5000000,
  onApply,
  applied,
  variant = 'flyout',
}) {
  const [draft, setDraft] = useState(applied || EMPTY_DRAFT)
  const [openSection, setOpenSection] = useState(null)
  const rootRef = useRef(null)

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  // Cerrar flyout con clic afuera o Escape
  useEffect(() => {
    if (variant !== 'flyout') return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenSection(null)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenSection(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [variant])

  const activeCount =
    (draft.category ? 1 : 0) +
    (draft.minPrice != null || draft.maxPrice != null ? 1 : 0) +
    draft.brands.length +
    (draft.onlyDeals ? 1 : 0) +
    (draft.inStock ? 1 : 0) +
    (draft.freeShipping ? 1 : 0)

  const clear = () => {
    setDraft(EMPTY_DRAFT)
    setOpenSection(null)
    onApply?.(null)
  }

  const availabilityActive = AVAILABILITY_OPTS.filter((o) => draft[o.key]).length

  const SECTIONS = [
    {
      key: 'category',
      title: 'Categoría',
      summary: draft.category || null,
      content: (
        <CategoryList categories={categories} draft={draft} set={set} onPick={() => setOpenSection(null)} />
      ),
    },
    {
      key: 'price',
      title: 'Precio',
      summary:
        draft.minPrice != null || draft.maxPrice != null
          ? `${formatCOP(draft.minPrice ?? 0)} – ${formatCOP(draft.maxPrice ?? maxPrice)}`
          : null,
      content: <PriceControls draft={draft} set={set} maxPrice={maxPrice} />,
    },
    ...(brands.length > 0
      ? [{
          key: 'brands',
          title: 'Marca',
          summary: draft.brands.length ? `${draft.brands.length} seleccionada${draft.brands.length === 1 ? '' : 's'}` : null,
          content: <BrandPicker brands={brands} draft={draft} set={set} />,
        }]
      : []),
    {
      key: 'availability',
      title: 'Disponibilidad',
      summary: availabilityActive ? `${availabilityActive} activa${availabilityActive === 1 ? '' : 's'}` : null,
      content: <AvailabilityToggles draft={draft} set={set} />,
    },
  ]

  const header = (
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
  )

  const applyButton = (
    <button
      type="button"
      onClick={() => {
        setOpenSection(null)
        onApply?.(draft)
      }}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
    >
      Aplicar filtros{activeCount > 0 ? ` (${activeCount})` : ''}
    </button>
  )

  if (variant === 'accordion') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
        {header}
        {SECTIONS.map((s, i) => (
          <Section key={s.key} title={s.title} defaultOpen={i < 2}>
            {s.content}
          </Section>
        ))}
        {applyButton}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
      {header}

      <div className="flex flex-col gap-0.5">
        {SECTIONS.map((s) => {
          const open = openSection === s.key
          return (
            <div key={s.key} className="relative">
              <button
                type="button"
                onClick={() => setOpenSection(open ? null : s.key)}
                aria-expanded={open}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${open ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
              >
                <span className="min-w-0">
                  <span className={`block text-[12px] font-semibold ${open ? 'text-blue-700' : 'text-slate-700'}`}>
                    {s.title}
                  </span>
                  {s.summary && (
                    <span className="block text-[11px] font-medium text-blue-600 truncate mt-0.5">
                      {s.summary}
                    </span>
                  )}
                </span>
                <ChevronRight
                  size={14}
                  className={`shrink-0 transition-colors ${open ? 'text-blue-600' : 'text-slate-300'}`}
                />
              </button>

              {/* Flyout lateral: se abre al lado, la columna no crece */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-full top-0 ml-3 w-72 bg-white border border-slate-200 rounded-xl shadow-[0_12px_32px_rgba(15,23,42,0.12)] p-4 z-40"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-semibold text-slate-700">{s.title}</span>
                      <button
                        type="button"
                        onClick={() => setOpenSection(null)}
                        aria-label={`Cerrar ${s.title}`}
                        className="text-slate-300 hover:text-slate-500 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    {s.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {applyButton}
    </div>
  )
}
