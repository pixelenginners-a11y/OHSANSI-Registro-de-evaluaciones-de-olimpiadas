import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ResponsibleForm from '../features/responsables/components/ResponsibleForm'
import { useCreateResponsable } from '../features/responsables/services/responsables.service'
import type { ResponsableInput } from '../features/responsables/types'

export const Route = createFileRoute('/registro')({
  component: Registro,
})

function Registro() {
  const create = useCreateResponsable()
  const [apiError, setApiError] = useState<string | null>(null)

  const handleSubmit = async (values: ResponsableInput) => {
    setApiError(null)
    try {
      await create.mutateAsync(values)
      alert('Responsable registrado correctamente')
      // Si quieres limpiar el formulario:
      // window.location.reload()
    } catch (err: any) {
      if (err?.response?.status === 409) setApiError('Ya existe un responsable asignado a esta área.')
      else setApiError('No se pudo registrar. Intenta nuevamente.')
    }
  }

  return (
    <div className="flex gap-6">

      {/* Tarjeta central con el formulario (dos columnas) */}
      <section className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold">
          Registro de Responsables<br/>Académicos
        </h1>

        <ResponsibleForm
          onSubmit={handleSubmit}
          loading={create.isPending}
          apiError={apiError}
          submitLabel="Registrar Responsable"
        />
      </section>
    </div>
  )
}
