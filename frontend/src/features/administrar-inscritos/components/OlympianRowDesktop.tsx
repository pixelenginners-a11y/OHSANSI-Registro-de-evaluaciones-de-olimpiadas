import { type UseMutateFunction } from "@tanstack/react-query";
import { type Olympian, type OlympianUpdate } from "../types";
import { OlympianRowActions } from "./OlympianRowActions";

interface OlympianRowDesktopProps {
  data: Olympian;
  openRowId: number | null;
  setOpenRowId: React.Dispatch<React.SetStateAction<number | null>>;
  onDelete: UseMutateFunction<void, Error, number, unknown>;
  onEdit: (data: Olympian) => void;
  editActive: (id: string, data: OlympianUpdate) => void;
}

export function OlympianRowDesktop({ data, openRowId, setOpenRowId, onDelete, onEdit, editActive }: OlympianRowDesktopProps) {
  const columns = [
    { key: "full_name", value: data.full_name },
    { key: "identity_document", value: data.identity_document },
    { key: "educational_institution", value: data.educational_institution },
    { key: "department", value: data.department },
    { key: "school_grade", value: data.school_grade },
    { key: "academic_tutor", value: data.academic_tutor || "-" },
  ];

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_0.8fr_1.2fr_1fr] items-center hover:bg-gray-50 transition">
      {columns.map((col) => (
        <div
          key={col.key}
          className={`px-6 py-3 truncate text-sm
            ${col.key === "full_name" ? "font-medium text-gray-900" : "text-gray-700"}
          text-left`}
        >
          {col.value}
        </div>
      ))}
      <div className="px-6 py-3 text-center">
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
  );
}
