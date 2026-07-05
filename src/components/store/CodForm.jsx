'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { COLOMBIA } from '@/lib/colombia'

const formatCOP = (v) =>
  v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

// Inline Icons (no external deps)
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
    </path>
  </svg>
)

export default function CodForm({
  product,
  company,
  selectedOffer,
  finalTotal,
  accentColor = '#4f46e5',
  mobile = false,
}) {
  const router = useRouter()

  const [firstName, setFirstName]   = useState('')
  const [lastName,  setLastName]    = useState('')
  const [phone,     setPhone]       = useState('')
  const [documentId,setDocumentId]  = useState('')
  const [department,setDepartment]  = useState('')
  const [city,      setCity]        = useState('')
  const [address,   setAddress]     = useState('')
  const [notes,     setNotes]       = useState('')
  const [citiesList,setCitiesList]  = useState([])
  const [loading,   setLoading]     = useState(false)
  const [errorMsg,  setErrorMsg]    = useState('')

  useEffect(() => {
    if (department) {
      const d = COLOMBIA.find((dep) => dep.name === department)
      setCitiesList(d ? d.cities : [])
      setCity('')
    } else {
      setCitiesList([])
      setCity('')
    }
  }, [department])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!firstName || !lastName || !phone || !department || !city || !address) {
      setErrorMsg('Por favor completa todos los campos obligatorios.')
      return
    }

    setLoading(true)
    const companyId = company.id
    const storeSlug = company.store_slug

    try {
      const clientName = `${firstName} ${lastName}`

      // Check or create client
      let clientId = null
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('company_id', companyId)
        .eq('phone', phone)
        .limit(1)

      if (existing && existing.length > 0) {
        clientId = existing[0].id
      } else {
        const { data: newClient } = await supabase
          .from('clients')
          .insert([{
            company_id: companyId,
            name: clientName,
            phone,
            address: `${address}, ${city}, ${department}`,
            document_id: documentId || 'CONSUMIDOR_FINAL',
            document_type: '13',
            type: 'persona_natural',
          }])
          .select('id')
        if (newClient?.length > 0) clientId = newClient[0].id
      }

      const invoiceId = `WEB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      const unitPrice = finalTotal / (selectedOffer.qty || 1)

      const { error: invoiceErr } = await supabase
        .from('invoices')
        .insert([{
          id: invoiceId,
          company_id: companyId,
          client_id: clientId,
          client_name: clientName,
          subtotal: finalTotal,
          tax: 0,
          total: finalTotal,
          payment_type: 'contra_entrega',
          payment_status: 'pending',
          items: [{
            productId: product.id,
            name: product.name,
            qty: selectedOffer.qty || 1,
            price: unitPrice,
            tax: 0,
          }],
          source: 'store',
          delivery_details: { firstName, lastName, phone, department, city, address, notes },
          note: notes || 'Pedido recibido a través de la tienda virtual.',
          deuda_pendiente: finalTotal,
          monto_pagado: 0,
        }])

      if (invoiceErr) throw new Error(invoiceErr.message)

      router.push(`/${storeSlug}/gracias?invoiceId=${invoiceId}&total=${finalTotal}&name=${encodeURIComponent(firstName)}`)
    } catch (err) {
      console.error('Error procesando pedido:', err)
      setErrorMsg('Hubo un problema procesando tu pedido. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ label, required, children }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span style={{ color: 'var(--danger-400)', marginLeft: '0.2rem' }}>*</span>}</label>
      {children}
    </div>
  )

  return (
    <div className="cod-form-wrap animate-slide-up">
      {/* Header */}
      <div className="cod-form-title">
        <span style={{ color: accentColor }}><TruckIcon /></span>
        Datos de envío
        <span className="badge badge-success" style={{ marginLeft: 'auto', fontWeight: 700 }}>
          💳 Pago al recibir
        </span>
      </div>

      {/* Order summary */}
      <div style={{
        background: 'var(--surface-700)', borderRadius: '0.75rem', padding: '0.85rem 1rem',
        marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tu pedido</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-foreground)', marginTop: '0.1rem' }}>
            {product.name} × {selectedOffer.qty || 1}
          </div>
        </div>
        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-foreground)', letterSpacing: '-0.02em' }}>
          {formatCOP(finalTotal)}
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem',
          fontSize: '0.825rem', color: '#f87171'
        }}>
          <AlertIcon /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* Name row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <InputField label="Nombre" required>
            <input className="input-store" type="text" placeholder="Ej: Juan" value={firstName} onChange={e => setFirstName(e.target.value)} required />
          </InputField>
          <InputField label="Apellido" required>
            <input className="input-store" type="text" placeholder="Ej: Pérez" value={lastName} onChange={e => setLastName(e.target.value)} required />
          </InputField>
        </div>

        {/* Contact row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <InputField label="Teléfono" required>
            <input className="input-store" type="tel" placeholder="3123456789" value={phone} onChange={e => setPhone(e.target.value)} required />
          </InputField>
          <InputField label="Cédula / NIT">
            <input className="input-store" type="text" placeholder="Opcional" value={documentId} onChange={e => setDocumentId(e.target.value)} />
          </InputField>
        </div>

        {/* Location row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <InputField label="Departamento" required>
            <select className="input-store" value={department} onChange={e => setDepartment(e.target.value)} required>
              <option value="">Selecciona...</option>
              {COLOMBIA.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </InputField>
          <InputField label="Ciudad / Municipio" required>
            <select className="input-store" value={city} onChange={e => setCity(e.target.value)} required disabled={!department} style={{ opacity: !department ? 0.5 : 1 }}>
              <option value="">Selecciona...</option>
              {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputField>
        </div>

        {/* Address */}
        <InputField label="Dirección de entrega" required>
          <input className="input-store" type="text" placeholder="Calle, Carrera, número, barrio..." value={address} onChange={e => setAddress(e.target.value)} required />
        </InputField>

        {/* Notes */}
        <InputField label="Indicaciones adicionales (opcional)">
          <textarea
            className="input-store"
            rows={2}
            placeholder="Ej: Dejar con el portero, casa con reja azul..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ resize: 'none' }}
          />
        </InputField>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{
            marginTop: '0.5rem',
            width: '100%',
            minHeight: '52px',
            fontSize: '0.95rem',
            background: loading ? 'var(--surface-600)' : `linear-gradient(135deg, ${accentColor}, #7c3aed)`,
            boxShadow: loading ? 'none' : `0 8px 24px ${accentColor}44`,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <><SpinnerIcon /> Procesando pedido...</>
          ) : (
            <><CheckIcon /> Confirmar pedido • {formatCOP(finalTotal)}</>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--muted-400)', marginTop: '0.25rem' }}>
          🔒 Tu información está cifrada y protegida. Pagarás al recibir tu pedido.
        </p>
      </form>
    </div>
  )
}
