import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";

import { type Responsable, type Column, type EvaluatorBase, type ResponsableEdit, type EvaluatorUpdate } from "../types";
import { RowDesktop } from "./RowDesktop";
import { RowMobile } from "./RowMobile";

interface ListProps {
  data: Responsable[];
  columns: Column[];
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  onEdit: (data: Responsable | EvaluatorBase) => void;
  editActive: (id: string, data: ResponsableEdit | EvaluatorUpdate) => void;
}

export function List({ data, columns, onDelete, onEdit, editActive }: ListProps) {
  const [openRowId, setOpenRowId] = useState<number | null>(null);
  return (
    <div>
      <div className="block lg:hidden">
        {data.map((item) => (
          <RowMobile
            key={item.id}
            data={item}
            openRowId={openRowId}
            setOpenRowId={setOpenRowId}
            onDelete={onDelete}
            editActive={editActive}
            onEdit={onEdit}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_1fr_0.8fr_1fr] bg-primary-dark text-white font-semibold rounded-t-lg">
          {columns.map((col) => (
            <div
              key={col.key as string}
              className="px-6 py-3 truncate text-left"
            >
              {col.label}
            </div>
          ))}
          <div className="px-6 py-3 truncate text-center">Acciones</div>
        </div>

        <div className="divide-y divide-gray-200 border border-t-0 rounded-b-lg">
          {data.map((item) => (
            <RowDesktop
              key={item.id}
              data={item}
              columns={columns}
              openRowId={openRowId}
              setOpenRowId={setOpenRowId}
              onDelete={onDelete}
              editActive={editActive}
              onEdit={onEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
