import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import ResponsibleForm from '../components/ResponsibleForm'
import { useCreateResponsable } from '../services/responsables.service'
import type { ResponsableInput } from '../types'

export default function ResponsableNewPage() {
  const nav = useNavigate()
  const create = useCreateResponsable()
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSubmit = async (values: ResponsableInput) => {
    setApiError(null)
    try {
      await create.mutateAsync(values)
      alert('Responsable registrado correctamente')
      nav({ to: '/responsables' })
    } catch (err: any) {
      if (err?.response?.status === 409) setApiError('Ya existe un responsable asignado a esta área.')
      else setApiError('No se pudo registrar. Intenta nuevamente.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Registrar responsable</h1>
        <Link to="/responsables" className="rounded-lg border px-3 py-1">Volver</Link>
      </div>

      {/* Form con el layout del mock */}
      <ResponsibleForm onSubmit={handleSubmit} loading={create.isPending} apiError={apiError} />
    </div>
  )
}
