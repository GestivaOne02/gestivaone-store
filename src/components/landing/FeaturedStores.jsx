'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Store } from 'lucide-react'

function StoreCard({ store }) {
  return (
    <Link
      href={`/${store.slug}`}
      className="group h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
    >
      {/* Banner con imagen real de productos de la tienda */}
      <div className="relative aspect-[5/2] bg-slate-50 overflow-hidden shrink-0">
        {store.bannerImage ? (
          <img
            src={store.bannerImage}
            alt=""
            width={280}
            height={112}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <Store size={24} />
          </div>
        )}
      </div>
      <div className="relative px-4 pb-5 pt-8 text-center flex flex-col flex-grow">
        {/* Avatar */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-12 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center text-white text-[15px] font-bold overflow-hidden"
          style={{ backgroundColor: store.accentColor }}
        >
          {store.logoUrl ? (
            <img src={store.logoUrl} alt={`Logo de ${store.name}`} width={48} height={48} className="w-full h-full object-cover" />
          ) : (
            store.name?.charAt(0)?.toUpperCase() || 'T'
          )}
        </span>
        <h3 className="text-[13px] font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
          {store.name}
        </h3>
        <p className="text-[12px] font-medium text-slate-400 mt-1">
          {store.productCount} productos
        </p>
      </div>
    </Link>
  )
}

// Carrusel horizontal de tiendas destacadas (ranking real por productos destacados)
export default function FeaturedStores({ stores = [], error = false }) {
  const scroller = useRef(null)
  const [showAll, setShowAll] = useState(false)

  const scrollBy = (dir) =>
    scroller.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })

  return (
    <section aria-labelledby="tiendas-title">
      <div className="flex items-baseline justify-between mb-6">
        <h2 id="tiendas-title" className="text-[20px] font-bold text-slate-900 tracking-tight">
          Tiendas destacadas
        </h2>
        {stores.length > 5 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {showAll ? 'Ver menos' : 'Ver todas'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-[13px] font-medium text-slate-400">
          No pudimos cargar las tiendas. Intenta recargar la página.
        </div>
      )}
      {!error && stores.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-[13px] font-medium text-slate-400">
          Pronto encontrarás tiendas aquí.
        </div>
      )}

      {stores.length > 0 && (showAll ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {stores.map((s) => <StoreCard key={s.id} store={s} />)}
        </div>
      ) : (
        <div className="relative group/row">
          <div
            ref={scroller}
            className="flex gap-5 overflow-x-auto mk-scrollbar-hide scroll-smooth pb-1"
          >
            {stores.map((s) => (
              <div key={s.id} className="w-[210px] shrink-0">
                <StoreCard store={s} />
              </div>
            ))}
          </div>
          {stores.length > 5 && (
            <>
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Desplazar tiendas a la izquierda"
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 items-center justify-center cursor-pointer z-10 hidden lg:flex opacity-0 group-hover/row:opacity-100 transition-opacity"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Desplazar tiendas a la derecha"
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600 items-center justify-center cursor-pointer z-10 hidden lg:flex opacity-0 group-hover/row:opacity-100 transition-opacity"
              >
                <ChevronRight size={17} />
              </button>
            </>
          )}
        </div>
      ))}
    </section>
  )
}
