// Capa de datos del marketplace (server-side).
// Todas las secciones de la landing consumen estas funciones — nada de datos quemados en los componentes.
// Nota: las agregaciones de PostgREST están deshabilitadas en este proyecto,
// por eso los conteos se hacen con consultas head+count en paralelo.

import { supabase } from '@/lib/supabase'
import { computeFinalPrice } from '@/lib/format'

const PRODUCT_FIELDS =
  'id,company_id,name,description,price,category,stock,image_url,discount_type,discount_value,discount_ends_at,featured,created_at'

const BRAND_KEYWORDS = [
  'SAMSUNG', 'APPLE', 'IPHONE', 'MOTOROLA', 'XIAOMI', 'OPPO', 'TECNO', 'HONOR',
  'REALME', 'VIVO', 'HUAWEI', 'LENOVO', 'HP', 'ASUS', 'ACER', 'DELL', 'LG',
  'SONY', 'JBL', 'CANON', 'NIKON', 'OSTER', 'NIKE', 'ADIDAS',
]

export function extractBrand(name = '', description = '') {
  const text = `${name} ${description}`.toUpperCase()
  for (const b of BRAND_KEYWORDS) {
    if (text.includes(b)) return b === 'IPHONE' ? 'APPLE' : b
  }
  return null
}

// Adjunta nombre y slug de la tienda a una lista de productos
export async function attachStoreInfo(products) {
  const ids = [...new Set((products || []).map((p) => p.company_id).filter(Boolean))]
  if (ids.length === 0) return products || []
  const { data: companies } = await supabase
    .from('companies')
    .select('id,name,store_slug,store_enabled')
    .in('id', ids)
  const byId = new Map((companies || []).map((c) => [c.id, c]))
  return (products || []).map((p) => {
    const c = byId.get(p.company_id)
    return {
      ...p,
      storeName: c?.name || null,
      storeSlug: c?.store_enabled ? c?.store_slug || null : null,
    }
  })
}

function enrichPricing(products) {
  return (products || []).map((p) => ({ ...p, ...computeFinalPrice(p) }))
}

// ── Ofertas del día ──────────────────────────────────────────────
// Productos con descuento vigente, ordenados por % de descuento real.
export async function getDailyDeals(limit = 12) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_FIELDS)
    .eq('show_in_store', true)
    .gt('discount_value', 0)
    .neq('image_url', '')
    .order('created_at', { ascending: false })
    .limit(80)
  if (error) return { deals: [], dealsEndAt: null, error: true }

  const now = Date.now()
  const valid = enrichPricing(data).filter(
    (p) =>
      p.hasDiscount &&
      (!p.discount_ends_at || new Date(p.discount_ends_at).getTime() > now)
  )
  valid.sort((a, b) => b.pct - a.pct)
  const deals = await attachStoreInfo(valid.slice(0, limit))

  // Countdown real: la oferta con vencimiento más próximo; null si ninguna tiene fecha
  const futureEnds = valid
    .map((p) => p.discount_ends_at)
    .filter(Boolean)
    .map((d) => new Date(d).getTime())
    .filter((t) => t > now)
  const dealsEndAt = futureEnds.length ? new Date(Math.min(...futureEnds)).toISOString() : null

  return { deals, dealsEndAt, error: false }
}

// ── Tiendas destacadas ───────────────────────────────────────────
// Ranking derivado de datos reales: tiendas con más productos destacados recientes.
export async function getFeaturedStores(limit = 12) {
  const { data: sample, error } = await supabase
    .from('products')
    .select('company_id,category,image_url')
    .eq('show_in_store', true)
    .eq('featured', true)
    .neq('image_url', '')
    .order('created_at', { ascending: false })
    .limit(400)
  if (error) return { stores: [], error: true }

  const grouped = new Map()
  for (const p of sample || []) {
    if (!p.company_id) continue
    const g = grouped.get(p.company_id) || { count: 0, image: null, categories: {} }
    g.count += 1
    if (!g.image) g.image = p.image_url
    if (p.category) g.categories[p.category] = (g.categories[p.category] || 0) + 1
    grouped.set(p.company_id, g)
  }
  const topIds = [...grouped.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([id]) => id)
  if (topIds.length === 0) return { stores: [], error: false }

  const { data: companies } = await supabase
    .from('companies')
    .select('id,name,logo_url,store_slug,store_settings')
    .eq('store_enabled', true)
    .in('id', topIds)

  // Conteo exacto de productos por tienda (head+count en paralelo)
  const counts = await Promise.all(
    (companies || []).map((c) =>
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', c.id)
        .eq('show_in_store', true)
        .then(({ count }) => [c.id, count || 0])
    )
  )
  const countById = new Map(counts)

  const stores = (companies || [])
    .map((c) => {
      const g = grouped.get(c.id)
      const topCategory = g
        ? Object.entries(g.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || null
        : null
      return {
        id: c.id,
        name: c.name,
        slug: c.store_slug,
        logoUrl: c.logo_url || null,
        accentColor: c.store_settings?.accent_color || '#2563eb',
        bannerImage: c.store_settings?.banner_url || g?.image || null,
        category: topCategory,
        productCount: countById.get(c.id) || 0,
      }
    })
    .sort((a, b) => b.productCount - a.productCount)

  return { stores, error: false }
}

// ── Categorías populares + facetas de filtros ────────────────────
export async function getCategoriesAndFacets() {
  const { data: sample, error } = await supabase
    .from('products')
    .select('name,category,price,image_url')
    .eq('show_in_store', true)
    .order('created_at', { ascending: false })
    .limit(1000)
  if (error) return { categories: [], brands: [], maxPrice: 5000000, error: true }

  // Categorías únicas con imagen representativa
  const catInfo = new Map()
  for (const p of sample || []) {
    const cat = (p.category || '').trim()
    if (!cat) continue
    const info = catInfo.get(cat) || { image: null }
    if (!info.image && p.image_url) info.image = p.image_url
    catInfo.set(cat, info)
  }

  // Conteo exacto por categoría
  const counted = await Promise.all(
    [...catInfo.keys()].map((cat) =>
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('show_in_store', true)
        .eq('category', cat)
        .then(({ count }) => ({ name: cat, count: count || 0, image: catInfo.get(cat).image }))
    )
  )
  const categories = counted.sort((a, b) => b.count - a.count)

  // Marcas detectadas en el catálogo reciente (para el filtro de marca)
  const brandCounts = {}
  for (const p of sample || []) {
    const b = extractBrand(p.name)
    if (b) brandCounts[b] = (brandCounts[b] || 0) + 1
  }
  const brands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)

  // Tope del slider de precio derivado del catálogo (redondeado a 500k)
  const maxSeen = Math.max(0, ...(sample || []).map((p) => p.price || 0))
  const maxPrice = Math.min(20000000, Math.max(1000000, Math.ceil(maxSeen / 500000) * 500000))

  return { categories, brands, maxPrice, error: false }
}

// ── Productos destacados (grid numerado) ─────────────────────────
export async function getFeaturedProducts(limit = 12) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_FIELDS)
    .eq('show_in_store', true)
    .eq('featured', true)
    .neq('image_url', '')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return { featured: [], error: true }
  const featured = await attachStoreInfo(enrichPricing(data))
  return { featured, error: false }
}

// ── Orquestador de la landing ────────────────────────────────────
export async function getMarketplaceData() {
  const [dealsRes, storesRes, catsRes, featRes] = await Promise.all([
    getDailyDeals(),
    getFeaturedStores(),
    getCategoriesAndFacets(),
    getFeaturedProducts(),
  ])
  return {
    deals: dealsRes.deals,
    dealsEndAt: dealsRes.dealsEndAt,
    stores: storesRes.stores,
    categories: catsRes.categories,
    brands: catsRes.brands,
    maxPrice: catsRes.maxPrice,
    featured: featRes.featured,
    errors: {
      deals: dealsRes.error,
      stores: storesRes.error,
      categories: catsRes.error,
      featured: featRes.error,
    },
  }
}
