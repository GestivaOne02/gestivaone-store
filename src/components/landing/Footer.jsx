const COLUMNS = [
  {
    title: 'Gestiva',
    links: [
      { label: 'Acerca de Gestiva', href: 'https://gestivaone.com' },
      { label: 'Crea tu tienda', href: 'https://gestivaone.com/auth' },
      { label: 'Panel de vendedores', href: 'https://gestivaone.com/auth' },
    ],
  },
  {
    title: 'Compras',
    links: [
      { label: 'Cómo comprar', href: 'https://gestivaone.com' },
      { label: 'Envíos y entregas', href: 'https://gestivaone.com' },
      { label: 'Pago contra entrega', href: 'https://gestivaone.com' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Centro de ayuda', href: 'https://gestivaone.com' },
      { label: 'Garantías y devoluciones', href: 'https://gestivaone.com' },
      { label: 'Contacto', href: 'https://gestivaone.com' },
    ],
  },
]

// Footer minimalista del marketplace
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10">
          {/* Marca */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="9" r="4" />
                  <path d="M16 9v6.5c0 2.5-2 4.5-4.5 4.5S7 18 7 15.5v-1" />
                </svg>
              </span>
              <span className="text-[19px] font-bold tracking-tight text-slate-900">
                gestiva<span className="text-blue-600">.store</span>
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mt-4 leading-relaxed max-w-[280px]">
              El marketplace de las tiendas GestivaOne. Compra con pago contra entrega en toda Colombia.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Addi', 'Sistecrédito', 'Contra entrega'].map((m) => (
                <span key={m} className="inline-flex items-center h-7 px-3 rounded-md border border-slate-200 text-slate-500 text-[11px] font-semibold">
                  {m}
                </span>
              ))}
            </div>
          </div>
          {/* Columnas de enlaces */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em] mb-4">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium text-slate-600 hover:text-blue-700 transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-slate-100 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] font-medium text-slate-400">
            © {new Date().getFullYear()} GestivaOne. Todos los derechos reservados.
          </p>
          <p className="text-[12px] font-medium text-slate-400">Hecho en Colombia</p>
        </div>
      </div>
    </footer>
  )
}
