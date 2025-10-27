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
    { key: "full_name", value: data.olympian.full_name },
    { key: "identity_document", value: data.olympian.identity_document },
    { key: "educational_institution", value: data.olympian.educational_institution },
    { key: "department", value: data.olympian.department },
    { key: "academic_tutor", value: data.olympian.academic_tutor },
    { key: "area", value: data.area.name },
    { key: "grade", value: data.grade.name },
  ];

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_1.2fr_1fr_1fr_1.2fr] items-center hover:bg-gray-50 transition">
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
