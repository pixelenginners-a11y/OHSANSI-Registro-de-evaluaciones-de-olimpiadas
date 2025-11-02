import { useState } from "react";
import { type FilaCSVParseada, type FilaCSVConError } from "../types/inscritos";
import { useErrorMapping, FIELD_NAMES } from "../hooks/useErrorMapping";
import { usePageController } from "../hooks/usePageController";
import ErrorModal from "./ErrorModal";
import EditModal from "./EditModal";
import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import { TableBody } from "./TableBody";

type Props = {
  validas: FilaCSVParseada[];
  errores: FilaCSVConError[];
  pageSize?: number;
  showErroresTable?: boolean;
};

export default function PreviewTabla({ validas, errores, pageSize = 10}: Props) {
  const [filas, setFilas] = useState<FilaCSVParseada[]>(validas);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<{ campo: string; mensajes: string[]; fila: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FilaCSVParseada | null>(null);
  const { erroresPorFila, getMensajesError, hasFieldError } = useErrorMapping(errores);
  const { page, setPage, pages, slice } = usePageController(filas, pageSize);

  const handleErrorClick = (campo: string, fila: number) => {
    const mensajes = getMensajesError(fila, campo);
    setSelectedError({ campo, mensajes, fila });
    setModalOpen(true);
  };

  const handleEdit = (row: FilaCSVParseada) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedRow(null);
  };

  const handleDelete = (row: FilaCSVParseada) => {
    setFilas(prev => prev.filter(f => f.identity_document !== row.identity_document || f.__row !== row.__row));
  };

  const handleSaveEdit = (data: FilaCSVParseada) => {
    setFilas(prev => prev.map(fila =>
      fila.__row === data.__row ? data : fila
    ));
    handleCloseEditModal();
  };

  const getFieldErrorsForRow = (campo: string): string[] => {
    if (!selectedRow?.__row) return [];
    return getMensajesError(selectedRow.__row, campo);
  };

  const hasFieldErrorForRow = (campo: string): boolean => {
    if (!selectedRow?.__row) return false;
    return hasFieldError(selectedRow.__row, campo);
  };

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="max-h-[60vh] overflow-auto rounded-2xl">
          <table className="w-full border-collapse text-sm">
            <TableHeader />
            <TableBody
              slice={slice}
              erroresPorFila={erroresPorFila}
              page={page}
              pageSize={pageSize}
              handleErrorClick={handleErrorClick}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </table>
        </div>

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>

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
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          getFieldErrors={getFieldErrorsForRow}
          hasFieldError={hasFieldErrorForRow}
        />
      )}
    </>
  );
}
