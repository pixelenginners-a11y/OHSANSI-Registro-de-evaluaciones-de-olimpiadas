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
  // Normalizar claves a minúsculas para evitar problemas con mayúsculas/acentos desde el backend
  const phases: Record<string, any> = Object.fromEntries(
    Object.entries(backendPhases || {}).map(([k, v]) => [k.toLowerCase(), v])
  )

  // Títulos para mostrar en la UI (solo vista). No cambian la llave lógica.
  const displayNames: Record<string, string> = {
    inscripcion: 'Inscripción',
    clasificacion: 'Clasificación',
    final: 'Final',
  }

  if (!phases || Object.keys(phases).length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Administración de fases</h1>
        <div className="p-4 bg-yellow-50 border rounded">No se encontraron datos de fases en el backend.</div>
      </div>
    )
  }

  const handleActivate = async (phaseId: PhaseKey) => {
    setError(null)
    const phaseData = phases[phaseId]
    if (!phaseData) {
      setError('Fase no encontrada en la respuesta del servidor')
      return
    }

    setBusyPhase(phaseId)
    try {
      const res = await togglePhaseApi({ phase: phaseId, action: 'activate' })
      console.log('activate response', res)
      await refetch()
    } catch (err: any) {
      console.error('activate error raw', err)
      const message = err?.response?.data?.message || err?.message || 'Error al activar la fase'
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
        {
          // Orden lógico de fases
          (['inscripcion', 'clasificacion', 'final']).map((phaseKey) => {
            const phaseData = phases[phaseKey]
            if (!phaseData) return null
            const title = displayNames[phaseKey] ?? phaseData?.title ?? phaseKey
            const description = phaseData?.description ?? ''
            const active = Boolean(phaseData?.active)
            const startedAt = phaseData?.startedAt ?? null

            return (
              <div
                key={phaseKey}
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

                  {
                    // calcular si la fase previa está iniciada
                    (() => {
                      const order = { inscripcion: 1, clasificacion: 2, final: 3 }
                      const prevOrder = order[phaseKey as keyof typeof order] - 1
                      const prevKey = Object.keys(order).find(k => order[k as keyof typeof order] === prevOrder)
                      const prevStarted = !prevKey || Boolean(phases[prevKey]?.startedAt)
                      return (
                        <PhaseActionButton
                          phaseKey={phaseKey}
                          phaseData={phaseData}
                          busyPhase={busyPhase}
                          prevStarted={prevStarted}
                          onActivate={() => handleActivate(phaseKey)}
                        />
                      )
                    })()
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

function PhaseActionButton({ phaseKey, phaseData, busyPhase, prevStarted, onActivate }: { phaseKey: string, phaseData: any, busyPhase: string | null, prevStarted: boolean, onActivate: () => void }) {
  // Determinar orden
  const order = { inscripcion: 1, clasificacion: 2, final: 3 }

  const started = Boolean(phaseData?.startedAt)
  const active = Boolean(phaseData?.active)

  const canActivate = !started && prevStarted

  if (canActivate) {
    return (
      <button
        onClick={onActivate}
        disabled={busyPhase === phaseKey}
        className={`px-4 py-2 rounded-lg font-medium border bg-green-50 border-green-200`}
      >
        {busyPhase === phaseKey ? 'Procesando...' : 'Activar'}
      </button>
    )
  }

  if (started) {
    return <div className="px-3 py-2 text-sm text-green-700 font-medium">Iniciada</div>
  }

  return <div className="px-3 py-2 text-sm text-gray-500">No disponible</div>
}
