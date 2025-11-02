import type { FilaCSVParseada } from "../types/inscritos";
import type { ErrorInfo } from "../hooks/useErrorMapping";
import TableCell from "./TableCell";

interface TableBodyProps {
  slice: FilaCSVParseada[];
  erroresPorFila: Map<number, ErrorInfo>;
  page: number;
  pageSize: number;
  handleErrorClick: (field: string, row: number) => void;
  handleEdit: (row: FilaCSVParseada) => void;
  handleDelete: (row: FilaCSVParseada) => void;
}

export const TableBody = ({ slice, erroresPorFila, page, pageSize, handleErrorClick, handleEdit, handleDelete }: TableBodyProps) => {
  const fieldKeys: (keyof FilaCSVParseada)[] = ['full_name', 'identity_document', 'educational_institution', 'department', 'academic_tutor', 'area', 'grade'];
  return (
    <tbody>
      {
        slice.map((r, idx) => {
          // Usar numeración consecutiva basada en la posición actual
          const numeroFilaConsecutivo = (page - 1) * pageSize + idx + 1;
          const filaOriginal = r.__row || numeroFilaConsecutivo;
          const errorInfo = erroresPorFila.get(filaOriginal);
          const tieneError = !!errorInfo;

          return (
            <tr key={`${r.identity_document}-${filaOriginal}`} className="even:bg-neutral-50/60">
              <td className="border-b border-neutral-200 px-3 py-2 text-neutral-500 font-mono text-xs">
                {numeroFilaConsecutivo}
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
        })
      }
      {
        slice.length === 0 && (
          <tr>
            <td colSpan={10} className="p-4 text-center text-neutral-600">No hay filas</td>
          </tr>
        )
      }
    </tbody >
  )
};
