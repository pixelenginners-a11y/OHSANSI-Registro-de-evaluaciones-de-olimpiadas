import { useState } from "react";
import { type FilaCSVParseada } from "../types/inscritos";
import FormField from "./FormField";
import { useGetAreas } from "../../areas/hooks/useAreaQueries";
import { useGetGrades } from "../../administrar-niveles/hooks/useGradeQueries";

type Props = {
  isOpen: boolean;
  row: FilaCSVParseada;
  onClose: () => void;
  onSave: (data: FilaCSVParseada) => void;
  getFieldErrors: (campo: string) => string[];
  hasFieldError: (campo: string) => boolean;
};

export default function EditModal({ isOpen, row, onClose, onSave, getFieldErrors, hasFieldError }: Props) {
  const [editedData, setEditedData] = useState<FilaCSVParseada>(row);
  const { data: areas } = useGetAreas();
  const { data: grades } = useGetGrades();

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Editar registro</h3>
              <p className="text-sm text-neutral-600">Fila #{editedData.__row}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              label="Nombre completo"
              value={editedData.full_name || ''}
              onChange={(val) => setEditedData({ ...editedData, full_name: val })}
              hasError={hasFieldError('full_name')}
              errors={getFieldErrors('full_name')}
              required
            />
            <FormField
              label="Documento de identidad"
              value={editedData.identity_document || ''}
              onChange={(val) => setEditedData({ ...editedData, identity_document: val })}
              hasError={hasFieldError('identity_document')}
              errors={getFieldErrors('identity_document')}
              required
            />
            <FormField
              label="Unidad educativa"
              value={editedData.educational_institution || ''}
              onChange={(val) => setEditedData({ ...editedData, educational_institution: val })}
              hasError={hasFieldError('educational_institution')}
              errors={getFieldErrors('educational_institution')}
              required
            />
            <FormField
              label="Departamento"
              value={editedData.department || ''}
              onChange={(val) => setEditedData({ ...editedData, department: val })}
              hasError={hasFieldError('department')}
              errors={getFieldErrors('department')}
              required
            />
            <FormField
              label="Tutor académico"
              value={editedData.academic_tutor || ''}
              onChange={(val) => setEditedData({ ...editedData, academic_tutor: val })}
              hasError={hasFieldError('academic_tutor')}
              errors={getFieldErrors('academic_tutor')}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Área
                </label>
                <select
                  value={editedData.area || ''}
                  onChange={(e) => setEditedData({...editedData, area: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccionar área</option>
                  {areas?.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Grado
                </label>
                <select
                  value={editedData.grade || ''}
                  onChange={(e) => setEditedData({...editedData, grade: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccionar grado</option>
                  {grades?.map((grade) => (
                    <option key={grade.id} value={grade.name}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
