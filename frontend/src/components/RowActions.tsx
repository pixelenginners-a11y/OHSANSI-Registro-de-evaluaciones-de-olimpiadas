import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";

import { type Responsable, type EvaluatorBase, type ResponsableEdit, type EvaluatorUpdate } from "../features/AdministratorUsers";
import Icon from "./Icon";
import { ConfirmModal } from "./ConfirmModal";

interface RowActionsProps {
  id: number;
  data: Responsable | EvaluatorBase;
  onEdit: (data: Responsable | EvaluatorBase) => void;
  editActive: (id: string, data: ResponsableEdit | EvaluatorUpdate) => void;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  active?: boolean;
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
}

export function RowActions({
  id,
  data,
  onEdit,
  editActive,
  onDelete,
  active,
  openRowId,
  setOpenRowId
}: RowActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const open = openRowId === id;

  const handleDelete = () => {
    console.log(id);
    onDelete(id);
    setIsConfirmOpen(false);
  };

  const handleEdit = () => {
    onEdit(data);
    setOpenRowId(null);
  }

  const handleToggleStatus = () => {
    editActive(id.toString(), { ...data, active: !active } as ResponsableEdit | EvaluatorUpdate);
    setOpenRowId(null);
  }

  return (
    <div className="relative ">
      <button
        className=" hover:bg-gray-100 cursor-pointer "
        onClick={() => setOpenRowId(open ? null : id)}
      >
        <Icon name="ellipsis-vertical" />
      </button>

      {open && (
        <div className="absolute right-0 bg-white border rounded shadow-md z-10">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
          >
            <Icon name="edit" className="text-blue-500" /> Editar
          </button>
          <button
            onClick={handleToggleStatus}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full"
          >
            {active ? (
              <>
                <Icon name="square" /> Desactivar
              </>
            ) : (
              <>
                <Icon name="square-check" /> Activar
              </>
            )}
          </button>
          <button
            onClick={() => { setIsConfirmOpen(true) }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-500 w-full"
          >
            <Icon name="trash" /> Eliminar
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Eliminar responsable"
        description="¿Seguro que quieres eliminar este responsable? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
