import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import ResponsibleForm from '../components/ResponsibleForm'
import { useResponsable, useUpdateResponsable } from '../services/responsables.service'
import type { ResponsableInput } from '../types'

export default function ResponsableEditPage() {
  const { id } = useParams({ from: '/responsables/$id' })
  const { data, isLoading } = useResponsable(id)
  const update = useUpdateResponsable(id)
  const [apiError, setApiError] = useState<string | null>(null)
  const nav = useNavigate()

  if (isLoading) return <p>Cargando…</p>
  if (!data) return <p>No encontrado</p>

  const handleSubmit = async (values: ResponsableInput) => {
    setApiError(null)
    try {
      await update.mutateAsync(values)
      alert('Responsable actualizado')
      nav({ to: '/responsables' })
    } catch (err: any) {
      if (err?.response?.status === 409) setApiError('Esa área ya tiene un responsable asignado.')
      else setApiError('No se pudo actualizar. Intenta nuevamente.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editar responsable</h1>
        <Link to="/responsables" className="rounded-lg border px-3 py-1">Volver</Link>
      </div>
      <ResponsibleForm
        initial={{ nombreCompleto: data.nombreCompleto, ci: data.ci, email: data.email, areaId: data.areaId }}
        onSubmit={handleSubmit}
        loading={update.isPending}
        apiError={apiError}
        submitLabel="Guardar cambios"
      />
    </div>
  )
}
