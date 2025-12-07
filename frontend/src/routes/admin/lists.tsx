import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useGetListings, useCreateListing } from '../../features/lists/hooks';
import { useGetAreas } from '../../features/AdministratorUsers/hooks';
import { useGetGrades } from '../../features/administrar-niveles/hooks/useGradeQueries';
import { type Listing, type CreateListingData } from '../../features/lists/types/listing';
import { Pagination } from '../../components/Pagination';
import { CreateListingModal } from '../../components/CreateListingModal';
import { withPhaseGuard } from '../../components/withPhaseGuard';

interface AreaOptionType {
  id: number;
  name: string;
}

interface GradeOptionType {
  id: number;
  name: string;
}

function RouteComponent() {
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetListings(page);
  const { mutateAsync: createListing } = useCreateListing();

  const { data: areasData } = useGetAreas();
  const { data: gradesData } = useGetGrades();

  if (isLoading) return <div className="p-6">Cargando listas...</div>;
  if (isError) return <div className="p-6">Error al cargar las listas</div>;

  const handleCardClick = (id: number) => {
    window.location.href = `/public/lists/${id}`;
  };

  const handleSaveCreate = async (data: CreateListingData) => {
    await createListing(data);
    setIsModalOpen(false);
  };

  const areaOptions = areasData?.map((a: AreaOptionType) => ({ value: a.id, label: a.name })) || [];
  const gradeOptions = gradesData?.map((g: GradeOptionType) => ({ value: g.id, label: g.name })) || [];


  return (
    <div className="p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Listas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary"
        >
          Nueva Lista
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((listing: Listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl cursor-pointer transition"
              onClick={() => handleCardClick(listing.id)}
            >
              <h2 className="text-lg font-bold">{listing.name}</h2>
              <p className="text-sm text-gray-500">{listing.description}</p>
              <div className="mt-2 text-xs text-gray-600">
                <span>Área: {listing.area.name}</span>
                <br />
                <span>Grado: {listing.grade.name}</span>
              </div>
              <div className="mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${listing.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {listing.is_published ? 'Publicado' : 'No publicado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {data?.links && (
        <div className="mt-4">
          <Pagination
            links={data.links}
            currentPage={data.current_page}
            lastPage={data.last_page}
            total={data.total}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      <CreateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCreate}
        areaOptions={areaOptions}
        gradeOptions={gradeOptions}
      />
    </div>
  );
}

const GuardedRouteComponent = withPhaseGuard('generar_lista_inscritos')(RouteComponent);

export const Route = createFileRoute('/admin/lists')({
  component: GuardedRouteComponent,
});
