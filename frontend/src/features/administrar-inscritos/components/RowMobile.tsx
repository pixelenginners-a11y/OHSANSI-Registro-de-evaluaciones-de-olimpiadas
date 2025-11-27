import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";
import { type Inscription, type InscriptionUpdate } from "../types";
import { RowActions } from "../components/RowActions";
import Icon from "../../../components/Icon";

interface RowMobileProps {
  data: Inscription;
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  editActive: (id: string, data: InscriptionUpdate) => void;
  onEdit: (data: Inscription) => void;
}

export function RowMobile({ data, openRowId, setOpenRowId, onDelete, onEdit, editActive }: RowMobileProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-700";
      case 'pending':
        return "bg-yellow-100 text-yellow-700";
      case 'rejected':
        return "bg-red-100 text-red-700";
      case 'inscribed':
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
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
    <div className="border rounded-lg mb-3 bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-between text-left"
        >
          <div>
            <div className="font-medium text-gray-900">
              {data.olympian.full_name}
            </div>
            <div className="text-sm text-gray-500">
              {data.area.name} - {data.grade.name}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(data.status ? "Activo" : "Inactivo")}`}
            >
              {getStatusText(data.status ? "Activo" : "Inactivo")}
            </span>
            {expanded ? (
              <Icon name="chevron-up" className="text-gray-400" />
            ) : (
              <Icon name="chevron-down" className="text-gray-400" />
            )}
          </div>
        </button>

        <div className="ml-2">
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

      {expanded && (
        <div className="px-4 pb-3 text-sm text-gray-600 rounded-b-lg border-t bg-gray-50 space-y-1">
          <p><b>Documento:</b> {data.olympian.identity_document}</p>
          <p><b>Institución:</b> {data.olympian.educational_institution}</p>
          <p><b>Departamento:</b> {data.olympian.department}</p>
          <p><b>Tutor:</b> {data.olympian.academic_tutor || 'No asignado'}</p>
          <p><b>Grupo:</b> {data.group?.name || 'Sin grupo'}</p>
        </div>
      )}
    </div>
  );
}