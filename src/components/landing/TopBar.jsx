import { HelpCircle, Headset, Globe } from 'lucide-react'
import { formatCOP, FREE_SHIPPING_THRESHOLD } from '@/lib/format'

// Barra superior de anuncios (fondo navy)
export default function TopBar() {
  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] font-semibold">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-hidden text-slate-300">
          <span className="whitespace-nowrap">
            Envíos gratis en pedidos superiores a {formatCOP(FREE_SHIPPING_THRESHOLD)}
          </span>
          <span className="hidden md:block whitespace-nowrap border-l border-white/10 pl-6">
            Paga con Addi, Sistecrédito o Contra entrega
          </span>
          <span className="hidden lg:block whitespace-nowrap border-l border-white/10 pl-6">
            Garantía en todos nuestros productos
          </span>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            Ayuda
          </a>
          <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            <Headset size={12} /> Soporte 24/7
          </a>
          <span className="flex items-center gap-1 text-slate-400">
            <Globe size={12} /> ES
          </span>
        </div>
      </div>
    </div>
  )
}
