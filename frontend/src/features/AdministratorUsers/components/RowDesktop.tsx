import { type UseMutateFunction } from "@tanstack/react-query";

import { type Responsable, type Column, type EvaluatorBase, type ResponsableEdit, type EvaluatorUpdate } from "../index";
import { RowActions } from "../../../components/RowActions";

interface RowDesktopProps {
  data: Responsable | EvaluatorBase;
  columns: Column[];
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  editActive: (id: string, data: ResponsableEdit | EvaluatorUpdate) => void;
  onEdit: (data: Responsable | EvaluatorBase) => void;
}

export function RowDesktop({ data, columns, openRowId, setOpenRowId, onDelete, onEdit, editActive }: RowDesktopProps) {
  return (
    <div
      className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr_0.8fr_1fr] items-center hover:bg-gray-50 transition"
    >
      {columns.map((col) => (
        <div
          key={col.key as string}
          className={`px-6 py-3 truncate text-sm
            ${col.key === "full_name" ? "font-medium text-gray-900" : "text-gray-700"}
          text-left`}
        >
          {col.key === "active" ? (
            <div className="flex justify-start">
              <span
                className={`rounded-full text-xs font-medium px-1 py-0.5 truncate
                ${data.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {data.active ? "Activo" : "Inactivo"}
              </span>
            </div>
          ) : (
            data[col.key as keyof typeof data]
          )}
        </div>
      ))}
      <div className="px-6 py-3 text-center">
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
  );
}

