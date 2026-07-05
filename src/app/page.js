import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#120a2b] via-[#1b0d3d] to-[#0b051b] text-white p-6">
      <div className="relative z-10 text-center max-w-lg">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="inline-flex p-4 bg-white/5 border border-white/10 rounded-2xl mb-6 shadow-2xl">
          <ShoppingBag className="w-12 h-12 text-indigo-400" />
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">
          Gestiva<span className="text-indigo-400">One</span> Store
        </h1>
        
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Plataforma de tiendas virtuales y catálogos interactivos para comercios locales y emprendedores.
        </p>

        <a
          href="https://gestivaone.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-[0.98]"
        >
          <span>Crear mi tienda virtual</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </main>
  )
}
