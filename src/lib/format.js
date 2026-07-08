// Utilidades compartidas de formato y precios para la tienda

export const FREE_SHIPPING_THRESHOLD = 199900

export const formatCOP = (v) =>
  v == null
    ? ''
    : new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(v)

// Calcula el precio final de un producto según su descuento (percentage | amount)
export function computeFinalPrice(product) {
  const { price, discount_type, discount_value } = product
  if (!discount_value || discount_value <= 0 || !price) {
    return { finalPrice: price ?? 0, hasDiscount: false, pct: 0 }
  }
  const raw =
    discount_type === 'percentage'
      ? price * (1 - discount_value / 100)
      : price - discount_value
  const finalPrice = Math.max(0, Math.round(raw))
  const hasDiscount = finalPrice < price
  const pct = hasDiscount ? Math.round((1 - finalPrice / price) * 100) : 0
  return { finalPrice, hasDiscount, pct }
}

export const hasFreeShipping = (finalPrice) => finalPrice >= FREE_SHIPPING_THRESHOLD
