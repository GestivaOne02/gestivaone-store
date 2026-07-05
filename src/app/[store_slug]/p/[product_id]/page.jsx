import { supabase } from '@/lib/supabase'
import StoreHeader from '@/components/store/StoreHeader'
import ProductLanding from '@/components/store/ProductLanding'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getProductAndStore(store_slug, product_id) {
  const { data: company, error: companyError } = await supabase
    .from('companies').select('*').eq('store_slug', store_slug).single()
  if (companyError || !company || !company.store_enabled) return { company: null, product: null }

  const { data: product, error: productError } = await supabase
    .from('products').select('*')
    .eq('id', product_id).eq('company_id', company.id).eq('show_in_store', true).single()
  if (productError || !product) return { company, product: null }

  return { company, product }
}

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

export default async function ProductDetailPage({ params }) {
  const { store_slug, product_id } = await params
  const { company, product } = await getProductAndStore(store_slug, product_id)

  if (!company) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#0a0a0f', color:'#fff', padding:'2rem', textAlign:'center' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🔍</div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:900, marginBottom:'0.5rem' }}>Tienda no disponible</h1>
        <p style={{ color:'#6b7280' }}>La tienda no existe o está inactiva.</p>
      </div>
    )
  }

  const accent = company.store_settings?.accent_color || '#4f46e5'

  if (!product) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0a0f', color:'#fff' }}>
        <StoreHeader company={company} />
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'5rem 1.5rem', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📦</div>
          <h2 style={{ fontSize:'1.4rem', fontWeight:900, marginBottom:'0.5rem' }}>Producto no disponible</h2>
          <p style={{ color:'#6b7280', marginBottom:'1.5rem' }}>Este producto fue retirado del catálogo.</p>
          <Link href={`/${store_slug}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 1.5rem', borderRadius:'0.75rem', background:`linear-gradient(135deg,${accent},#7c3aed)`, color:'#fff', fontWeight:700, textDecoration:'none' }}>
            <ArrowLeft /> Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0f', color:'#fff' }}>
      <StoreHeader company={company} productName={product.name} />
      <ProductLanding product={product} company={company} storeSlug={store_slug} />
    </div>
  )
}
