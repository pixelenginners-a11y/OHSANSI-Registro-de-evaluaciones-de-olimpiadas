import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useGetCompetitionPhases, useTogglePhase } from '../../features/competition/hooks'

export const Route = createFileRoute('/admin/competition')({
  component: RouteComponent,
})

type PhaseKey = string

function RouteComponent() {
  const [busyPhase, setBusyPhase] = useState<PhaseKey | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useGetCompetitionPhases()
  const { mutateAsync: togglePhaseApi } = useTogglePhase()

  if (isLoading) return <div className="p-6">Cargando fases...</div>
  if (isError) return <div className="p-6">Error al cargar las fases</div>

  const backendPhases = data?.phases
  if (!backendPhases || Object.keys(backendPhases).length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Administración de fases</h1>
        <div className="p-4 bg-yellow-50 border rounded">No se encontraron datos de fases en el backend.</div>
      </div>
    )
  }

  const handleToggle = async (phaseId: PhaseKey) => {
    setError(null)
    const phaseData = backendPhases[phaseId]
    if (!phaseData) {
      setError('Fase no encontrada en la respuesta del servidor')
      return
    }

    const currentlyActive = Boolean(phaseData.active)
    const action = currentlyActive ? 'deactivate' : 'activate'

    setBusyPhase(phaseId)
    try {
      const res = await togglePhaseApi({ phase: phaseId, action })
      console.log('toggle response', res)
      await refetch()
    } catch (err: any) {
      console.error('toggle error raw', err)
      const message = err?.response?.data?.message || err?.message || 'Error al cambiar el estado de la fase'
      setError(message)
    } finally {
      setBusyPhase(null)
    }
  }


  return (
    <div className="p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administración de fases</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded">Error: {error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(backendPhases).map(([phaseId, phaseData]: [string, any]) => {
          const title = phaseData?.title ?? phaseId
          const description = phaseData?.description ?? ''
          const active = Boolean(phaseData?.active)
          const startedAt = phaseData?.startedAt ?? null

          return (
            <div
              key={phaseId}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{title}</h2>
                  {description && <p className="text-sm text-gray-500">{description}</p>}
                  <div className="mt-2 text-sm text-gray-700">
                    <div>
                      Estado: {active ? <strong>Activo</strong> : <span>No activo</span>}
                    </div>
                    {startedAt && (
                      <div className="mt-1 text-xs text-gray-600">
                        Iniciado: {new Date(startedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(phaseId)}
                  disabled={busyPhase === phaseId}
                  className={`px-4 py-2 rounded-lg font-medium border ${active ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                    }`}
                >
                  {busyPhase === phaseId ? 'Procesando...' : active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
