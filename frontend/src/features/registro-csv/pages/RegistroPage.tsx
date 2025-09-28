import { useState, useMemo, useEffect } from "react";
import CSVDropZone from "../components/CSVDropZone";
import PreviewTabla from "../components/PreviewTabla";
import {
  camposPlantilla,
  validarCSVInscritos,
  type FilaCSVValida,
  type FilaCSVConError,
} from "../logic/validarCSVInscritos";

/** --- UI helpers (modal + toast) --- */
function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-[61] w-[92%] max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-neutral-700">{description}</p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({
  open,
  text,
  onClose,
}: {
  open: boolean;
  text: string;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    setVisible(open);
    if (open) {
      const t = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 2800);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!visible) return null;
  return (
    <div className="fixed right-4 top-4 z-[70]">
      <div className="rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-neutral-200">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            ✓
          </span>
          <p className="text-sm font-medium text-neutral-800">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  const [validas, setValidas] = useState<FilaCSVValida[]>([]);
  const [errores, setErrores] = useState<FilaCSVConError[]>([]);
  const [csvNombre, setCsvNombre] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const totales = useMemo(
    () => ({ validas: validas.length, errores: errores.length }),
    [validas, errores]
  );

  const onCSVParseado = (
    rows: Record<string, string>[],
    nombreArchivo: string
  ) => {
    const { validas, errores } = validarCSVInscritos(rows);
    setValidas(validas);
    setErrores(errores);
    setCsvNombre(nombreArchivo);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    // Abrimos modal en lugar de alert
    setConfirmOpen(true);
  };

  const doImport = () => {
    // Aquí luego llamas a tu API real.
    setConfirmOpen(false);
    setToastOpen(true);
  };

  const reiniciar = () => {
    setValidas([]);
    setErrores([]);
    setCsvNombre("");
  };

  return (
    <div className="min-h-[100vh] bg-neutral-50">
      {/* Toast */}
      <Toast
        open={toastOpen}
        text={`Importación simulada OK: ${validas.length} filas válidas.`}
        onClose={() => setToastOpen(false)}
      />

      {/* Header de página */}
      <header className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-6">
        <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 md:text-4xl">
          Registro de Concursantes
        </h1>
        <p className="mt-1 text-sm text-neutral-600 md:text-base">
          Sube el CSV con la plantilla oficial y valida antes de registrar.
        </p>
      </header>

      {/* Contenido */}
      <main className="mx-auto mt-6 w-full max-w-6xl px-4 pb-14 md:px-6">
        {totales.validas === 0 && totales.errores === 0 ? (
          <div className="grid gap-4 md:grid-cols-[340px_1fr]">
            {/* Acciones */}
            <aside className="order-2 md:order-1">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                <h2 className="text-base font-semibold text-neutral-900">
                  Acciones rápidas
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Descarga la plantilla con los encabezados correctos.
                </p>
                <button
                  onClick={descargarPlantilla}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#F77F00] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition md:text-base"
                >
                  Descargar plantilla CSV
                </button>
              </div>
            </aside>

            {/* Dropzone */}
            <section className="order-1 md:order-2">
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4 md:p-6">
                <CSVDropZone onParse={onCSVParseado} />
              </div>
            </section>
          </div>
        ) : (
          <>
            {/* Resumen */}
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs uppercase text-neutral-500">Archivo</div>
                <div className="truncate text-sm font-semibold text-neutral-900">
                  {csvNombre}
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs uppercase text-neutral-500">Válidas</div>
                <div className="text-lg font-extrabold text-emerald-700">
                  {totales.validas}
                </div>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs uppercase text-neutral-500">
                  Con error
                </div>
                <div className="text-lg font-extrabold text-rose-700">
                  {totales.errores}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={confirmarImportacion}
                className="rounded-lg bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition md:text-base"
              >
                Registrar todos
              </button>
              <button
                onClick={reiniciar}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition md:text-base"
              >
                Cancelar
              </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-3 md:p-4">
              <PreviewTabla validas={validas} errores={errores} />
            </div>
          </>
        )}
      </main>

      {/* Modal de confirmación */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar registro de concursantes"
        description={`Se registrarán ${validas.length} filas válidas. Las filas con error no serán importadas.`}
        confirmText="Registrar"
        cancelText="Volver"
        onConfirm={doImport}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
