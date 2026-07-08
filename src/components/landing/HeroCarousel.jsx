'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Carrusel hero. Los slides se construyen con datos reales (mejor % de oferta y
// productos con imagen de la BD) en MarketplaceLanding.
export default function HeroCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0)
  const timer = useRef(null)
  const hovering = useRef(false)

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length]
  )

  useEffect(() => {
    if (slides.length < 2) return
    timer.current = setInterval(() => {
      if (!hovering.current) go(1)
    }, 6000)
    return () => clearInterval(timer.current)
  }, [go, slides.length])

  if (slides.length === 0) {
    return (
      <div className="relative h-[300px] sm:h-[340px] lg:h-full lg:min-h-[400px] rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center text-slate-300 text-sm font-bold">
        Pronto encontrarás ofertas aquí
      </div>
    )
  }

  const slide = slides[index]

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Ofertas principales"
      className="relative h-[300px] sm:h-[340px] lg:h-full lg:min-h-[400px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        >
          <div className="h-full flex items-center">
            {/* Texto */}
            <div className="flex-1 px-7 sm:px-10 py-8 z-10">
              <span className="inline-block bg-white/15 backdrop-blur text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/20 mb-4">
                {slide.tag}
              </span>
              <h1 className="text-[26px] sm:text-[34px] font-black text-white leading-[1.1] max-w-[320px] sm:max-w-[380px]">
                {slide.title}
              </h1>
              <p className="text-white/70 text-[13px] font-semibold mt-2.5">{slide.subtitle}</p>
              {slide.bigText && (
                <div className="mt-1 flex items-end gap-1 text-white">
                  <span className="text-[56px] sm:text-[68px] font-black leading-none tracking-tight">
                    {slide.bigText}
                  </span>
                  <span className="text-[20px] font-black mb-2 text-blue-200">{slide.bigSuffix}</span>
                </div>
              )}
              <button
                type="button"
                onClick={slide.onCta}
                className="mt-5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-bold px-6 py-3 rounded-lg shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                {slide.cta}
              </button>
            </div>
            {/* Imagen de producto real */}
            {slide.image && (
              <div className="hidden sm:block w-[42%] h-full relative">
                <img
                  src={slide.image}
                  alt={slide.imageAlt || ''}
                  width={480}
                  height={340}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.imageOverlay || 'from-slate-900/80 via-slate-900/20 to-transparent'}`} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flechas */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Slide anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Slide siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
          >
            <ChevronRight size={18} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir al slide ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
