import { supabase } from '@/lib/supabase'
import MarketplaceHome from '@/components/store/MarketplaceHome'

export const dynamic = 'force-dynamic'

async function getMarketplaceData() {
  // Fetch active stores
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .eq('store_enabled', true)
    .order('created_at', { ascending: false })
    .limit(100)

  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('show_in_store', true)
    .order('created_at', { ascending: false })
    .limit(200)

  return {
    companies: companies || [],
    products: products || []
  }
}

export default async function Home() {
  const { companies, products } = await getMarketplaceData()

  return (
    <main className="w-full overflow-x-hidden" style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      <MarketplaceHome initialCompanies={companies} initialProducts={products} />
    </main>
  )
}
