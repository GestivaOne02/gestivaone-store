'use client'

import LandingProductCard from './LandingProductCard'

// Cuadrícula de productos destacados (campo `featured` real de la BD)
export default function BestSellers({ products = [], error = false, onSeeAll }) {
  return (
    <section aria-labelledby="destacados-title">
      <div className="flex items-baseline justify-between mb-6">
        <h2 id="destacados-title" className="text-[20px] font-bold text-slate-900 tracking-tight">
          Productos destacados
        </h2>
        {products.length > 0 && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Ver todos
          </button>
        )}
      </div>

      {error && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-[13px] font-medium text-slate-400">
          No pudimos cargar los productos. Intenta recargar la página.
        </div>
      )}
      {!error && products.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-[13px] font-medium text-slate-400">
          Aún no hay productos destacados.
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map((p) => (
            <LandingProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
