import { Check, MessageCircle, Store } from 'lucide-react'
import { waLink } from '@/lib/whatsapp'

const PERKS = [
  'Sin tarjeta de crédito',
  'Configuración en minutos',
  'Acompañamiento personalizado',
  'Empieza a vender hoy mismo',
]

// Banners promocionales: crear tienda + ayuda por WhatsApp
export default function PromoBanners() {
  return (
    <section aria-label="Promociones" className="grid lg:grid-cols-2 gap-5">
      {/* Crea tu tienda */}
      <div className="relative overflow-hidden bg-blue-600 rounded-2xl p-8">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-white" aria-hidden="true">
          <Store size={180} strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-[360px]">
          <h2 className="text-[20px] font-bold text-white leading-tight">¡Crea tu tienda online gratis!</h2>
          <ul className="mt-5 space-y-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-blue-50 text-[13px] font-medium">
                <Check size={14} strokeWidth={2.5} className="shrink-0 text-blue-200" />
                {p}
              </li>
            ))}
          </ul>
          <a
            href="https://gestivaone.com/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-6 bg-white text-blue-700 hover:bg-blue-50 text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            Probar Gestiva gratis
          </a>
        </div>
      </div>

      {/* Ayuda WhatsApp */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-8">
        <div className="absolute -right-6 -bottom-6 opacity-[0.04] text-slate-900" aria-hidden="true">
          <MessageCircle size={170} strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-[360px]">
          <h2 className="text-[20px] font-bold text-slate-900 leading-tight">¿Necesitas ayuda?</h2>
          <p className="text-[13px] font-medium text-slate-500 mt-2 leading-relaxed">
            Te ayudamos a crear tu tienda, configurar productos y resolver todas tus dudas por WhatsApp.
          </p>
          <a
            href={waLink('Hola, necesito ayuda con mi tienda en Gestiva.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            <MessageCircle size={15} />
            Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
