'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { MARKETPLACE_WHATSAPP, waLink } from '@/lib/whatsapp'

// Botón flotante de WhatsApp con anillo pulsante (mismo patrón que ProductLanding)
export default function WhatsAppFloat() {
  if (!MARKETPLACE_WHATSAPP) return null
  return (
    <motion.a
      href={waLink('Hola, estoy en gestiva.store y tengo una pregunta.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring', damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 w-[52px] h-[52px] rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.5)] cursor-pointer"
    >
      <MessageCircle size={24} strokeWidth={2.2} />
      <motion.span
        aria-hidden="true"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full border-2 border-[#25d366] opacity-50"
      />
    </motion.a>
  )
}
