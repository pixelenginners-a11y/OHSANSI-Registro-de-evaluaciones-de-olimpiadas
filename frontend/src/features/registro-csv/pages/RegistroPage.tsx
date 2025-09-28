import { useState, useMemo } from "react";
import CSVDropZone from "../components/CSVDropZone";
import PreviewTabla from "../components/PreviewTabla";
import {
  camposPlantilla,
  validarCSVInscritos,
  type FilaCSVValida,
  type FilaCSVConError,
} from "../logic/validarCSVInscritos";

export default function RegistroPage() {
  
  const [validas, setValidas] = useState<FilaCSVValida[]>([]);
  const [errores, setErrores] = useState<FilaCSVConError[]>([]);
  const [csvNombre, setCsvNombre] = useState("");

  const totales = useMemo(
    () => ({ validas: validas.length, errores: errores.length }),
    [validas, errores]
  );

  const onCSVParseado = (rows: Record<string, string>[], nombreArchivo: string) => {
    const { validas, errores } = validarCSVInscritos(rows);
    setValidas(validas);
    setErrores(errores);
    setCsvNombre(nombreArchivo);
  };

  const descargarPlantilla = () => {
    const csv = camposPlantilla.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_inscritos.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmarImportacion = () => {
    alert(`Importación simulada OK: ${validas.length} filas válidas.`);
  };

  const reiniciar = () => { setValidas([]); setErrores([]); setCsvNombre(""); };

  return (
    <div className="min-h-[70vh] bg-neutral-40 font-sans">

      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-[260px_1fr]">

        {/* Main */}
        <main className="p-4 md:p-6">
          <h1 className="mb-4 text-2xl font-extrabold text-neutral-900 md:text-3xl">
            Registro de Concursantes
          </h1>

          {totales.validas === 0 && totales.errores === 0 ? (
            <>
              <div className="mb-4">
                <button
                  onClick={descargarPlantilla}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#F77F00] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition md:text-base"
                >
                  Descargar plantilla CSV
                </button>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-3 md:p-4">
                <CSVDropZone onParse={onCSVParseado} />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3 text-sm text-neutral-700 md:text-base">
                <strong>Archivo:</strong> {csvNombre} &nbsp;|&nbsp;
                <strong>Válidas:</strong> {totales.validas} &nbsp;|&nbsp;
                <strong>Con error:</strong> {totales.errores}
              </div>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={confirmarImportacion}
                  className="rounded-lg bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition md:text-base"
                >
                  Registrar Todos
                </button>
                <button
                  onClick={reiniciar}
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition md:text-base"
                >
                  Cancelar
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-3 md:p-4">
                <PreviewTabla validas={validas} errores={errores} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
