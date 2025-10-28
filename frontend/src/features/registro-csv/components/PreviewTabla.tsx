import { useMemo, useState } from "react";
import { type FilaCSVParseada, type FilaCSVConError } from "../types/inscritos";
import { useErrorMapping, FIELD_NAMES } from "../hooks/useErrorMapping";
import TableCell from "./TableCell";
import ErrorModal from "./ErrorModal";
import EditModal from "./EditModal";
import ErrorsTable from "./ErrorsTable";

type Props = {
  validas: FilaCSVParseada[];
  errores: FilaCSVConError[];
  pageSize?: number;
  showErroresTable?: boolean;
};

export default function PreviewTabla({ validas, errores, pageSize = 10, showErroresTable = true }: Props) {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<{ campo: string; mensajes: string[]; fila: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FilaCSVParseada | null>(null);

  const { erroresPorFila, getMensajesError, hasFieldError } = useErrorMapping(errores);

  const total = validas.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return validas.slice(start, start + pageSize);
  }, [page, pageSize, validas]);

  const handleErrorClick = (campo: string, fila: number) => {
    const mensajes = getMensajesError(fila, campo);
    setSelectedError({ campo, mensajes, fila });
    setModalOpen(true);
  };

  const handleEdit = (row: FilaCSVParseada) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleDelete = (row: FilaCSVParseada) => {
    if (confirm(`¿Estás seguro de eliminar la fila #${row.__row}?`)) {
      console.log('Eliminar fila:', row);
    }
  };

  const handleSaveEdit = (data: FilaCSVParseada) => {
    console.log('Guardar cambios:', data);
  };

  const getFieldErrorsForRow = (campo: string): string[] => {
    if (!selectedRow?.__row) return [];
    return getMensajesError(selectedRow.__row, campo);
  };

  const hasFieldErrorForRow = (campo: string): boolean => {
    if (!selectedRow?.__row) return false;
    return hasFieldError(selectedRow.__row, campo);
  };

  const tableHeaders = ["#", "Nombre completo", "Documento", "Unidad educativa", "Departamento", "Tutor académico", "Área", "Grado", "Estado", "Acciones"];
  const fieldKeys: (keyof FilaCSVParseada)[] = ['full_name', 'identity_document', 'educational_institution', 'department', 'academic_tutor', 'area', 'grade'];

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="max-h-[60vh] overflow-auto rounded-2xl">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-800">
              <tr>
                {tableHeaders.map((h) => (
                  <th key={h} className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r, idx) => {
                const filaOriginal = r.__row || ((page - 1) * pageSize + idx + 1);
                const errorInfo = erroresPorFila.get(filaOriginal);
                const tieneError = !!errorInfo;

                return (
                  <tr key={`${r.identity_document}-${filaOriginal}`} className="even:bg-neutral-50/60">
                    <td className="border-b border-neutral-200 px-3 py-2 text-neutral-500 font-mono text-xs">
                      {filaOriginal}
                    </td>
                    {fieldKeys.map((field) => (
                      <td key={field} className="border-b border-neutral-200 px-3 py-2">
                        <TableCell
                          value={r[field]}
                          hasError={!!errorInfo?.camposConError.has(field)}
                          onErrorClick={() => handleErrorClick(field, filaOriginal)}
                        />
                      </td>
                    ))}
                    <td className="border-b border-neutral-200 px-3 py-2">
                      {tieneError ? (
                        <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-500/20">
                          ⚠ Con errores
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-500/20">
                          ✓ Válida
                        </span>
                      )}
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(r)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Editar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(r)} className="text-rose-600 hover:text-rose-800 transition-colors" title="Eliminar">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-4 text-center text-neutral-600">No hay filas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 p-3">
          <button onClick={() => setPage(1)} disabled={page === 1} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">≪</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">{"<"}</button>
          <span className="rounded-md border border-neutral-300 px-2 py-1 text-sm">{page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">{">"}</button>
          <button onClick={() => setPage(pages)} disabled={page === pages} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">≫</button>
        </div>
      </div>

      {showErroresTable && <ErrorsTable errores={errores} />}

      {selectedError && (
        <ErrorModal
          isOpen={modalOpen}
          campo={selectedError.campo}
          mensajes={selectedError.mensajes}
          fila={selectedError.fila}
          nombreCampo={FIELD_NAMES[selectedError.campo] || selectedError.campo}
          onClose={() => setModalOpen(false)}
        />
      )}

      {selectedRow && (
        <EditModal
          isOpen={editModalOpen}
          row={selectedRow}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          getFieldErrors={getFieldErrorsForRow}
          hasFieldError={hasFieldErrorForRow}
        />
      )}
    </>
  );
}
