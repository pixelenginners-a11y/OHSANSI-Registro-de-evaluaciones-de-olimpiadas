import { useState } from 'react';
import { useGetCompetitionPhases, useTogglePhase, useSetClassificationLimit } from '../hooks';
import { InputField } from '../../../components/InputField';

interface PhaseData {
  id: number;
  phase: string;
  title?: string;
  description?: string;
  active: boolean;
  startedAt?: string | null;
  classificationLimit?: number | null;
}

export function Competition() {
  const [busyPhase, setBusyPhase] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalPhaseId, setModalPhaseId] = useState<number | null>(null);
  const [minScore, setMinScore] = useState<number>(0);

  const { data, isLoading, isError, refetch } = useGetCompetitionPhases();
  const { mutateAsync: togglePhaseApi } = useTogglePhase();
  const { mutateAsync: setClassificationLimit } = useSetClassificationLimit();

  if (isLoading) return <div className="p-6">Cargando fases...</div>;
  if (isError) return <div className="p-6">Error al cargar las fases</div>;

  const backendPhases: PhaseData[] = Object.values(data?.phases ?? {});

  const handleToggle = async (phase: PhaseData) => {
    setError(null);
    const action = phase.active ? 'deactivate' : 'activate';
    setBusyPhase(phase.id);

    try {
      const res = await togglePhaseApi({ phase: phase.phase, action });
      console.log('toggle response', res);
      await refetch();
    } catch (err: any) {
      console.error('toggle error raw', err);
      const message = err?.response?.data?.message || err?.message || 'Error al cambiar el estado de la fase';
      setError(message);
    } finally {
      setBusyPhase(null);
    }
  };

  const handleSetMinScore = (phase: PhaseData) => {
    setModalPhaseId(phase.id);
    setMinScore(phase.classificationLimit ?? 0);
  };

  const handleSaveMinScore = async () => {
    if (!modalPhaseId) return;

    setError(null);

    console.log('Saving classification limit', { phase: modalPhaseId, minScore });

    try {
      const res = await setClassificationLimit({
        phase: modalPhaseId,
        classification_limit: minScore,
      });

      console.log('Set classification limit response:', res);

      if (!res.success) {
        setError(res.message || 'Error al guardar la nota mínima');
      }

      await refetch();
      setModalPhaseId(null);
      setMinScore(0);
    } catch (err: any) {
      console.error('Error saving classification limit:', err);
      const message = err?.response?.data?.message || err?.message || 'Error al guardar la nota mínima';
      setError(message);
    }
  };

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administración de fases</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {backendPhases.map((phase) => (
          <div
            key={phase.id}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{phase.title ?? phase.phase}</h2>
                {phase.description && <p className="text-sm text-gray-500">{phase.description}</p>}
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <div>
                    Estado: {phase.active ? <strong>Activo</strong> : <span>No activo</span>}
                  </div>
                  {phase.startedAt && (
                    <div className="text-xs text-gray-600">
                      Iniciado: {new Date(phase.startedAt).toLocaleString()}
                    </div>
                  )}
                  {phase.classificationLimit !== null && (
                    <div className="text-xs text-gray-600">
                      Límite de clasificación: <strong>{phase.classificationLimit}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleToggle(phase)}
                  disabled={busyPhase === phase.id}
                  className={`px-4 py-2 rounded-lg font-medium border ${phase.active ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                    }`}
                >
                  {busyPhase === phase.id ? 'Procesando...' : phase.active ? 'Desactivar' : 'Activar'}
                </button>

                <button
                  onClick={() => handleSetMinScore(phase)}
                  className="px-4 py-2 rounded-lg font-medium border bg-blue-50 border-blue-200"
                >
                  Definir nota mínima
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalPhaseId && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="text-lg font-bold mb-4">
              Nota mínima para la fase {modalPhaseId}
            </h2>
            <InputField
              label="Nota mínima de clasificación"
              onlyNumbers={true}
              value={minScore.toString()}
              onChange={(e) => setMinScore(Number(e.target.value))}
              onBlur={(e) => {
                if (!e.target.value) setMinScore(0);
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalPhaseId(null)}
                className="px-4 py-2 rounded border bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMinScore}
                className="px-4 py-2 rounded border bg-primary-dark text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
