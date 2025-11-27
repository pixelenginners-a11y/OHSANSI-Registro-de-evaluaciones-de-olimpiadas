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
  const fieldKeys: (keyof FilaCSVParseada)[] = ['full_name', 'identity_document', 'educational_institution', 'department', 'academic_tutor', 'area', 'grade', 'group_name'];
  return (
    <tbody>
      {
        slice.map((r, idx) => {
          const numeroFilaConsecutivo = (page - 1) * pageSize + idx + 1;
          const filaOriginal = r.__row || numeroFilaConsecutivo;
          const errorInfo = erroresPorFila.get(filaOriginal);

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
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:text-blue-800 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(r)} className="text-rose-600 hover:text-rose-800 transition-colors">
                    Eliminar
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
