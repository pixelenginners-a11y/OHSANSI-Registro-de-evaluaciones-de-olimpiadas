import { createFileRoute } from '@tanstack/react-router';
import { useGetListingById, useGetListItems } from '../../../features/lists/hooks';
import { Pagination } from '../../../components/Pagination';
import { ExportPDFButton } from '../../../features/lists/components/ExportPDFButton';
import { useState } from 'react';

export const Route = createFileRoute('/public/lists/$listId')({
  component: PublicListDetail,
});

function PublicListDetail() {
  const { listId } = Route.useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: listing, isLoading: listingLoading } = useGetListingById(Number(listId));
  const { data: itemsData, isLoading: itemsLoading } = useGetListItems(Number(listId), currentPage);

  if (listingLoading || itemsLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!listing || !itemsData) {
    return <div className="p-6">Lista no encontrada</div>;
  }

  return (
    <div className="p-6 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{listing.name}</h1>
          {listing.description && (
            <p className="text-gray-600 mt-1">{listing.description}</p>
          )}
        </div>

        {itemsData.data.length > 0 && (
          <ExportPDFButton
            data={itemsData.data}
            listName={listing.name}
          />
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold">Área:</span> {listing.area?.name || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Grado:</span> {listing.grade?.name || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Total de items:</span> {itemsData.total}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="space-y-4">
          {itemsData.data.map((item, index) => (
            <div key={item.id} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              {item.inscription && (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-primary-dark text-xs px-2 py-1 rounded-full">
                        Individual
                      </span>
                      <span className="text-sm text-gray-500">
                        #{(currentPage - 1) * itemsData.per_page + index + 1}
                      </span>
                    </div>
                    <p className="font-medium text-lg">
                      {item.inscription.olympian?.full_name}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2 text-sm text-gray-600">
                      <p><span className="font-medium">Cédula:</span> {item.inscription.olympian?.identity_document}</p>
                      <p><span className="font-medium">Institución:</span> {item.inscription.olympian?.educational_institution}</p>
                      <p><span className="font-medium">Departamento:</span> {item.inscription.olympian?.department || 'N/A'}</p>
                      <p><span className="font-medium">Tutor:</span> {item.inscription.olympian?.academic_tutor || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {item.group && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Grupal
                    </span>
                    <span className="text-sm text-gray-500">
                      #{(currentPage - 1) * itemsData.per_page + index + 1}
                    </span>
                  </div>
                  <p className="font-medium text-lg mb-3">{item.group.name}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Miembros:</span> {item.group.members?.length || 0}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Miembros del grupo:</p>
                    <div className="space-y-2">
                      {item.group.members?.map((member, memberIndex) => (
                        <div key={member.id} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-gray-500 mr-2">{memberIndex + 1}.</span>
                            <span className="font-medium">{member.olympian.full_name}</span>
                            <span className="text-gray-600 ml-2">- {member.olympian.identity_document}</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {member.olympian.educational_institution}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!item.inscription && !item.group && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2">
                      Sin datos
                    </span>
                    <span className="text-sm text-gray-500">
                      #{(currentPage - 1) * itemsData.per_page + index + 1}
                    </span>
                  </div>
                  <p className="text-gray-500">Item sin información</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {itemsData.data.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay items en esta lista</h3>
            <p className="text-gray-500">Esta lista no contiene participantes o grupos.</p>
          </div>
        )}
      </div>

      {itemsData.links && itemsData.links.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Pagination
            links={itemsData.links}
            currentPage={itemsData.current_page}
            lastPage={itemsData.last_page}
            total={itemsData.total}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}