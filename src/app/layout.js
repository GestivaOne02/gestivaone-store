import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: {
    template: '%s | Powered by GestivaOne',
    default: 'GestivaOne Store',
  },
  description: 'Tienda virtual profesional creada con GestivaOne.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
