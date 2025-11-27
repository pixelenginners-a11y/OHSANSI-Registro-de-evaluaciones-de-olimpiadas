import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";

import { type Inscription, type Column, type InscriptionUpdate } from "../types";
import { RowDesktop } from "../components/RowDesktop";
import { RowMobile } from "../components/RowMobile";

interface ListProps {
  data: Inscription[];
  columns: Column[];
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  onEdit: (data: Inscription) => void;
  editActive: (id: string, data: InscriptionUpdate) => void;
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
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_0.8fr] bg-primary-dark text-white font-semibold rounded-t-lg">
          {columns.map((col) => (
            <div
              key={col.key as string}
              className="px-4 py-3 truncate text-left text-sm"
            >
              {col.label}
            </div>
          ))}
          <div className="px-4 py-3 truncate text-center text-sm">Acciones</div>
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