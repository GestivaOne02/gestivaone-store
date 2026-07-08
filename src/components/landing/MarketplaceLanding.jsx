'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'

import TopBar from './TopBar'
import Header from './Header'
import FiltersPanel from './FiltersPanel'
import HeroCarousel from './HeroCarousel'
import SideCards from './SideCards'
import BenefitsStrip from './BenefitsStrip'
import FeaturedStores from './FeaturedStores'
import PromoBanners from './PromoBanners'
import BestSellers from './BestSellers'
import ResultsGrid from './ResultsGrid'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'

// Shell de la landing del marketplace. Recibe todos los datos (reales, de Supabase)
// desde el Server Component (src/app/page.js) y coordina filtros, búsqueda y secciones.
export default function MarketplaceLanding({ data }) {
  const { deals, stores, categories, brands, maxPrice, featured, errors } = data

  const [filters, setFilters] = useState(null)
  const [search, setSearch] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const showResults = Boolean(
    search?.term || search?.category || (filters && Object.values(filters).some((v) => (Array.isArray(v) ? v.length : v)))
  )

  const scrollToResults = () => {
    requestAnimationFrame(() => {
      document.getElementById('mk-contenido')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const applyFilters = (f) => {
    setFilters(f)
    setDrawerOpen(false)
    if (f) scrollToResults()
  }
  const applySearch = (s) => {
    setSearch(s?.term || s?.category ? s : null)
    if (s?.term || s?.category) scrollToResults()
  }
  const clearAll = () => {
    setFilters(null)
    setSearch(null)
  }

  // Slides del hero construidos con datos reales de ofertas
  const heroSlides = useMemo(() => {
    const maxPct = deals.reduce((acc, d) => Math.max(acc, d.pct || 0), 0)
    const withImage = deals.filter((d) => d.image_url)
    const slides = []
    if (deals.length > 0) {
      slides.push({
        tag: 'Mega ofertas',
        title: 'Tecnología que transforma tu mundo',
        subtitle: 'Las mejores marcas con hasta',
        bigText: `${maxPct}%`,
        bigSuffix: 'OFF',
        cta: 'Ver ofertas',
        gradient: 'from-slate-900 via-blue-950 to-indigo-900',
        image: withImage[0]?.image_url || null,
        imageAlt: withImage[0]?.name || '',
        onCta: () =>
          applyFilters({ category: '', minPrice: null, maxPrice: null, brands: [], onlyDeals: true, inStock: false, freeShipping: false }),
      })
    }
    slides.push({
      tag: 'Marketplace Gestiva',
      title: 'Miles de productos de tiendas colombianas',
      subtitle: 'Compra directo a las tiendas y paga al recibir en casa.',
      cta: 'Explorar productos',
      gradient: 'from-blue-800 via-blue-700 to-indigo-800',
      image: withImage[1]?.image_url || null,
      imageAlt: withImage[1]?.name || '',
      imageOverlay: 'from-blue-800/80 via-blue-800/20 to-transparent',
      onCta: () =>
        applyFilters({ category: '', minPrice: null, maxPrice: null, brands: [], onlyDeals: false, inStock: true, freeShipping: false }),
    })
    slides.push({
      tag: 'Pago contra entrega',
      title: 'Paga cuando recibas tu pedido',
      subtitle: 'Sin tarjetas, sin riesgos. Disponible en toda Colombia.',
      cta: 'Comprar con confianza',
      gradient: 'from-indigo-950 via-violet-900 to-purple-900',
      image: withImage[2]?.image_url || null,
      imageAlt: withImage[2]?.name || '',
      imageOverlay: 'from-indigo-950/80 via-indigo-950/20 to-transparent',
      onCta: () =>
        applyFilters({ category: '', minPrice: null, maxPrice: null, brands: [], onlyDeals: false, inStock: false, freeShipping: true }),
    })
    return slides
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deals])

  return (
    <div className="mk-landing min-h-screen bg-[#fafbfc] text-slate-800 font-sans antialiased">
      <TopBar />
      <Header categories={categories} onSearch={applySearch} />

      <main className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* ── Zona hero: filtros | carrusel | tarjetas laterales ── */}
        <div className="grid lg:grid-cols-[250px_minmax(0,1fr)_270px] gap-5 pt-8 items-start">
          <aside className="hidden lg:block" aria-label="Filtros de productos">
            <FiltersPanel
              categories={categories}
              brands={brands}
              maxPrice={maxPrice}
              onApply={applyFilters}
              applied={filters}
            />
          </aside>
          <div className="min-w-0">
            <HeroCarousel slides={heroSlides} />
          </div>
          <div className="hidden lg:block h-[340px]">
            <SideCards />
          </div>
        </div>

        {/* Botón de filtros (móvil / tablet) */}
        <div className="lg:hidden mt-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-[13px] font-bold text-slate-700 cursor-pointer active:scale-[0.99] transition-transform"
          >
            <SlidersHorizontal size={15} className="text-blue-600" />
            Filtrar productos
          </button>
        </div>

        <div className="mt-10">
          <BenefitsStrip />

          <div id="mk-contenido" className="scroll-mt-24 mt-16 space-y-16 pb-4">
            {showResults ? (
              <ResultsGrid filters={filters} search={search} onClear={clearAll} />
            ) : (
              <>
                <FeaturedStores stores={stores} error={errors.stores} />
                <PromoBanners />
                <BestSellers
                  products={featured}
                  error={errors.featured}
                  onSeeAll={() =>
                    applyFilters({ category: '', minPrice: null, maxPrice: null, brands: [], onlyDeals: false, inStock: true, freeShipping: false })
                  }
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />

      {/* Drawer de filtros en móvil (bottom sheet) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/50 z-[60] lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Filtros de productos"
              className="fixed bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto bg-[#fafbfc] rounded-t-2xl z-[70] lg:hidden p-4 pb-8"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[14px] font-bold text-slate-900">Filtros</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Cerrar filtros"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <FiltersPanel
                variant="accordion"
                categories={categories}
                brands={brands}
                maxPrice={maxPrice}
                onApply={applyFilters}
                applied={filters}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
