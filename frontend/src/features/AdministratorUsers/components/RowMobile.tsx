import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";

import { type Responsable, type EvaluatorBase, type ResponsableEdit, type EvaluatorUpdate } from "../index";
import { RowActions } from "../../../components/RowActions";
import Icon from "../../../components/Icon";

interface RowMobileProps {
  data: Responsable | EvaluatorBase;
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  editActive: (id: string, data: ResponsableEdit | EvaluatorUpdate) => void;
  onEdit: (responsable: Responsable | EvaluatorBase) => void;
}

export function RowMobile({ data, openRowId, setOpenRowId, onDelete, onEdit, editActive }: RowMobileProps) {
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
            {data.area &&
              <div className="text-sm text-gray-500">{data.area}</div>
            }
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${data.active ?
                "bg-green-100 text-green-700" :
                "bg-red-100 text-red-700"}`}
            >
              {data.active ? "Activo" : "Inactivo"}
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
            active={data.active}
            onEdit={onEdit}
            editActive={editActive}
            onDelete={onDelete}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 text-sm text-gray-600 rounded-b-lg border-t bg-gray-50">
          <p>
            <b>Usuario:</b> {data.username}
          </p>
          <p>
            <b>Correo:</b> {data.email}
          </p>
          {data.phone && (
            <p>
              <b>Teléfono:</b> {data.phone}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
