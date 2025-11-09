import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Select } from '../../components/Select';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';
import { useGetEvaluations } from '../../features/evaluations/hooks';
import { useGetAreas } from '../../features/areas/hooks';
import { useGetGrades } from '../../features/administrar-niveles/hooks/useGradeQueries';
import { EditEvaluationModal } from '../../features/evaluations/components/EditEvaluationModal';
import type { EditEvaluationForm, Evaluation } from '../../features/evaluations/components/EditEvaluationModal';
import { useUpdateEvaluation } from '../../features/evaluations/hooks/useEvaluationMutation';

export const Route = createFileRoute('/evaluator/evaluations')({
  component: RouteComponent,
});

function RouteComponent() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [filterArea, setFilterArea] = useState<string>('');
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [filterPhase, setFilterPhase] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const { data: areasData, isLoading: areasLoading, isError: areasError } = useGetAreas();
  const { data: gradesData } = useGetGrades();

  const { data: evaluationsData, isLoading, isError } = useGetEvaluations({
    search: query,
    area: filterArea,
    grade: filterGrade,
    phase: filterPhase,
    status: filterStatus,
    page,
    per_page: 9,
  });

  const updateEvaluationMutation = useUpdateEvaluation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(inputValue);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  if (isLoading || areasLoading) return <div className="p-6">Cargando evaluaciones...</div>;
  if (isError || areasError) return <div className="p-6">Error al cargar los datos.</div>;

  const areaOptions = areasData?.map((area) => ({ value: area.id, label: area.name })) || [];
  const gradeOptions = gradesData?.map((grade) => ({ value: grade.name, label: grade.name })) || [];
  const phaseOptions = [
    { value: 'clasificacion', label: 'Clasificación' },
    { value: 'final', label: 'Final' },
  ];
  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'clasificado', label: 'Clasificado' },
    { value: 'no_clasificado', label: 'No Clasificado' },
    { value: 'desclasificado', label: 'Desclasificado' },
  ];

  const dataToShow: Evaluation[] = Array.isArray(evaluationsData?.data)
    ? evaluationsData.data
    : [];

  const openModal = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvaluation(null);
    setModalOpen(false);
  };

  const handleSaveEvaluation = async (data: EditEvaluationForm) => {
    if (!selectedEvaluation) return;
    updateEvaluationMutation.mutate({
      id: selectedEvaluation.id,
      data,
    });

    closeModal();
  };

  return (
    <div className="h-screen overflow-hidden p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Evaluaciones</h1>

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

      <div className="flex flex-wrap gap-2 mb-4 w-full">
        <Select
          value={filterArea}
          onChange={(value) => { setFilterArea(String(value)); setPage(1); }}
          options={areaOptions}
          className="w-full sm:w-auto min-w-0"
          placeholder="Filtrar por Área"
        />
        <Select
          value={filterGrade}
          onChange={(value) => { setFilterGrade(String(value)); setPage(1); }}
          options={gradeOptions}
          className="w-full sm:w-auto min-w-0"
          placeholder="Filtrar por Grado"
        />
        <Select
          value={filterPhase}
          onChange={(value) => { setFilterPhase(String(value)); setPage(1); }}
          options={phaseOptions}
          className="w-full sm:w-auto min-w-0"
          placeholder="Filtrar por Fase"
        />
        <Select
          value={filterStatus}
          onChange={(value) => { setFilterStatus(String(value)); setPage(1); }}
          options={statusOptions}
          className="w-full sm:w-auto min-w-0"
          placeholder="Filtrar por Estado"
        />
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
                    className="w-full px-3 py-2 bg-primary-dark text-white rounded text-sm"
                    onClick={() => openModal(evalItem)}
                  >
                    Editar Evaluación
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

      {modalOpen && selectedEvaluation && (
        <EditEvaluationModal
          evaluation={selectedEvaluation}
          onClose={closeModal}
          onSave={handleSaveEvaluation}
        />
      )}
    </div>
  );
}
