'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { COLOMBIA } from '@/lib/colombia'
import { Truck, CheckCircle, AlertTriangle } from 'lucide-react'

export default function CodForm({
  product,
  quantity,
  totalPrice,
  storeSlug,
  companyId,
  accentColor = '#4f46e5',
}) {
  const router = useRouter()

  // Form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [documentId, setDocumentId] = useState('') // Cédula/NIT
  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  // UI States
  const [citiesList, setCitiesList] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Load cities list when department changes
  useEffect(() => {
    if (department) {
      const selectedDept = COLOMBIA.find((d) => d.name === department)
      setCitiesList(selectedDept ? selectedDept.cities : [])
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
      setErrorMsg('Por favor completa todos los campos requeridos.')
      return
    }

    setLoading(true)

    try {
      // 1. Create or Find Client in Supabase
      // Check if client exists with same phone or email
      let clientId = null
      const clientName = `${firstName} ${lastName}`

      const { data: existingClient, error: clientFetchError } = await supabase
        .from('clients')
        .select('id')
        .eq('company_id', companyId)
        .eq('phone', phone)
        .limit(1)

      if (existingClient && existingClient.length > 0) {
        clientId = existingClient[0].id
      } else {
        // Insert new client
        const { data: newClient, error: clientInsertError } = await supabase
          .from('clients')
          .insert([
            {
              company_id: companyId,
              name: clientName,
              phone: phone,
              address: `${address}, ${city}, ${department}`,
              document_id: documentId || 'CONSUMIDOR_FINAL',
              document_type: documentId ? '13' : '13', // Cédula de ciudadanía
              type: 'persona_natural',
            },
          ])
          .select('id')

        if (!clientInsertError && newClient && newClient.length > 0) {
          clientId = newClient[0].id
        }
      }

      // 2. Insert Invoice
      const invoiceId = `WEB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      
      // Calculate individual price for invoice items
      const unitPrice = totalPrice / quantity

      const invoiceItem = {
        productId: product.id,
        name: product.name,
        qty: quantity,
        price: unitPrice,
        tax: 0, // Simplified tax calculation for online storefront
      }

      const deliveryDetails = {
        firstName,
        lastName,
        phone,
        department,
        city,
        address,
        notes,
      }

      const { error: invoiceInsertError } = await supabase
        .from('invoices')
        .insert([
          {
            id: invoiceId,
            company_id: companyId,
            client_id: clientId,
            client_name: clientName,
            subtotal: totalPrice,
            tax: 0,
            total: totalPrice,
            payment_type: 'contra_entrega', // Cash on delivery
            payment_status: 'pending',
            items: [invoiceItem],
            source: 'store',
            delivery_details: deliveryDetails,
            note: notes || 'Pedido recibido a través de la tienda virtual.',
            deuda_pendiente: totalPrice,
            monto_pagado: 0,
          },
        ])

      if (invoiceInsertError) {
        throw new Error(invoiceInsertError.message)
      }

      // Redirect to thank you page
      router.push(`/${storeSlug}/gracias?invoiceId=${invoiceId}&total=${totalPrice}`)
    } catch (err) {
      console.error('Error procesando pedido:', err)
      setErrorMsg('Hubo un problema procesando tu compra. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-subtle bg-surface-800">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="w-6 h-6" style={{ color: accentColor }} />
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Completa tus datos de envío
        </h3>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl border border-danger/20 bg-danger/10 text-danger text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Nombre *
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ej. Juan"
            className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Apellido *
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Ej. Pérez"
            className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Teléfono de contacto *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej. 3123456789"
            className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Documento de Identidad (Cédula) */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Cédula o NIT (Opcional)
          </label>
          <input
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Para facturación electrónica"
            className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Departamento */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Departamento *
          </label>
          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="">Selecciona departamento</option>
            {COLOMBIA.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Municipio / Ciudad */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
            Ciudad / Municipio *
          </label>
          <select
            required
            value={city}
            disabled={!department}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Selecciona municipio</option>
            {citiesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dirección */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
          Dirección Completa *
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle, Carrera, número de casa, apto, barrio"
          className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Notas */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
          Notas de entrega o indicaciones adicionales
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Dejar en recepción, casa de rejas verdes..."
          rows="2"
          className="w-full px-4 py-3 rounded-xl border bg-surface-700 text-white outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-4 rounded-xl text-center font-bold text-white tracking-wider uppercase transition-transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
          boxShadow: `0 8px 24px ${accentColor}30`,
        }}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Confirmar Pedido — Pago Contra Entrega</span>
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
        <span>🔒 Tu información está encriptada y protegida.</span>
      </div>
    </form>
  )
}
