import { useState, useMemo } from "react";
import CSVDropZone from "../components/CSVDropZone";
import PreviewTabla from "../components/PreviewTabla";
import {
  camposPlantilla,
  validarCSVInscritos,
  type FilaCSVValida,
  type FilaCSVConError,
} from "../logic/validarCSVInscritos";

//export const Route = createFileRoute("/concursantes/registro")({
//  component: RegistroPage,
//});

export default function RegistroPage() {
  // --- estado UI sidebar (dropdown) ---
  const [menuConcursantesOpen, setMenuConcursantesOpen] = useState<boolean>(true);

  // --- estado HU-1 ---
  const [validas, setValidas] = useState<FilaCSVValida[]>([]);
  const [errores, setErrores] = useState<FilaCSVConError[]>([]);
  const [csvNombre, setCsvNombre] = useState<string>("");

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
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="border-r border-gray-200 bg-white p-4">
        <div className="mb-4 text-lg font-extrabold tracking-wide">oh SANSI</div>

        <nav className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-semibold text-neutral-900 hover:bg-gray-100"
              onClick={() => setMenuConcursantesOpen(v => !v)}
              aria-expanded={menuConcursantesOpen}
              aria-controls="submenu-concursantes"
            >
              <span className="flex items-center gap-2">Concursantes</span>
              <span className={`transition-transform ${menuConcursantesOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {menuConcursantesOpen && (
              <div id="submenu-concursantes" className="ml-2 flex flex-col gap-1 border-l-2 border-gray-200 pl-2">
                {/* Item activo (esta página) */}
                <a
                  href="/concursantes/registro"
                  className="rounded-lg px-2 py-2 text-sm text-neutral-900 hover:bg-indigo-50"
                >
                  Registro
                </a>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Registro de Concursantes</h1>

        {totales.validas === 0 && totales.errores === 0 ? (
          <>
            <div className="mb-4">
              <button onClick={descargarPlantilla} className="btn btn-sec">
                Descargar plantilla CSV
              </button>
            </div>

            <CSVDropZone onParse={onCSVParseado} />
          </>
        ) : (
          <>
            <div className="mb-3 text-sm">
              <strong>Archivo:</strong> {csvNombre} &nbsp;|&nbsp;
              <strong>Válidas:</strong> {totales.validas} &nbsp;|&nbsp;
              <strong>Con error:</strong> {totales.errores}
            </div>

            <div className="mb-3 flex gap-2">
              <button onClick={confirmarImportacion} className="btn btn-prim">Registrar Todos</button>
              <button onClick={reiniciar} className="btn btn-sec">Cancelar</button>
            </div>

            <PreviewTabla validas={validas} errores={errores} />
          </>
        )}
      </main>
    </div>    
  );
}
