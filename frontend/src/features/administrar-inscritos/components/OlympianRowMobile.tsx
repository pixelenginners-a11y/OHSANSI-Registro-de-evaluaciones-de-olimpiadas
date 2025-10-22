import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";
import { type Olympian, type OlympianUpdate } from "../types";
import Icon from "../../../components/Icon";
import { OlympianRowActions } from "./OlympianRowActions";

interface OlympianRowMobileProps {
  data: Olympian;
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  onEdit: (data: Olympian) => void;
  editActive: (id: string, data: OlympianUpdate) => void;
}

export function OlympianRowMobile({ data, openRowId, setOpenRowId, onDelete, onEdit, editActive }: OlympianRowMobileProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg mb-3 bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-between text-left"
        >
          <div>
            <div className="font-medium text-gray-900">
              {data.full_name}
            </div>
            <div className="text-sm text-gray-500">{data.educational_institution}</div>
          </div>

          <div className="flex items-center gap-2">
            {expanded ? (
              <Icon name="chevron-up" className="text-gray-400" />
            ) : (
              <Icon name="chevron-down" className="text-gray-400" />
            )}
          </div>
        </button>

        <div className="ml-2">
          <OlympianRowActions
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
        <div className="px-4 pb-3 text-sm text-gray-600 rounded-b-lg border-t bg-gray-50">
          <p>
            <b>Documento:</b> {data.identity_document}
          </p>
          <p>
            <b>Contacto Tutor Legal:</b> {data.legal_guardian_contact}
          </p>
          <p>
            <b>Institución:</b> {data.educational_institution}
          </p>
          <p>
            <b>Departamento:</b> {data.department}
          </p>
          {data.academic_tutor && (
            <p>
              <b>Tutor Académico:</b> {data.academic_tutor}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
