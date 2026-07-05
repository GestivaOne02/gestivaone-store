import { supabase } from '@/lib/supabase'
import StoreHeader from '@/components/store/StoreHeader'
import ProductCard from '@/components/store/ProductCard'

export const dynamic = 'force-dynamic'

async function getStoreData(store_slug) {
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('store_slug', store_slug)
    .single()

  if (error || !company || !company.store_enabled) {
    return { company: null, products: [] }
  }

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', company.id)
    .eq('show_in_store', true)
    .order('created_at', { ascending: false })

  return { company, products: products || [] }
}

// Decorative SVG orb
const OrbDecor = ({ color = '#4f46e5', size = 300, top, left, right, opacity = 0.06 }) => (
  <div style={{
    position: 'absolute', width: size, height: size, borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    opacity, pointerEvents: 'none',
    top: top ?? 'auto', left: left ?? 'auto', right: right ?? 'auto',
    filter: 'blur(40px)',
  }} />
)

// Archive icon
const ArchiveIcon = () => (
  <svg style={{ width: '3rem', height: '3rem', color: 'var(--muted-400)', opacity: 0.5 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
)

export default async function StoreFront({ params }) {
  const resolvedParams = await params
  const { store_slug } = resolvedParams
  const { company, products } = await getStoreData(store_slug)

  if (!company) {
    return (
      <div className="page-error">
        <div style={{
          width: '5rem', height: '5rem', borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(248,113,113,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '2rem'
        }}>
          🔍
        </div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>Tienda no disponible</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-400)', maxWidth: '22rem' }}>
          La tienda que buscas no existe, no tiene configurado un enlace o se encuentra inactiva temporalmente.
        </p>
      </div>
    )
  }

  const accentColor = company.store_settings?.accent_color || '#4f46e5'
  const categories  = [...new Set(products.map(p => p.category || 'Otros'))]
  const featured    = products.filter(p => p.featured)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-900)', overflowX: 'hidden' }}>
      {/* Sticky Header */}
      <StoreHeader company={company} />

      {/* Hero Section */}
      <div style={{ position: 'relative' }}>
        {/* Background orbs */}
        <OrbDecor color={accentColor} size={400} top={-100} left={-100} opacity={0.07} />
        <OrbDecor color="#7c3aed" size={300} top={-50} right={-80} opacity={0.05} />

        <div className="container-store" style={{ paddingTop: '2rem', paddingBottom: '0.5rem' }}>
          {/* Banner */}
          {company.store_settings?.banner_url ? (
            <div className="store-hero">
              <div className="store-hero-bg" style={{ backgroundImage: `url(${company.store_settings.banner_url})` }} />
              <div className="store-hero-overlay" />
              <div className="store-hero-content animate-slide-up">
                <div className="store-hero-title">{company.name}</div>
                {company.store_settings?.seo_description && (
                  <div className="store-hero-desc">{company.store_settings.seo_description}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="store-hero store-hero-default" style={{ borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', zIndex: 1 }} className="animate-slide-up">
                <div className="badge badge-brand" style={{ marginBottom: '0.75rem' }}>
                  🏪 Tienda Oficial
                </div>
                <h1 className="store-hero-title" style={{ color: 'var(--text-foreground)' }}>{company.name}</h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-500)', marginTop: '0.5rem', maxWidth: '36rem' }}>
                  {company.store_settings?.seo_description || 'Bienvenido a nuestra tienda virtual. Explora nuestros productos con envíos a toda Colombia.'}
                </p>

                {/* Trust badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <span className="badge badge-success">✅ Paga al recibir</span>
                  <span className="badge badge-brand">🚚 Envíos Colombia</span>
                  {products.length > 0 && (
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted-500)', border: '1px solid var(--border-subtle)' }}>
                      📦 {products.length} {products.length === 1 ? 'producto' : 'productos'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container-store" style={{ paddingBottom: '4rem' }}>

        {/* Featured strip (if any) */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div className="section-header">
              <span className="section-title">⭐ Destacados</span>
              <span className="section-count">{featured.length}</span>
            </div>
            <div className="products-grid stagger">
              {featured.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeSlug={store_slug}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        )}

        {/* All products */}
        <div>
          <div className="section-header">
            <span className="section-title">Catálogo completo</span>
            <span className="section-count">{products.length} {products.length === 1 ? 'producto' : 'productos'}</span>
          </div>

          {products.length === 0 ? (
            <div className="empty-state animate-fade-in">
              <div className="empty-state-icon"><ArchiveIcon /></div>
              <div className="empty-state-title">Sin productos disponibles</div>
              <div className="empty-state-desc">Por el momento no hay productos en esta tienda. Vuelve pronto.</div>
            </div>
          ) : (
            <div className="products-grid stagger">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeSlug={store_slug}
                  accentColor={accentColor}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="store-footer">
        <p>© {new Date().getFullYear()} <strong style={{ color: 'var(--text-foreground)' }}>{company.name}</strong>. Todos los derechos reservados.</p>
        <p style={{ marginTop: '0.35rem' }}>
          Tecnología de{' '}
          <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer">GestivaOne</a>
        </p>
      </footer>
    </div>
  )
}
