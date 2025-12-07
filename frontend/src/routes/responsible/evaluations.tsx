import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Select } from '../../components/Select';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { useGetEvaluationsForResponsible } from '../../features/evaluations/hooks/useEvaluationQueries';
import { useGetGrades } from '../../features/administrar-niveles/hooks/useGradeQueries';
import type { Evaluation } from '../../features/evaluations/components/EditEvaluationModal';
import { useUpdateEvaluation, useApproveAllEvaluations } from '../../features/evaluations/hooks/useEvaluationMutation';
import { ConfirmModal } from '../../features/AdministratorUsers/components/ConfirmModal';

export const Route = createFileRoute('/responsible/evaluations')({
  component: RouteComponent,
})

function RouteComponent() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: gradesData } = useGetGrades();

  const { data: evaluationsData, isLoading, isError } = useGetEvaluationsForResponsible({
    search: query,
    grade: filterGrade,
    page,
    per_page: 9,
  });

  const updateEvaluationMutation = useUpdateEvaluation();
  const approveAllMutation = useApproveAllEvaluations();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(inputValue);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  if (isLoading) return <div className="p-6">Cargando evaluaciones...</div>;
  if (isError) return <div className="p-6">Error al cargar los datos.</div>;

  const gradeOptions = gradesData?.map((grade) => ({ value: grade.name, label: grade.name })) || [];

  const dataToShow: Evaluation[] = Array.isArray(evaluationsData?.data)
    ? evaluationsData.data
    : [];

  const handleEditStatus = async (evaluacion: Evaluation) => {
    if (!evaluacion) return;
    updateEvaluationMutation.mutate({
      id: evaluacion.id,
      data: {
        status: 'rejected',
      },
    });
  };

  const handleApproveAll = () => {
    approveAllMutation.mutate(undefined, {
      onSuccess: () => {
        setModalOpen(false);
      },
    });
  };

  return (
    <div className="h-screen overflow-hidden p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Verificar Evaluaciones</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            placeholder="Buscar por nombre, grupo o área..."
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full items-stretch">
        <div className="flex flex-col sm:flex-row flex-1 gap-2">
          <Select
            value={filterGrade}
            onChange={(value) => { setFilterGrade(String(value)); setPage(1); }}
            options={gradeOptions}
            className="w-full sm:w-auto min-w-0"
            placeholder="Filtrar por Grado"
          />
        </div>

        <button
          className="w-full sm:w-auto min-w-0 bg-primary-dark text-white rounded px-4 py-2 hover:cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          Aprobar todas
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch px-1">
          {dataToShow.map((evalItem) => {
            const isGroup = evalItem.is_group;
            return (
              <article
                key={evalItem.id}
                className="bg-white rounded-2xl shadow-md p-4 min-w-0 flex flex-col h-full"
              >
                <header className="mb-2">
                  <h2 className="text-lg font-bold truncate">
                    {isGroup ? evalItem.group_name || '-' : evalItem.full_name || '-'}
                  </h2>
                  {!isGroup && (
                    <p className="text-sm text-gray-500 truncate">
                      Documento: {evalItem.identity_document || '-'}
                    </p>
                  )}
                </header>

                <div className="flex-1 min-h-0">
                  {evalItem.description && (
                    <p className="mt-1 text-sm text-gray-600 italic max-h-16 overflow-hidden">
                      {evalItem.description}
                    </p>
                  )}

                  <div className="mt-3 text-xs text-gray-600 space-y-1">
                    <div className="truncate">Grado: {evalItem.grade_name || '-'}</div>
                    <div className="truncate">Área: {evalItem.area_name || '-'}</div>
                    {isGroup && <div className="truncate">Grupo: {evalItem.group_name || '-'}</div>}
                    <div className="truncate">Fase: {evalItem.phase || '-'}</div>
                    <div className="truncate">Estado: {evalItem.status || '-'}</div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${isGroup ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {isGroup ? 'Grupal' : 'Individual'}
                    </span>

                    <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
                      Puntaje: {evalItem.score ?? 0}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className={`w-full px-3 py-2 ${evalItem.status === 'in_review'
                      ? "bg-primary-dark cursor-pointer"
                      : "bg-gray-500 cursor-not-allowed"} text-white rounded text-sm`}
                    onClick={() => { handleEditStatus(evalItem) }}
                    disabled={evalItem.status === 'approved' || evalItem.status === 'rejected' || evalItem.status === 'pending'}
                  >
                    {evalItem.status === 'pending' ? 'En Evaluacion' :
                      evalItem.status === 'approved' ? 'Aprobado' :
                        evalItem.status === 'rejected' ? 'Rechazado' : 'Permitir reeditar evaluacion'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {evaluationsData?.links && (
        <div className="mt-4">
          <Pagination
            links={evaluationsData.links}
            currentPage={evaluationsData.current_page}
            lastPage={evaluationsData.last_page}
            total={evaluationsData.total}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {modalOpen && (
        <ConfirmModal
          isOpen={modalOpen}
          title="Aprobar todas las evaluaciones"
          description={`¿Estás seguro de que deseas aprobar todas las evaluaciones que están en revisión para la fase activa?
                        Aquellas que continúan en evaluación no serán aprobadas aún. Esta acción no se puede deshacer.`}
          confirmText="Aprobar"
          confirmClassnames='px-4 py-2 bg-primary-dark text-white rounded'
          onConfirm={() => {
            handleApproveAll();
            setModalOpen(false);
          }}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
