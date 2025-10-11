import type { Area } from '../types/area';

type AreaCardProps = {
  area: Area;
  onEdit: (area: Area) => void;
  onDelete: (id: number) => void;
};

const AreaCard = ({ area, onEdit, onDelete }: AreaCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-primary-dark">
          {area.name}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(area)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Editar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(area.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Eliminar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {area.description && (
        <p className="text-sm text-gray-600">
          {area.description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          area.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {area.active ? 'Activa' : 'Inactiva'}
        </span>
      </div>
    </div>
  );
};

export default AreaCard;
