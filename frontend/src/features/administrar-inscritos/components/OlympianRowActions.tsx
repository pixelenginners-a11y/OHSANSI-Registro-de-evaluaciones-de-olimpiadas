import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";
import { type Olympian, type OlympianUpdate } from "../types";
import Icon from "../../../components/Icon";
import { ConfirmModal } from "../../../components/ConfirmModal";

interface OlympianRowActionsProps {
  id: number;
  data: Olympian;
  onEdit: (data: Olympian) => void;
  editActive: (id: string, data: OlympianUpdate) => void;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
}

export function OlympianRowActions({
  id,
  data,
  onEdit,
  editActive: _editActive,
  onDelete,
  openRowId,
  setOpenRowId
}: OlympianRowActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const open = openRowId === id;

  const handleDelete = () => {
    onDelete(id);
    setIsConfirmOpen(false);
    setOpenRowId(null);
  };

  const handleEdit = () => {
    onEdit(data);
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
            onClick={() => { setIsConfirmOpen(true) }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-red-500 w-full"
          >
            <Icon name="trash" /> Eliminar
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Eliminar inscrito"
        description="¿Seguro que quieres eliminar este inscrito? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
