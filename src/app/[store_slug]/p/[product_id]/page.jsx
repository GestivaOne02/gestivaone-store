import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import StoreHeader from '@/components/store/StoreHeader'
import ProductViewClient from '@/components/store/ProductViewClient'
import { ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getProductAndStore(store_slug, product_id) {
  // 1. Fetch Company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('store_slug', store_slug)
    .single()

  if (companyError || !company || !company.store_enabled) {
    return { company: null, product: null }
  }

  // 2. Fetch Product (Checking if active and matches company)
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .eq('company_id', company.id)
    .eq('show_in_store', true)
    .single()

  if (productError || !product) {
    return { company, product: null }
  }

  return { company, product }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params
  const { store_slug, product_id } = resolvedParams
  const { company, product } = await getProductAndStore(store_slug, product_id)

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-900 text-white p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tienda no disponible</h2>
          <p className="text-gray-400">
            La tienda que buscas no existe o se encuentra inactiva.
          </p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-900 text-white p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Producto no disponible</h2>
          <p className="text-gray-400 mb-4">
            El producto seleccionado no está disponible o ha sido retirado del catálogo.
          </p>
          <Link
            href={`/${store_slug}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900 text-white pb-24">
      {/* Sticky Header */}
      <StoreHeader company={company} />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 animate-fade-in">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-4 overflow-x-auto whitespace-nowrap py-1 no-scrollbar">
          <Link href={`/${store_slug}`} className="hover:text-white transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-600" />
          <span className="text-gray-500 truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
        </div>

        {/* Back Link */}
        <Link
          href={`/${store_slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </Link>

        {/* Product Details Wrapper */}
        <ProductViewClient 
          product={product} 
          company={company} 
          storeSlug={store_slug} 
        />

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-20">
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
