import { type UseMutateFunction } from "@tanstack/react-query";
import { type Inscription, type Column, type InscriptionUpdate } from "../types";
import { RowActions } from "../components/RowActions";

interface RowDesktopProps {
  data: Inscription;
  columns: Column[];
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  editActive: (id: string, data: InscriptionUpdate) => void;
  onEdit: (data: Inscription) => void;
}

export function RowDesktop({ data, columns, openRowId, setOpenRowId, onDelete, onEdit, editActive }: RowDesktopProps) {

  const getDisplayValue = (key: string): string => {
    // Para campos anidados
    if (key === 'full_name') return data.olympian.full_name;
    if (key === 'identity_document') return data.olympian.identity_document;
    if (key === 'educational_institution') return data.olympian.educational_institution;
    if (key === 'department') return data.olympian.department;
    if (key === 'academic_tutor') return data.olympian.academic_tutor;
    if (key === 'area_name') return data.area.name;
    if (key === 'grade_name') return data.grade.name;
    if (key === 'group_name') return data.group?.name || 'Sin grupo';

    // Para campos directos
    return data[key as keyof Inscription] as string || '';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      case 'inscribed':
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      case 'inscribed': return 'Inscrito';
      default: return status;
    }
  };

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] items-center hover:bg-gray-50 transition">
      {columns.map((col) => (
        <div
          key={col.key as string}
          className={`px-4 py-3 truncate text-sm ${col.key === "full_name" ? "font-medium text-gray-900" : "text-gray-700"
            } text-left`}
        >
          {col.key === "status" ? (
            <div className="flex justify-start">
              <span
                className={`rounded-full text-xs font-medium px-2 py-1 truncate ${getStatusStyles(data.status ? "Activo" : "Inactivo")}`}
              >
                {getStatusText(data.status ? "Activo" : "Inactivo")}
              </span>
            </div>
          ) : (
            getDisplayValue(col.key as string)
          )}
        </div>
      ))}
      <div className="px-4 py-3 text-center">
        <RowActions
          id={data.id}
          data={data}
          openRowId={openRowId}
          setOpenRowId={setOpenRowId}
          onEdit={onEdit}
          editActive={editActive}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}