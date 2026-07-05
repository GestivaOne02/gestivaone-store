'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { COLOMBIA } from '@/lib/colombia'

/* ─── Formatters ─── */
const fCOP = (v) => v == null ? '' : new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(v)

/* ─── Constants ─── */
const CATEGORY_EMOJI = { 'Alimentos':'🍎','Bebidas':'🥤','Limpieza':'🧹','Higiene':'🧴','Tecnología':'💻','Ropa':'👗','Calzado':'👟','Hogar':'🏠','Mascotas':'🐾','Juguetes':'🧸','Salud':'💊','Belleza':'💄','Deportes':'⚽','Papelería':'📝','Otros':'📦' }

const OFFERS = [
  { qty:1, discount:0,  label:'1 unidad',   sub:'Precio regular',   tag:null },
  { qty:2, discount:10, label:'2 unidades',  sub:'Ahorra 10%',       tag:'POPULAR' },
  { qty:3, discount:20, label:'3 unidades',  sub:'El mejor precio',  tag:'MEJOR VALOR' },
]

const TICKER_ITEMS = ['✅ Pago contra entrega','🚚 Envío a toda Colombia','🔒 Compra 100% segura','⭐ Miles de clientes felices','💳 Sin tarjeta de crédito','📦 Garantía incluida','⚡ Despacho en 24h','🎁 Empaque protegido','✅ Pago contra entrega','🚚 Envío a toda Colombia','🔒 Compra 100% segura','⭐ Miles de clientes felices','💳 Sin tarjeta de crédito','📦 Garantía incluida']

const TESTIMONIALS = [
  { name:'María González', city:'Bogotá', rating:5, date:'hace 2 días', text:'¡Excelente producto! Llegó súper rápido y en perfecto estado. El empaque estaba muy bien protegido. Definitivamente volvería a comprar. Lo recomiendo al 100%.', verified:true, emoji:'👩' },
  { name:'Carlos Ramírez', city:'Medellín', rating:5, date:'hace 5 días', text:'Muy buena calidad, mejor de lo que esperaba. El servicio al cliente fue excelente cuando tuve una pregunta. Llegó en 3 días hábiles. Completamente satisfecho.', verified:true, emoji:'👨' },
  { name:'Andrea Torres', city:'Cali', rating:5, date:'hace 1 semana', text:'Lo pedí para regalar y quedó perfecto. La presentación es muy bonita. El producto es de muy buena calidad. Mi familia quedó encantada. Lo recomiendo mucho.', verified:true, emoji:'👩‍💼' },
  { name:'Juan Pérez', city:'Barranquilla', rating:5, date:'hace 2 semanas', text:'Confiable y rápido. Seguí el estado del pedido por WhatsApp. Todo llegó como prometido. La calidad es excelente para el precio. Repetiría la compra sin dudarlo.', verified:true, emoji:'👨‍💼' },
  { name:'Luisa Morales', city:'Bucaramanga', rating:4, date:'hace 3 semanas', text:'Muy buen producto. El único inconveniente fue que tardó un día más de lo esperado, pero el servicio fue muy atento y me avisaron. La calidad es muy buena.', verified:true, emoji:'👩‍🦱' },
  { name:'Ricardo Silva', city:'Pereira', rating:5, date:'hace 1 mes', text:'Increíble relación calidad-precio. Lo usé desde que llegó y funciona perfectamente. El pago contra entrega me dio mucha confianza para comprar. Excelente experiencia.', verified:true, emoji:'👨‍🦰' },
]

const FAQ_ITEMS = [
  { q:'¿Cómo funciona el pago contra entrega?', a:'Muy simple: haces tu pedido aquí, lo preparamos y te lo enviamos. Pagas el valor exacto en efectivo directamente al mensajero cuando recibas tu producto en la puerta de tu casa. Sin tarjetas ni pagos anticipados.' },
  { q:'¿Cuánto tiempo tarda el envío?', a:'Generalmente de 2 a 5 días hábiles dependiendo de tu ciudad. Para las principales ciudades como Bogotá, Medellín y Cali suele ser más rápido (1-3 días).' },
  { q:'¿Puedo cambiar o devolver el producto?', a:'Sí, tienes 5 días hábiles después de recibir tu pedido para reportar cualquier problema. Si el producto llegó en mal estado o no corresponde a lo descrito, hacemos el cambio sin costo adicional.' },
  { q:'¿Cómo puedo rastrear mi pedido?', a:'Una vez despachado, te contactaremos por WhatsApp con el número de guía para que puedas rastrear tu pedido en tiempo real con la empresa de mensajería.' },
  { q:'¿Es seguro comprar aquí?', a:'Absolutamente. Solo pagas cuando recibes el producto. No necesitas tarjeta de crédito ni datos bancarios. Es la forma más segura de comprar en línea en Colombia.' },
]

/* ─── Tiny SVG Icons ─── */
const IC = {
  Star: ({fill='#fbbf24',s=14}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={fill}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Truck: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Shield: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Zap: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Chevron: ({up}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  Package: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Spin: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>,
}

/* ─── Scroll Progress Bar ─── */
function ScrollProgress({ color }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0,1], [0,1])
  return (
    <motion.div style={{ scaleX, transformOrigin:'left', position:'fixed', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${color},#7c3aed)`, zIndex:100 }} />
  )
}

/* ─── Infinite Ticker ─── */
function Ticker({ color }) {
  return (
    <div style={{ overflow:'hidden', background:'rgba(255,255,255,0.03)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'0.6rem 0', userSelect:'none', position:'relative' }}>
      <motion.div
        style={{ display:'flex', gap:'2.5rem', width:'max-content', whiteSpace:'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease:'linear', repeat:Infinity }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} style={{ fontSize:'0.72rem', fontWeight:700, color:'#d1d5db', letterSpacing:'0.05em', display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Star Rating ─── */
function Stars({ n = 5, size = 14 }) {
  return (
    <span style={{ display:'inline-flex', gap:'1px' }}>
      {[...Array(5)].map((_,i) => <IC.Star key={i} fill={i < n ? '#fbbf24' : '#374151'} s={size} />)}
    </span>
  )
}

/* ─── Live Viewers Counter ─── */
function LiveViewers() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(Math.floor(Math.random() * 30) + 15)
    const t = setInterval(() => setCount(c => c + (Math.random() > 0.5 ? 1 : -1)), 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <motion.div
      initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
      style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'9999px', padding:'0.25rem 0.7rem', fontSize:'0.72rem', fontWeight:700, color:'#f87171' }}
    >
      <motion.span animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.5, repeat:Infinity }} style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', display:'inline-block' }} />
      <IC.Eye /> <AnimatePresence mode="wait"><motion.span key={count} initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }} style={{ fontVariantNumeric:'tabular-nums' }}>{count}</motion.span></AnimatePresence>
      {' '}personas viendo esto ahora
    </motion.div>
  )
}

/* ─── Countdown Timer ─── */
function Countdown({ color }) {
  const [time, setTime] = useState({ h:1, m:59, s:48 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--; if (s < 0) { s=59; m-- } if (m < 0) { m=59; h-- } if (h < 0) { h=1; m=59; s=59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = n => String(n).padStart(2,'0')
  const Unit = ({ val, label }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', background:'rgba(0,0,0,0.4)', borderRadius:'0.4rem', padding:'0.3rem 0.5rem', minWidth:'2.5rem' }}>
      <span style={{ fontFamily:'monospace', fontSize:'1.1rem', fontWeight:900, color:'#fff', lineHeight:1 }}>{pad(val)}</span>
      <span style={{ fontSize:'0.5rem', color:'#9ca3af', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:'0.15rem' }}>{label}</span>
    </div>
  )
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.3rem', background:`linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))`, border:'1px solid rgba(239,68,68,0.2)', borderRadius:'0.75rem', padding:'0.5rem 0.75rem', width:'fit-content' }}>
      <span style={{ fontSize:'0.65rem', fontWeight:800, color:'#f87171', textTransform:'uppercase', letterSpacing:'0.04em', marginRight:'0.3rem' }}>⏱ Oferta termina en</span>
      <Unit val={time.h} label="h" />
      <span style={{ color:'#f87171', fontWeight:900 }}>:</span>
      <Unit val={time.m} label="m" />
      <span style={{ color:'#f87171', fontWeight:900 }}>:</span>
      <Unit val={time.s} label="s" />
    </div>
  )
}

/* ─── Quantity Offer Card ─── */
function OfferCard({ offer, basePrice, selected, onSelect, color }) {
  const unitPrice = basePrice * (1 - offer.discount / 100)
  const total = unitPrice * offer.qty
  const savings = offer.discount > 0 ? (basePrice - unitPrice) * offer.qty : 0
  const isSelected = selected.qty === offer.qty

  return (
    <motion.button
      whileHover={{ scale: 1.01 }} whileTap={{ scale:0.99 }}
      onClick={() => onSelect({ qty:offer.qty, discount:offer.discount })}
      style={{
        width:'100%', textAlign:'left', cursor:'pointer', padding:'0.75rem 1rem', borderRadius:'0.85rem',
        border: isSelected ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.06)',
        background: isSelected ? `linear-gradient(135deg, ${color}12, ${color}06)` : 'rgba(255,255,255,0.02)',
        position:'relative', overflow:'hidden', transition:'border-color 0.2s, background 0.2s',
        boxShadow: isSelected ? `0 0 0 1px ${color}22, 0 4px 16px ${color}18` : 'none',
      }}
    >
      {isSelected && <motion.div layoutId="selectedBar" style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,${color},#7c3aed)` }} />}
      {offer.tag && (
        <span style={{ position:'absolute', top:'0.5rem', right:'0.6rem', fontSize:'0.55rem', fontWeight:900, color: offer.tag === 'MEJOR VALOR' ? '#34d399' : '#fbbf24', background: offer.tag === 'MEJOR VALOR' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)', border:`1px solid ${offer.tag === 'MEJOR VALOR' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`, borderRadius:'4px', padding:'0.1rem 0.35rem', letterSpacing:'0.04em' }}>
          {offer.tag}
        </span>
      )}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
          <div style={{ width:'1.3rem', height:'1.3rem', borderRadius:'50%', border:`2px solid ${isSelected ? color : 'rgba(255,255,255,0.15)'}`, background: isSelected ? color : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
            {isSelected && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.825rem', color:'#fff' }}>{offer.label}</div>
            <div style={{ fontSize:'0.65rem', color: savings > 0 ? '#34d399' : '#9ca3af', fontWeight:600, marginTop:'0.05rem' }}>
              {savings > 0 ? `Ahorras ${fCOP(savings)}` : offer.sub}
            </div>
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontWeight:900, fontSize:'1rem', color:'#fff', letterSpacing:'-0.02em' }}>{fCOP(total)}</div>
          {offer.qty > 1 && <div style={{ fontSize:'0.62rem', color:'#6b7280' }}>{fCOP(unitPrice)} c/u</div>}
        </div>
      </div>
    </motion.button>
  )
}

/* ─── COD Form ─── */
function CodForm({ product, company, selectedOffer, finalTotal, accentColor, onClose }) {
  const router = useRouter()
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', documentId:'', department:'', city:'', address:'', notes:'' })
  const [citiesList, setCitiesList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (form.department) {
      const d = COLOMBIA.find(dep => dep.name === form.department)
      setCitiesList(d ? d.cities : [])
      setForm(f => ({ ...f, city:'' }))
    } else { setCitiesList([]); setForm(f => ({ ...f, city:'' })) }
  }, [form.department])

  const set = (k, v) => setForm(f => ({ ...f, [k]:v }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.firstName || !form.lastName || !form.phone || !form.department || !form.city || !form.address) {
      setError('Por favor completa todos los campos obligatorios.'); return
    }
    setLoading(true)
    try {
      const clientName = `${form.firstName} ${form.lastName}`
      let clientId = null
      const { data: existing } = await supabase.from('clients').select('id').eq('company_id', company.id).eq('phone', form.phone).limit(1)
      if (existing?.length > 0) { clientId = existing[0].id }
      else {
        const { data: nc } = await supabase.from('clients').insert([{ company_id:company.id, name:clientName, phone:form.phone, address:`${form.address}, ${form.city}, ${form.department}`, document_id:form.documentId||'CONSUMIDOR_FINAL', document_type:'13', type:'persona_natural' }]).select('id')
        if (nc?.length > 0) clientId = nc[0].id
      }
      const invoiceId = `WEB-${Math.random().toString(36).substring(2,9).toUpperCase()}`
      const unitPrice = finalTotal / (selectedOffer.qty || 1)
      const { error: err } = await supabase.from('invoices').insert([{ id:invoiceId, company_id:company.id, client_id:clientId, client_name:clientName, subtotal:finalTotal, tax:0, total:finalTotal, payment_type:'contra_entrega', payment_status:'pending', items:[{ productId:product.id, name:product.name, qty:selectedOffer.qty||1, price:unitPrice, tax:0 }], source:'store', delivery_details:{ ...form }, note:form.notes||'Pedido desde tienda virtual.', deuda_pendiente:finalTotal, monto_pagado:0 }])
      if (err) throw new Error(err.message)
      router.push(`/${company.store_slug}/gracias?invoiceId=${invoiceId}&total=${finalTotal}&name=${encodeURIComponent(form.firstName)}`)
    } catch(err) { setError('Error procesando tu pedido. Intenta de nuevo.') }
    finally { setLoading(false) }
  }

  const inputStyle = { width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff', borderRadius:'0.6rem', padding:'0.7rem 0.9rem', fontSize:'0.875rem', fontFamily:'inherit', outline:'none', transition:'border-color 0.2s', minHeight:'44px' }
  const labelStyle = { display:'block', fontSize:'0.65rem', fontWeight:800, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.35rem' }

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ background:'rgba(15,15,24,0.95)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'1.25rem', padding:'1.5rem', backdropFilter:'blur(20px)' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span style={{ color:accentColor }}><IC.Truck /></span>
          <span style={{ fontWeight:800, fontSize:'1rem', color:'#fff' }}>Datos de envío</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#34d399', background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.2)', borderRadius:'9999px', padding:'0.2rem 0.6rem' }}>
            💳 Pago al recibir
          </span>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:'50%', width:28, height:28, cursor:'pointer', color:'#9ca3af', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontWeight:700 }}>×</button>
        </div>
      </div>

      {/* Order summary */}
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'0.75rem', padding:'0.85rem 1rem', marginBottom:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:'0.65rem', color:'#6b7280', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>Tu pedido</div>
          <div style={{ fontWeight:700, color:'#fff', fontSize:'0.875rem', marginTop:'0.15rem' }}>{product.name} × {selectedOffer.qty || 1}</div>
        </div>
        <div style={{ fontWeight:900, fontSize:'1.15rem', color:'#fff', letterSpacing:'-0.02em' }}>{fCOP(finalTotal)}</div>
      </div>

      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'0.6rem', padding:'0.65rem 0.9rem', marginBottom:'1rem', fontSize:'0.8rem', color:'#f87171' }}>
          <IC.Alert /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
          <div><label style={labelStyle}>Nombre *</label><input style={inputStyle} placeholder="Juan" value={form.firstName} onChange={e=>set('firstName',e.target.value)} required onFocus={e=>{e.target.style.borderColor=accentColor}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)'}} /></div>
          <div><label style={labelStyle}>Apellido *</label><input style={inputStyle} placeholder="Pérez" value={form.lastName} onChange={e=>set('lastName',e.target.value)} required onFocus={e=>{e.target.style.borderColor=accentColor}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)'}} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
          <div><label style={labelStyle}>Teléfono *</label><input style={inputStyle} type="tel" placeholder="3123456789" value={form.phone} onChange={e=>set('phone',e.target.value)} required onFocus={e=>{e.target.style.borderColor=accentColor}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)'}} /></div>
          <div><label style={labelStyle}>Cédula / NIT</label><input style={inputStyle} placeholder="Opcional" value={form.documentId} onChange={e=>set('documentId',e.target.value)} onFocus={e=>{e.target.style.borderColor=accentColor}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)'}} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
          <div>
            <label style={labelStyle}>Departamento *</label>
            <select style={{ ...inputStyle, cursor:'pointer', appearance:'none' }} value={form.department} onChange={e=>set('department',e.target.value)} required>
              <option value="">Selecciona...</option>
              {COLOMBIA.map(d=><option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ciudad *</label>
            <select style={{ ...inputStyle, cursor:'pointer', appearance:'none', opacity:!form.department?0.5:1 }} value={form.city} onChange={e=>set('city',e.target.value)} required disabled={!form.department}>
              <option value="">Selecciona...</option>
              {citiesList.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div><label style={labelStyle}>Dirección de entrega *</label><input style={inputStyle} placeholder="Calle, Carrera, número, barrio..." value={form.address} onChange={e=>set('address',e.target.value)} required onFocus={e=>{e.target.style.borderColor=accentColor}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)'}} /></div>
        <div><label style={labelStyle}>Indicaciones adicionales</label><textarea style={{ ...inputStyle, resize:'none' }} rows={2} placeholder="Ej: Dejar en portería, casa con reja azul..." value={form.notes} onChange={e=>set('notes',e.target.value)} onFocus={e=>{e.target.style.borderColor=accentColor}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.08)'}} /></div>

        <motion.button type="submit" disabled={loading} whileHover={{ scale:loading?1:1.01 }} whileTap={{ scale:loading?1:0.98 }} style={{ width:'100%', minHeight:'52px', borderRadius:'0.85rem', border:'none', cursor:loading?'not-allowed':'pointer', fontWeight:900, fontSize:'1rem', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', background: loading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${accentColor}, #7c3aed)`, boxShadow: loading ? 'none' : `0 8px 28px ${accentColor}44`, opacity:loading?0.7:1, marginTop:'0.25rem' }}>
          {loading ? <><IC.Spin /> Procesando...</> : <><IC.Check /> Confirmar pedido — {fCOP(finalTotal)}</>}
        </motion.button>
        <p style={{ textAlign:'center', fontSize:'0.68rem', color:'#6b7280' }}>🔒 Tu información está cifrada. Solo pagas al recibir tu pedido en casa.</p>
      </form>
    </motion.div>
  )
}

/* ─── Benefits Section ─── */
const BENEFITS = [
  { icon:'🚚', title:'Envío a todo Colombia', desc:'Llegamos a todas las ciudades y municipios del país.' },
  { icon:'💳', title:'Pago al recibir', desc:'No necesitas tarjeta. Pagas cuando te llega el producto.' },
  { icon:'🔒', title:'Compra 100% segura', desc:'Proceso verificado y protegido. Sin riesgos.' },
  { icon:'↩️', title:'Garantía de satisfacción', desc:'¿No te gustó? Reporta en 5 días y lo solucionamos.' },
]

/* ─── FAQ Section ─── */
function FAQItem({ item, color, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', overflow:'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:'100%', textAlign:'left', padding:'1rem 0', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', background:'none', border:'none', cursor:'pointer', color:'#fff' }}
      >
        <span style={{ fontWeight:700, fontSize:'0.9rem', color:'#f3f4f6', flex:1 }}>{item.q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.25 }} style={{ flexShrink:0, color:open ? color : '#6b7280' }}>
          <IC.Chevron />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25, ease:'easeInOut' }}>
            <p style={{ fontSize:'0.875rem', color:'#9ca3af', lineHeight:1.7, paddingBottom:'1rem' }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main Landing Component ─── */
export default function ProductLanding({ product, company, storeSlug }) {
  const [selectedOffer, setSelectedOffer] = useState({ qty:1, discount:0 })
  const [showForm, setShowForm] = useState(false)
  const [recentSale, setRecentSale] = useState(null)
  const formRef = useRef(null)

  const accentColor = company?.store_settings?.accent_color || '#4f46e5'
  const whatsapp = company?.store_settings?.whatsapp_contact || ''
  const emoji = CATEGORY_EMOJI[product.category] || '📦'
  const imageUrl = product.image_url && product.image_url !== 'none' ? product.image_url : null

  const hasDiscount = product.discount_value && product.discount_value > 0
  const baseDiscountPct = hasDiscount ? (product.discount_type === 'percentage' ? product.discount_value : (product.discount_value / product.price) * 100) : 0
  const basePrice = hasDiscount ? (product.discount_type === 'percentage' ? product.price * (1 - product.discount_value / 100) : product.price - product.discount_value) : product.price
  const originalPrice = product.price

  const offer = OFFERS.find(o => o.qty === selectedOffer.qty) || OFFERS[0]
  const finalUnitPrice = basePrice * (1 - selectedOffer.discount / 100)
  const finalTotal = finalUnitPrice * selectedOffer.qty

  /* Fake recent sale toast */
  const NAMES = ['Valentina R.','Carlos M.','Luisa T.','Andrés G.','María F.','Diego P.']
  const CITIES = ['Bogotá','Medellín','Cali','Barranquilla','Bucaramanga']
  useEffect(() => {
    const show = () => {
      setRecentSale({ name:NAMES[Math.floor(Math.random()*NAMES.length)], city:CITIES[Math.floor(Math.random()*CITIES.length)], mins:Math.floor(Math.random()*29)+1 })
      setTimeout(() => setRecentSale(null), 4000)
    }
    const first = setTimeout(show, 4000)
    const interval = setInterval(show, 18000)
    return () => { clearTimeout(first); clearInterval(interval) }
  }, [])

  const handleBuy = () => {
    setShowForm(true)
    setTimeout(() => formRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100)
  }

  const handleWhatsApp = () => {
    if (!whatsapp) return
    const msg = `Hola! Quiero comprar *${product.name}* (${selectedOffer.qty} ud${selectedOffer.qty>1?'s':''}) por *${fCOP(finalTotal)}* 🛒`
    window.open(`https://wa.me/${whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <ScrollProgress color={accentColor} />

      {/* Ticker */}
      <Ticker color={accentColor} />

      {/* ─── HERO ─── */}
      <section style={{ padding:'2rem 0 0' }}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:60, left:'50%', transform:'translateX(-50%)', width:700, height:400, borderRadius:'50%', background:`radial-gradient(circle, ${accentColor} 0%, transparent 70%)`, opacity:0.04, filter:'blur(80px)', pointerEvents:'none', zIndex:0 }} />

        <div className="container-store" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'2.5rem', alignItems:'start' }} className="product-hero-grid">
            <style>{`
              @media(min-width:768px){.product-hero-grid{grid-template-columns:1fr 1fr!important;align-items:start}}
              @media(min-width:1024px){.product-hero-grid{grid-template-columns:55% 45%!important}}
            `}</style>

            {/* ── Left: Image ── */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, ease:'easeOut' }}>
              {/* Urgency banner */}
              {(hasDiscount || product.featured) && (
                <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem', flexWrap:'wrap' }}>
                  {product.featured && <span style={{ fontSize:'0.7rem', fontWeight:900, background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', padding:'0.3rem 0.75rem', borderRadius:'4px', letterSpacing:'0.04em' }}>⭐ MEGA OFERTA</span>}
                  {hasDiscount && <span style={{ fontSize:'0.7rem', fontWeight:900, background:'rgba(239,68,68,0.9)', color:'#fff', padding:'0.3rem 0.75rem', borderRadius:'4px', letterSpacing:'0.04em' }}>-{Math.round(baseDiscountPct)}%</span>}
                </motion.div>
              )}

              {/* Main image */}
              <motion.div
                whileHover={{ scale:1.01 }}
                style={{ position:'relative', borderRadius:'1.25rem', overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', background:'linear-gradient(135deg,#13131e,#191926)', aspectRatio:'1/1', maxHeight:'500px' }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
                    <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }} style={{ fontSize:'6rem' }}>{emoji}</motion.div>
                    <span style={{ fontSize:'0.75rem', color:'#4b5563', fontWeight:600 }}>{product.category}</span>
                  </div>
                )}

                {/* Glass overlay on image — trust */}
                <div style={{ position:'absolute', bottom:'0.75rem', left:'0.75rem', right:'0.75rem' }}>
                  <div style={{ background:'rgba(10,10,15,0.75)', backdropFilter:'blur(12px)', borderRadius:'0.75rem', padding:'0.6rem 0.9rem', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.5rem' }}>
                    <LiveViewers />
                    <div style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}><Stars n={5} size={11} /><span style={{ fontSize:'0.65rem', color:'#9ca3af', fontWeight:600 }}>({TESTIMONIALS.length} reseñas)</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Stock indicator */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }} style={{ marginTop:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <IC.Zap />
                <span style={{ fontSize:'0.72rem', color:'#fbbf24', fontWeight:700 }}>¡Quedan pocas unidades disponibles!</span>
              </motion.div>
            </motion.div>

            {/* ── Right: Purchase Panel ── */}
            <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, ease:'easeOut', delay:0.1 }} style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>

              {/* Category + Rating */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
                <span style={{ fontSize:'0.65rem', fontWeight:800, color:accentColor, textTransform:'uppercase', letterSpacing:'0.08em', background:`${accentColor}18`, padding:'0.25rem 0.7rem', borderRadius:'9999px', border:`1px solid ${accentColor}30` }}>{product.category || 'Producto'}</span>
                <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                  <Stars n={5} size={13} />
                  <span style={{ fontSize:'0.72rem', color:'#9ca3af', fontWeight:600 }}>5.0 ({TESTIMONIALS.length} opiniones)</span>
                </div>
              </div>

              {/* Product Name */}
              <h1 style={{ fontSize:'1.75rem', fontWeight:900, letterSpacing:'-0.03em', lineHeight:1.1, color:'#fff' }}>
                {product.name}
              </h1>

              {/* Price block */}
              <div style={{ display:'flex', alignItems:'baseline', gap:'0.85rem', flexWrap:'wrap' }}>
                <span style={{ fontSize:'2.2rem', fontWeight:900, letterSpacing:'-0.04em', color:'#fff' }}>
                  {fCOP(finalUnitPrice * selectedOffer.qty)}
                </span>
                {hasDiscount && (
                  <span style={{ fontSize:'1.2rem', color:'#6b7280', textDecoration:'line-through', fontWeight:500 }}>
                    {fCOP(originalPrice * selectedOffer.qty)}
                  </span>
                )}
                {hasDiscount && (
                  <span style={{ fontSize:'0.8rem', fontWeight:900, color:'#34d399', background:'rgba(52,211,153,0.1)', border:'1px solid rgba(52,211,153,0.2)', padding:'0.2rem 0.6rem', borderRadius:'6px' }}>
                    AHORRAS {fCOP((originalPrice - finalUnitPrice) * selectedOffer.qty)}
                  </span>
                )}
              </div>

              {/* Countdown */}
              <Countdown color={accentColor} />

              {/* Quantity offers */}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                <div style={{ fontSize:'0.65rem', fontWeight:800, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.07em' }}>Ofertas por cantidad</div>
                {OFFERS.map(o => (
                  <OfferCard key={o.qty} offer={o} basePrice={basePrice} selected={selectedOffer} onSelect={setSelectedOffer} color={accentColor} />
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                <motion.button
                  whileHover={{ scale:1.01, boxShadow:`0 12px 36px ${accentColor}60` }}
                  whileTap={{ scale:0.98 }}
                  onClick={handleBuy}
                  style={{ width:'100%', minHeight:'56px', borderRadius:'0.9rem', border:'none', cursor:'pointer', fontWeight:900, fontSize:'1.05rem', color:'#fff', letterSpacing:'0.02em', background:`linear-gradient(135deg, ${accentColor} 0%, #7c3aed 100%)`, boxShadow:`0 8px 28px ${accentColor}44`, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}
                >
                  <IC.Truck /> Pagar Contra Entrega
                </motion.button>

                {whatsapp && (
                  <motion.button
                    whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                    onClick={handleWhatsApp}
                    style={{ width:'100%', minHeight:'50px', borderRadius:'0.9rem', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.95rem', color:'#fff', background:'#25d366', boxShadow:'0 6px 20px rgba(37,211,102,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}
                  >
                    <IC.Phone /> Consultar por WhatsApp
                  </motion.button>
                )}
              </div>

              {/* Trust row */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', paddingTop:'0.25rem' }}>
                {[['🔒','Compra segura'],['📦','Garantía incluida'],['🚚','Envío Colombia']].map(([icon,text]) => (
                  <div key={text} style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.67rem', fontWeight:700, color:'#9ca3af' }}>
                    <span>{icon}</span> {text}
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'0.85rem', padding:'1rem' }}>
                  <p style={{ fontSize:'0.85rem', color:'#9ca3af', lineHeight:1.7, margin:0 }}>{product.description}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Second Ticker ─── */}
      <div style={{ marginTop:'3rem' }}><Ticker color={accentColor} /></div>

      {/* ─── Benefits ─── */}
      <section style={{ padding:'3rem 0' }}>
        <div className="container-store">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'2rem' }}>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>¿Por qué comprar aquí?</h2>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.85rem' }} className="benefits-grid">
            <style>{`@media(min-width:768px){.benefits-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
            {BENEFITS.map((b, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }} whileHover={{ y:-3 }}
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'1rem', padding:'1.25rem', textAlign:'center' }}>
                <div style={{ fontSize:'2rem', marginBottom:'0.65rem' }}>{b.icon}</div>
                <div style={{ fontWeight:800, fontSize:'0.825rem', color:'#f3f4f6', marginBottom:'0.35rem' }}>{b.title}</div>
                <div style={{ fontSize:'0.72rem', color:'#6b7280', lineHeight:1.5 }}>{b.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COD Form Section ─── */}
      <div ref={formRef} style={{ scrollMarginTop:'80px' }}>
        {showForm && (
          <section style={{ padding:'0 0 3rem' }}>
            <div className="container-store" style={{ maxWidth:'680px' }}>
              <CodForm product={product} company={company} selectedOffer={selectedOffer} finalTotal={finalUnitPrice * selectedOffer.qty} accentColor={accentColor} onClose={() => setShowForm(false)} />
            </div>
          </section>
        )}
      </div>

      {/* ─── Testimonials ─── */}
      <section style={{ padding:'3rem 0', background:'rgba(255,255,255,0.01)', borderTop:'1px solid rgba(255,255,255,0.04)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-store">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'1rem', marginBottom:'2rem' }}>
            <div>
              <h2 style={{ fontSize:'1.4rem', fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>Lo que dicen nuestros clientes</h2>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.35rem' }}>
                <Stars n={5} size={15} />
                <span style={{ fontSize:'0.8rem', color:'#9ca3af', fontWeight:600 }}>5.0 basado en {TESTIMONIALS.length} opiniones verificadas</span>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
              {[5,4,3].map(s => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span style={{ fontSize:'0.65rem', color:'#9ca3af', width:'0.7rem' }}>{s}</span>
                  <IC.Star fill="#fbbf24" s={10} />
                  <div style={{ width:'80px', height:'5px', borderRadius:'9999px', background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
                    <div style={{ width: s===5 ? '100%' : s===4 ? '15%' : '0%', height:'100%', background:'#fbbf24', borderRadius:'inherit', transition:'width 0.8s' }} />
                  </div>
                  <span style={{ fontSize:'0.65rem', color:'#6b7280' }}>{s===5?TESTIMONIALS.length:s===4?1:0}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(1,1fr)', gap:'1rem' }} className="reviews-grid">
            <style>{`
              @media(min-width:640px){.reviews-grid{grid-template-columns:repeat(2,1fr)!important}}
              @media(min-width:1024px){.reviews-grid{grid-template-columns:repeat(3,1fr)!important}}
            `}</style>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }} whileHover={{ y:-2 }}
                style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'1rem', padding:'1.1rem', display:'flex', flexDirection:'column', gap:'0.7rem' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'0.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                    <div style={{ width:'2.25rem', height:'2.25rem', borderRadius:'50%', background:`${accentColor}20`, border:`1px solid ${accentColor}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{t.emoji}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:'0.8rem', color:'#f3f4f6', display:'flex', alignItems:'center', gap:'0.35rem' }}>
                        {t.name}
                        {t.verified && <span style={{ fontSize:'0.55rem', color:'#34d399', background:'rgba(52,211,153,0.1)', borderRadius:'4px', padding:'0.1rem 0.35rem', fontWeight:700 }}>✓ Verificado</span>}
                      </div>
                      <div style={{ fontSize:'0.65rem', color:'#6b7280', fontWeight:600 }}>{t.city} · {t.date}</div>
                    </div>
                  </div>
                  <Stars n={t.rating} size={11} />
                </div>
                <p style={{ fontSize:'0.8rem', color:'#9ca3af', lineHeight:1.6, margin:0 }}>&ldquo;{t.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding:'3rem 0' }}>
        <div className="container-store" style={{ maxWidth:'720px', margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'2rem' }}>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>Preguntas frecuentes</h2>
          </motion.div>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'1rem', padding:'0 1.5rem' }}>
            {FAQ_ITEMS.map((item, i) => <FAQItem key={i} item={item} color={accentColor} i={i} />)}
          </div>
        </div>
      </section>

      {/* ─── Guarantee ─── */}
      <section style={{ padding:'0 0 3rem' }}>
        <div className="container-store">
          <motion.div initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            style={{ background:`linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(124,58,237,0.06) 100%)`, border:'1px solid rgba(99,102,241,0.15)', borderRadius:'1.25rem', padding:'2rem', textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>🛡️</div>
            <h3 style={{ fontSize:'1.2rem', fontWeight:900, color:'#fff', marginBottom:'0.5rem' }}>Garantía de satisfacción</h3>
            <p style={{ fontSize:'0.875rem', color:'#9ca3af', maxWidth:'480px', margin:'0 auto', lineHeight:1.7 }}>
              Si el producto llega en mal estado o no es lo que esperabas, tienes <strong style={{ color:'#a5b4fc' }}>5 días hábiles</strong> para reportarlo y lo solucionamos sin costo adicional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section style={{ padding:'3rem 0', background:'rgba(255,255,255,0.01)', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="container-store" style={{ textAlign:'center' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h2 style={{ fontSize:'1.6rem', fontWeight:900, color:'#fff', letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>¿Listo para pedirlo?</h2>
            <p style={{ color:'#6b7280', fontSize:'0.9rem', marginBottom:'1.5rem' }}>Paga cuando lo recibas. Sin riesgo. Sin tarjeta.</p>
            <motion.button
              whileHover={{ scale:1.02, boxShadow:`0 16px 48px ${accentColor}60` }}
              whileTap={{ scale:0.97 }}
              onClick={handleBuy}
              style={{ padding:'1rem 2.5rem', borderRadius:'0.9rem', border:'none', cursor:'pointer', fontWeight:900, fontSize:'1.1rem', color:'#fff', background:`linear-gradient(135deg, ${accentColor}, #7c3aed)`, boxShadow:`0 8px 28px ${accentColor}44`, display:'inline-flex', alignItems:'center', gap:'0.65rem' }}
            >
              <IC.Truck /> Pagar Contra Entrega — {fCOP(finalUnitPrice * selectedOffer.qty)}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="store-footer">
        <p>© {new Date().getFullYear()} <strong style={{ color:'#f3f4f6' }}>{company.name}</strong>. Todos los derechos reservados.</p>
        <p style={{ marginTop:'0.35rem' }}>Tecnología de <a href="https://gestivaone.com" target="_blank" rel="noopener noreferrer">GestivaOne</a></p>
      </footer>

      {/* ─── Sticky Bottom Bar (mobile) ─── */}
      {!showForm && (
        <motion.div
          initial={{ y:100 }} animate={{ y:0 }} transition={{ type:'spring', damping:20 }}
          style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:50, backdropFilter:'blur(20px)', background:'rgba(10,10,15,0.92)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'0.85rem 1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}
          className="sticky-cta-bar"
        >
          <style>{`@media(min-width:768px){.sticky-cta-bar{display:none!important}}`}</style>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'0.65rem', color:'#6b7280', fontWeight:700 }}>Total</div>
            <div style={{ fontSize:'1.15rem', fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>{fCOP(finalUnitPrice * selectedOffer.qty)}</div>
          </div>
          <motion.button whileTap={{ scale:0.97 }} onClick={handleBuy}
            style={{ flex:2, minHeight:'48px', borderRadius:'0.8rem', border:'none', cursor:'pointer', fontWeight:800, fontSize:'0.9rem', color:'#fff', background:`linear-gradient(135deg,${accentColor},#7c3aed)`, boxShadow:`0 6px 20px ${accentColor}44`, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
            <IC.Truck /> Pedir ahora
          </motion.button>
        </motion.div>
      )}

      {/* ─── WhatsApp Float Button ─── */}
      {whatsapp && (
        <motion.button
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:2, type:'spring', damping:15 }}
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.95 }}
          onClick={handleWhatsApp}
          style={{ position:'fixed', bottom:'5.5rem', right:'1rem', zIndex:49, width:'3.25rem', height:'3.25rem', borderRadius:'50%', background:'#25d366', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(37,211,102,0.5)', color:'#fff' }}
        >
          <style>{`@media(min-width:768px){.wa-float{bottom:1.5rem!important}}`}</style>
          <IC.Phone />
          <motion.div animate={{ scale:[1,1.4,1] }} transition={{ duration:2, repeat:Infinity }} style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid #25d366', opacity:0.5 }} />
        </motion.button>
      )}

      {/* ─── Recent Sale Toast ─── */}
      <AnimatePresence>
        {recentSale && (
          <motion.div
            initial={{ opacity:0, x:-100, y:0 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-100 }}
            style={{ position:'fixed', bottom:'5.5rem', left:'1rem', zIndex:49, background:'rgba(15,15,24,0.95)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'0.85rem', padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:'0.6rem', maxWidth:'240px', boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}
          >
            <div style={{ width:'2rem', height:'2rem', borderRadius:'50%', background:`${accentColor}20`, border:`1px solid ${accentColor}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>🛍️</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:800, fontSize:'0.72rem', color:'#fff' }}>{recentSale.name} · {recentSale.city}</div>
              <div style={{ fontSize:'0.65rem', color:'#6b7280', fontWeight:600 }}>Compró hace {recentSale.mins} min</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
