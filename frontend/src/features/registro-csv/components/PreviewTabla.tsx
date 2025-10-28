import { useMemo, useState } from "react";
import { type FilaCSVParseada, type FilaCSVConError } from "../types/inscritos";

type Props = {
  validas: FilaCSVParseada[];
  errores: FilaCSVConError[];
  pageSize?: number;
  showErroresTable?: boolean;
};

export default function PreviewTabla({
  validas,
  errores,
  pageSize = 10,
  showErroresTable = true,
}: Props) {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<{ campo: string; mensajes: string[]; fila: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FilaCSVParseada | null>(null);
  const [editedData, setEditedData] = useState<FilaCSVParseada | null>(null);
  const total = validas.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  // Crear un mapa de errores por fila: { fila: { camposConError: string[], mensajes: string[] } }
  const erroresPorFila = useMemo(() => {
    const mapa = new Map<number, { camposConError: Set<string>, mensajes: string[] }>();
    errores.forEach((error) => {
      const camposConError = new Set<string>();

      // Analizar mensajes para determinar qué campos tienen error
      error.errores.forEach((msg) => {
        const msgLower = msg.toLowerCase();

        if (msgLower.includes('full_name') || msgLower.includes('nombre completo')) {
          camposConError.add('full_name');
        }
        if (msgLower.includes('identity_document') || msgLower.includes('documento')) {
          camposConError.add('identity_document');
        }
        if (msgLower.includes('educational_institution') || msgLower.includes('unidad educativa')) {
          camposConError.add('educational_institution');
        }
        if (msgLower.includes('department') || msgLower.includes('departamento')) {
          camposConError.add('department');
        }
        if (msgLower.includes('academic_tutor') || msgLower.includes('tutor')) {
          camposConError.add('academic_tutor');
        }
        if (msgLower.includes('area') || msgLower.includes('área')) {
          camposConError.add('area');
        }
        if (msgLower.includes('grade') || msgLower.includes('grado')) {
          camposConError.add('grade');
        }
      });

      mapa.set(error.__row, {
        camposConError,
        mensajes: error.errores,
      });
    });

    console.log('erroresPorFila generado:', Array.from(mapa.entries())); // Debug
    return mapa;
  }, [errores]);

  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return validas.slice(start, start + pageSize);
  }, [page, pageSize, validas]);

  // Mapeo de nombres de campos
  const nombresCampos: Record<string, string> = {
    full_name: 'Nombre completo',
    identity_document: 'Documento de identidad',
    educational_institution: 'Unidad educativa',
    department: 'Departamento',
    academic_tutor: 'Tutor académico',
    area: 'Área',
    grade: 'Grado',
  };

  // Función para obtener mensajes de error de un campo específico
  const getMensajesError = (fila: number, campo: string): string[] => {
    const errorInfo = erroresPorFila.get(fila);
    if (!errorInfo || !errorInfo.camposConError.has(campo)) return [];

    // Buscar mensajes que contengan el nombre del campo
    const mensajesRelacionados = errorInfo.mensajes.filter(msg => {
      const msgLower = msg.toLowerCase();
      // Buscar por el nombre técnico del campo
      if (msgLower.includes(campo.toLowerCase())) return true;
      // Buscar por el nombre amigable del campo
      const nombreAmigable = nombresCampos[campo]?.toLowerCase();
      if (nombreAmigable && msgLower.includes(nombreAmigable)) return true;
      return false;
    });

    // Si no encontramos mensajes específicos, devolver todos los mensajes de la fila
    return mensajesRelacionados.length > 0 ? mensajesRelacionados : errorInfo.mensajes;
  };

  const handleErrorClick = (campo: string, fila: number) => {
    const errorInfo = erroresPorFila.get(fila);
    if (!errorInfo) return;

    const mensajes = getMensajesError(fila, campo);
    console.log('handleErrorClick', { campo, fila, mensajes, errorInfo }); // Debug

    setSelectedError({ campo, mensajes, fila });
    setModalOpen(true);
  };

  const handleEdit = (row: FilaCSVParseada) => {
    setSelectedRow(row);
    setEditedData({ ...row });
    setEditModalOpen(true);
  };

  // Obtener errores de los campos del registro seleccionado
  const getFieldErrors = (campo: string): string[] => {
    if (!selectedRow?.__row) return [];
    const errorInfo = erroresPorFila.get(selectedRow.__row);
    if (!errorInfo || !errorInfo.camposConError.has(campo)) return [];

    return errorInfo.mensajes.filter(msg => {
      const msgLower = msg.toLowerCase();
      return msgLower.includes(campo.toLowerCase()) || msgLower.includes(nombresCampos[campo]?.toLowerCase() || '');
    });
  };

  const hasFieldError = (campo: string): boolean => {
    if (!selectedRow?.__row) return false;
    const errorInfo = erroresPorFila.get(selectedRow.__row);
    return errorInfo ? errorInfo.camposConError.has(campo) : false;
  };

  const handleDelete = (row: FilaCSVParseada) => {
    if (confirm(`¿Estás seguro de eliminar la fila #${row.__row}?`)) {
      // TODO: Implementar lógica de eliminación
      console.log('Eliminar fila:', row);
    }
  };

  const handleSaveEdit = () => {
    if (editedData) {
      // TODO: Implementar lógica de guardado
      console.log('Guardar cambios:', editedData);
      setEditModalOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="max-h-[60vh] overflow-auto rounded-2xl">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-800">
              <tr>
                {["#","Nombre completo","Documento","Unidad educativa","Departamento","Tutor académico","Área","Grado","Estado","Acciones"].map((h) => (
                  <th key={h} className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((r, idx) => {
                const filaOriginal = r.__row || ((page - 1) * pageSize + idx + 1); // Usar __row si existe
                const errorInfo = erroresPorFila.get(filaOriginal);
                const tieneError = !!errorInfo;

                return (
                  <tr key={`${r.identity_document}-${filaOriginal}`} className="even:bg-neutral-50/60">
                    <td className="border-b border-neutral-200 px-3 py-2 text-neutral-500 font-mono text-xs">
                      {filaOriginal}
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('full_name') ? 'text-rose-900' : ''}>{r.full_name}</span>
                        {errorInfo?.camposConError.has('full_name') && (
                          <button
                            onClick={() => handleErrorClick('full_name', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('identity_document') ? 'text-rose-900' : ''}>{r.identity_document}</span>
                        {errorInfo?.camposConError.has('identity_document') && (
                          <button
                            onClick={() => handleErrorClick('identity_document', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('educational_institution') ? 'text-rose-900' : ''}>{r.educational_institution}</span>
                        {errorInfo?.camposConError.has('educational_institution') && (
                          <button
                            onClick={() => handleErrorClick('educational_institution', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('department') ? 'text-rose-900' : ''}>{r.department}</span>
                        {errorInfo?.camposConError.has('department') && (
                          <button
                            onClick={() => handleErrorClick('department', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('academic_tutor') ? 'text-rose-900' : ''}>{r.academic_tutor || '-'}</span>
                        {errorInfo?.camposConError.has('academic_tutor') && (
                          <button
                            onClick={() => handleErrorClick('academic_tutor', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('area') ? 'text-rose-900' : ''}>{r.area || '-'}</span>
                        {errorInfo?.camposConError.has('area') && (
                          <button
                            onClick={() => handleErrorClick('area', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={errorInfo?.camposConError.has('grade') ? 'text-rose-900' : ''}>{r.grade || '-'}</span>
                        {errorInfo?.camposConError.has('grade') && (
                          <button
                            onClick={() => handleErrorClick('grade', filaOriginal)}
                            className="flex-shrink-0 text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Ver error"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
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
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          className="text-rose-600 hover:text-rose-800 transition-colors"
                          title="Eliminar"
                        >
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
          <button onClick={()=>setPage(1)} disabled={page===1} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">≪</button>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">{"<"}</button>
          <span className="rounded-md border border-neutral-300 px-2 py-1 text-sm">{page} / {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">{">"}</button>
          <button onClick={()=>setPage(pages)} disabled={page===pages} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">≫</button>
        </div>
      </div>

      {showErroresTable && errores.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-base font-semibold text-neutral-900">
            Filas con error ({errores.length})
          </h3>
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <div className="max-h-[40vh] overflow-auto rounded-2xl">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-neutral-50 text-neutral-800">
                  <tr>
                    <th className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">Fila</th>
                    <th className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">Errores</th>
                  </tr>
                </thead>
                <tbody>
                  {errores.map((e) => (
                    <tr key={e.__row} className="even:bg-neutral-50/60">
                      <td className="border-b border-neutral-200 px-3 py-2">#{e.__row}</td>
                      <td className="border-b border-neutral-200 px-3 py-2">
                        <span className="inline-flex flex-wrap gap-1">
                          {e.errores.map((msg, i) => (
                            <span key={i} className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-500/20">
                              {msg}
                            </span>
                          ))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editModalOpen && editedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Editar registro</h3>
                  <p className="text-sm text-neutral-600">Fila #{editedData.__row}</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${hasFieldError('full_name') ? 'text-rose-700' : 'text-neutral-700'}`}>
                    Nombre completo <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editedData.full_name || ''}
                    onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      hasFieldError('full_name')
                        ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {hasFieldError('full_name') && (
                    <div className="mt-1 space-y-1">
                      {getFieldErrors('full_name').map((error, idx) => (
                        <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${hasFieldError('identity_document') ? 'text-rose-700' : 'text-neutral-700'}`}>
                    Documento de identidad <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editedData.identity_document || ''}
                    onChange={(e) => setEditedData({ ...editedData, identity_document: e.target.value })}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      hasFieldError('identity_document')
                        ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {hasFieldError('identity_document') && (
                    <div className="mt-1 space-y-1">
                      {getFieldErrors('identity_document').map((error, idx) => (
                        <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${hasFieldError('educational_institution') ? 'text-rose-700' : 'text-neutral-700'}`}>
                    Unidad educativa <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editedData.educational_institution || ''}
                    onChange={(e) => setEditedData({ ...editedData, educational_institution: e.target.value })}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      hasFieldError('educational_institution')
                        ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {hasFieldError('educational_institution') && (
                    <div className="mt-1 space-y-1">
                      {getFieldErrors('educational_institution').map((error, idx) => (
                        <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${hasFieldError('department') ? 'text-rose-700' : 'text-neutral-700'}`}>
                    Departamento <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={editedData.department || ''}
                    onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      hasFieldError('department')
                        ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {hasFieldError('department') && (
                    <div className="mt-1 space-y-1">
                      {getFieldErrors('department').map((error, idx) => (
                        <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${hasFieldError('academic_tutor') ? 'text-rose-700' : 'text-neutral-700'}`}>
                    Tutor académico
                  </label>
                  <input
                    type="text"
                    value={editedData.academic_tutor || ''}
                    onChange={(e) => setEditedData({ ...editedData, academic_tutor: e.target.value })}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      hasFieldError('academic_tutor')
                        ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {hasFieldError('academic_tutor') && (
                    <div className="mt-1 space-y-1">
                      {getFieldErrors('academic_tutor').map((error, idx) => (
                        <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${hasFieldError('area') ? 'text-rose-700' : 'text-neutral-700'}`}>
                      Área
                    </label>
                    <input
                      type="text"
                      value={editedData.area || ''}
                      onChange={(e) => setEditedData({ ...editedData, area: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        hasFieldError('area')
                          ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                          : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {hasFieldError('area') && (
                      <div className="mt-1 space-y-1">
                        {getFieldErrors('area').map((error, idx) => (
                          <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                            <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${hasFieldError('grade') ? 'text-rose-700' : 'text-neutral-700'}`}>
                      Grado
                    </label>
                    <input
                      type="text"
                      value={editedData.grade || ''}
                      onChange={(e) => setEditedData({ ...editedData, grade: e.target.value })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        hasFieldError('grade')
                          ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500 focus:ring-rose-500'
                          : 'border-neutral-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    />
                    {hasFieldError('grade') && (
                      <div className="mt-1 space-y-1">
                        {getFieldErrors('grade').map((error, idx) => (
                          <p key={idx} className="text-xs text-rose-600 flex items-start gap-1">
                            <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {modalOpen && selectedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Error de validación</h3>
                  <p className="text-sm text-neutral-600">Fila #{selectedError.fila}</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-3">
                <span className="inline-block rounded-md bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                  {nombresCampos[selectedError.campo] || selectedError.campo}
                </span>
              </div>

              <div className="space-y-2">
                {selectedError.mensajes.map((mensaje, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-lg bg-rose-50 p-3 border border-rose-200">
                    <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-rose-900">{mensaje}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
