import { getMarketplaceData } from '@/lib/api/marketplace'
import MarketplaceLanding from '@/components/landing/MarketplaceLanding'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: {
    absolute: 'Gestiva.store — Marketplace con pago contra entrega',
  },
  description:
    'Compra tecnología, hogar, moda y más en las tiendas del marketplace Gestiva. Paga contra entrega en toda Colombia.',
}

export default async function Home() {
  const data = await getMarketplaceData()
  return (
    <main className="w-full overflow-x-hidden">
      <MarketplaceLanding data={data} />
    </main>
  )
}
