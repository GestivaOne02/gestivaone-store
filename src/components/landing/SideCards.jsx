'use client'

import { ArrowRight, HandCoins, Store } from 'lucide-react'

// Columna derecha del hero: métodos de pago + CTA "Vende con Gestiva"
export default function SideCards() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Paga como prefieras */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-[14px] font-bold text-slate-900 mb-3.5">Paga como prefieras</h2>
        <div className="flex flex-wrap gap-2">
          {['Addi', 'Sistecrédito', 'Mercado Pago'].map((m) => (
            <span key={m} className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-200 text-slate-600 text-[12px] font-semibold">
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <HandCoins size={14} />
          </span>
          <span className="text-[12px] font-semibold text-slate-700">Contra entrega</span>
        </div>
        <a
          href="https://gestivaone.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 mt-3.5 group"
        >
          Ver métodos de pago
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* Vende con Gestiva */}
      <div className="flex-grow bg-blue-600 rounded-2xl p-5 relative overflow-hidden shadow-lg shadow-blue-600/20 flex flex-col justify-between min-h-[150px]">
        <div className="absolute -right-6 -bottom-6 opacity-15 text-white" aria-hidden="true">
          <Store size={140} strokeWidth={1.2} />
        </div>
        <div className="relative z-10">
          <h2 className="text-[17px] font-bold text-white leading-tight">Vende con Gestiva</h2>
          <p className="text-blue-100 text-[12px] font-semibold mt-1.5 leading-relaxed max-w-[200px]">
            Crea tu tienda online gratis y comienza a vender hoy.
          </p>
        </div>
        <a
          href="https://gestivaone.com/auth"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-4 inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 text-[12px] font-bold px-4 py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-95 self-start"
        >
          Crear mi tienda gratis
        </a>
      </div>
    </div>
  )
}
