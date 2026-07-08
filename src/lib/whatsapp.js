// WhatsApp de soporte del marketplace (configurable por entorno)
export const MARKETPLACE_WHATSAPP =
  process.env.NEXT_PUBLIC_MARKETPLACE_WHATSAPP || '573043059862'

export const waLink = (message = '') =>
  `https://wa.me/${MARKETPLACE_WHATSAPP.replace(/\D/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`
