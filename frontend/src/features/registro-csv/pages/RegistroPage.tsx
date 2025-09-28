import CSVDropZone from "../components/CSVDropZone";
import PreviewTabla from "../components/PreviewTabla";
import { useCSVRegistro } from "../hooks/useCSVRegistro";

import Modal from "../ui/Modal";
import Toast from "../ui/Toast";
import Button from "../ui/Button";
import Card from "../ui/Card";
import PageHeader from "../ui/PageHeader";
import { Stat } from "../ui/Stats";

export default function RegistroPage() {
  const { state, actions } = useCSVRegistro();
  const { validas, errores, csvNombre, totales, confirmOpen, toastText, loading } = state;

  const showEmpty = totales.validas === 0 && totales.errores === 0;

  return (
    <div className="min-h-[100vh] bg-neutral-50">
      <Toast open={!!toastText} text={toastText ?? ""} onClose={()=>actions.setToastText(null)} />

      <PageHeader
        title="Registro de Concursantes"
        subtitle="Sube el CSV con la plantilla oficial y valida antes de registrar."
      />

      <main className="mx-auto mt-6 w-full max-w-6xl px-4 pb-14 md:px-6">
        {showEmpty ? (
          <div className="grid gap-4 md:grid-cols-[340px_1fr]">
            <aside className="order-2 md:order-1">
              <Card className="p-4">
                <h2 className="text-base font-semibold text-neutral-900">Acciones rápidas</h2>
                <p className="mt-1 text-sm text-neutral-600">Descarga la plantilla con los encabezados correctos.</p>
                <Button variant="accent" className="mt-3 w-full" onClick={actions.descargarPlantilla}>
                  Descargar plantilla CSV
                </Button>
              </Card>
            </aside>
            <section className="order-1 md:order-2">
              <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-4 md:p-6">
                <CSVDropZone onParse={actions.onCSVParseado} />
              </div>
            </section>
          </div>
        ) : (
          <>
            <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4">
                <div className="text-xs uppercase text-neutral-500">Archivo</div>
                <div className="truncate text-sm font-semibold text-neutral-900">{csvNombre}</div>
              </Card>
              <Stat label="Válidas" value={totales.validas} accent="success" />
              <Stat label="Con error" value={totales.errores} accent="danger" />
            </div>

            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <Button onClick={actions.confirmarImportacion} isLoading={loading}>Registrar todos</Button>
              <Button variant="outline" onClick={actions.reiniciar} disabled={loading}>Cancelar</Button>
            </div>

            <PreviewTabla validas={validas} errores={errores} />
          </>
        )}
      </main>

      <Modal
        open={confirmOpen}
        title="Confirmar registro de concursantes"
        description={`Se registrarán ${totales.validas} filas válidas. Las filas con error no serán importadas.`}
        confirmText={loading ? "Registrando..." : "Registrar"}
        confirmDisabled={loading}
        cancelText="Volver"
        onConfirm={actions.doImport}
        onClose={()=>actions.setConfirmOpen(false)}
      />
    </div>
  );
}
