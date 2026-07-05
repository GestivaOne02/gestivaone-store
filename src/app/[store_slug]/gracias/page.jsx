'use client'

import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle2, Phone, Home, ShoppingBag, Truck } from 'lucide-react'

function formatPrice(price) {
  if (!price) return '$0'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const params       = useParams()
  const storeSlug    = params.store_slug

  const invoiceId = searchParams.get('invoiceId')
  const total     = searchParams.get('total')

  const [company, setCompany] = useState(null)
  const [accentColor, setAccentColor] = useState('#4f46e5')
  const [whatsapp, setWhatsapp] = useState('')

  useEffect(() => {
    async function loadStoreBrand() {
      if (storeSlug) {
        const { data } = await supabase
          .from('companies')
          .select('name, store_settings')
          .eq('store_slug', storeSlug)
          .single()
        
        if (data) {
          setCompany(data)
          if (data.store_settings?.accent_color) {
            setAccentColor(data.store_settings.accent_color)
          }
          if (data.store_settings?.whatsapp_contact) {
            setWhatsapp(data.store_settings.whatsapp_contact)
          }
        }
      }
    }
    loadStoreBrand()
  }, [storeSlug])

  const handleWhatsAppContact = () => {
    if (!whatsapp) return
    const cleanedPhone = whatsapp.replace(/\D/g, '')
    const messageText = `Hola ${company?.name || ''}, acabo de realizar un pedido con código ${invoiceId || ''} en tu tienda virtual por valor de ${formatPrice(total)}. ¿Me podrían confirmar el envío? ¡Muchas gracias!`
    const encodedMessage = encodeURIComponent(messageText)
    window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-surface-900 text-white flex flex-col items-center justify-center p-6 pb-16">
      
      {/* Glow Effect */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-md w-full text-center relative z-10 animate-slide-up">
        {/* Animated Check */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping [animation-duration:2.5s]" />
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>

        <h1 className="text-3xl font-black tracking-tight mb-2">
          ¡PEDIDO RECIBIDO!
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Tu compra ha sido registrada con éxito en nuestro sistema.
        </p>

        {/* Invoice details box */}
        <div className="p-6 rounded-2xl border border-subtle bg-surface-800 text-left mb-6 flex flex-col gap-4">
          
          <div className="flex justify-between items-center pb-3 border-b border-subtle">
            <span className="text-xs font-semibold text-gray-400 uppercase">Referencia</span>
            <span className="text-sm font-black text-white bg-surface-700 px-3 py-1 rounded-lg">
              {invoiceId || 'WEB-XXXXXX'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-subtle">
            <span className="text-xs font-semibold text-gray-400 uppercase">Total a Pagar</span>
            <span className="text-xl font-black" style={{ color: accentColor }}>
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Método de Pago</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <Truck className="w-3.5 h-3.5" />
              Contra Entrega
            </span>
          </div>

        </div>

        {/* Delivery instructions message */}
        <div className="p-4 rounded-xl bg-surface-750 border border-subtle text-xs text-gray-400 text-left leading-relaxed mb-8 flex gap-3">
          <Truck className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">¿Qué sigue ahora?</strong> Estaremos preparando tu pedido en las próximas horas. Pagas el valor exacto en efectivo o método acordado directamente al repartidor cuando llegue a tu puerta.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-3">
          {whatsapp && (
            <button
              onClick={handleWhatsAppContact}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98] shadow-md"
              style={{ background: '#25d366' }}
            >
              <Phone className="w-4 h-4" />
              <span>Confirmar por WhatsApp</span>
            </button>
          )}

          <Link
            href={`/${storeSlug}`}
            className="w-full py-3.5 rounded-xl border border-subtle bg-surface-800 hover:bg-surface-750 font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Seguir comprando</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
