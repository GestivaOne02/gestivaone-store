import { Truck, ShieldCheck, BadgeCheck, Headset } from 'lucide-react'
import { formatCOP, FREE_SHIPPING_THRESHOLD } from '@/lib/format'

const BENEFITS = [
  { icon: Truck, title: 'Envíos gratis', desc: `En pedidos desde ${formatCOP(FREE_SHIPPING_THRESHOLD)}` },
  { icon: ShieldCheck, title: 'Paga seguro', desc: 'Tus compras protegidas' },
  { icon: BadgeCheck, title: 'Garantía total', desc: '30 días de garantía' },
  { icon: Headset, title: 'Soporte 24/7', desc: 'Estamos para ayudarte' },
]

// Tira de beneficios bajo el hero
export default function BenefitsStrip() {
  return (
    <section aria-label="Beneficios" className="border-y border-slate-200/70 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <b.icon size={18} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 leading-tight">{b.title}</p>
              <p className="text-[12px] font-medium text-slate-400 leading-tight mt-0.5 truncate">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
