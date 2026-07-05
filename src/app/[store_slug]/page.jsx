import { supabase } from '@/lib/supabase'
import StoreHeader from '@/components/store/StoreHeader'
import ProductCard from '@/components/store/ProductCard'
import { AlertCircle, Archive } from 'lucide-react'

// Force dynamic rendering to fetch fresh data on every request
export const dynamic = 'force-dynamic'

async function getStoreData(store_slug) {
  // Query company details
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('store_slug', store_slug)
    .single()

  if (error || !company || !company.store_enabled) {
    return { company: null, products: [] }
  }

  // Query active products of company
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', company.id)
    .eq('show_in_store', true)
    .order('created_at', { ascending: false })

  return {
    company,
    products: products || []
  }
}

export default async function StoreFront({ params }) {
  const { store_slug } = params
  const { company, products } = await getStoreData(store_slug)

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-900 text-white p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tienda no disponible</h2>
          <p className="text-gray-400">
            La tienda que buscas no existe, no tiene configurado un enlace o se encuentra inactiva temporalmente.
          </p>
        </div>
      </div>
    )
  }

  // Extract unique categories for catalog filter
  const categories = Array.from(new Set(products.map(p => p.category || 'Otros')))

  return (
    <div className="min-h-screen bg-surface-900 text-white pb-12">
      {/* Dynamic Store Header */}
      <StoreHeader company={company} />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 animate-fade-in">
        
        {/* Banner Section */}
        {company.store_settings?.banner_url ? (
          <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative mb-8 border border-subtle">
            <img 
              src={company.store_settings.banner_url} 
              alt={`Banner de ${company.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full py-8 px-6 rounded-2xl bg-gradient-to-r from-surface-800 to-surface-700 mb-8 border border-subtle flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 uppercase tracking-wide">
              {company.name}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl">
              {company.store_settings?.seo_description || 'Bienvenido a nuestra tienda virtual oficial. Explora nuestro catálogo de productos con envíos nacionales.'}
            </p>
          </div>
        )}

        {/* Catalog Section */}
        <div className="flex items-center justify-between gap-4 border-b border-subtle pb-4 mb-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            Catálogo de Productos ({products.length})
          </h3>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-surface-800 rounded-2xl border border-subtle">
            <Archive className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Por el momento no hay productos disponibles en esta tienda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeSlug={store_slug}
                accentColor={company.store_settings?.accent_color}
              />
            ))}
          </div>
        )}
      </main>

      {/* Powered by footer */}
      <footer className="text-center text-xs text-gray-500 mt-16 pb-8">
        <p>© {new Date().getFullYear()} {company.name}. Todos los derechos reservados.</p>
        <p className="mt-1">
          Tecnología de{' '}
          <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">
            GestivaOne
          </a>
        </p>
      </footer>
    </div>
  )
}
