import { useState } from "react";
import { type UseMutateFunction } from "@tanstack/react-query";
import { type Olympian, type OlympianUpdate } from "../types";
import { OlympianRowDesktop } from "./OlympianRowDesktop";
import { OlympianRowMobile } from "./OlympianRowMobile";

interface OlympiansListProps {
  data: Olympian[];
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  onEdit: (data: Olympian) => void;
  editActive: (id: string, data: OlympianUpdate) => void;
}

export function OlympiansList({ data, onDelete, onEdit, editActive }: OlympiansListProps) {
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const columns = [
    { label: "Nombre Completo" },
    { label: "Documento" },
    { label: "Institución" },
    { label: "Departamento" },
    { label: "Grado" },
    { label: "Tutor Académico" },
  ];

  return (
    <div>
      <div className="block lg:hidden">
        {data.map((item) => (
          <OlympianRowMobile
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
        <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.8fr_1.2fr_1fr] bg-primary-dark text-white font-semibold rounded-t-lg">
          {columns.map((col, index) => (
            <div
              key={index}
              className="px-6 py-3 truncate text-left"
            >
              {col.label}
            </div>
          ))}
          <div className="px-6 py-3 truncate text-center">Acciones</div>
        </div>

        <div className="divide-y divide-gray-200 border border-t-0 rounded-b-lg">
          {data.map((item) => (
            <OlympianRowDesktop
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
      </div>
    </div>
  );
}
