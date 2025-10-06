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
  const { validas, errores, erroresBackend, csvNombre, totales, confirmOpen, toastText, loading } = state;
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

            {erroresBackend.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                      <span className="text-sm font-semibold text-rose-700">!</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        Registros que no se pudieron importar
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {erroresBackend.length} {erroresBackend.length === 1 ? 'registro' : 'registros'} con errores
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {erroresBackend.map((e) => (
                    <div key={e.__row} className="rounded-lg border border-rose-200 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
                            Fila {e.__row} del CSV
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {e.errores.map((msg, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                              <span className="text-rose-500">✕</span>
                              {msg}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-md bg-neutral-50 px-3 py-2">
                          <div className="text-xs font-medium text-neutral-500">Nombre completo</div>
                          <div className="mt-0.5 text-sm font-medium text-neutral-900">{e.datos.full_name || '-'}</div>
                        </div>

                        <div className="rounded-md bg-neutral-50 px-3 py-2">
                          <div className="text-xs font-medium text-neutral-500">Documento de identidad</div>
                          <div className="mt-0.5 text-sm font-medium text-neutral-900">{e.datos.identity_document || '-'}</div>
                        </div>

                        <div className="rounded-md bg-neutral-50 px-3 py-2">
                          <div className="text-xs font-medium text-neutral-500">Unidad educativa</div>
                          <div className="mt-0.5 text-sm font-medium text-neutral-900">{e.datos.educational_institution || '-'}</div>
                        </div>

                        <div className="rounded-md bg-neutral-50 px-3 py-2">
                          <div className="text-xs font-medium text-neutral-500">Departamento</div>
                          <div className="mt-0.5 text-sm font-medium text-neutral-900">{e.datos.department || '-'}</div>
                        </div>

                        <div className="rounded-md bg-neutral-50 px-3 py-2">
                          <div className="text-xs font-medium text-neutral-500">Grado escolar</div>
                          <div className="mt-0.5 text-sm font-medium text-neutral-900">{e.datos.school_grade || '-'}</div>
                        </div>

                        <div className="rounded-md bg-neutral-50 px-3 py-2">
                          <div className="text-xs font-medium text-neutral-500">Contacto del tutor</div>
                          <div className="mt-0.5 text-sm font-medium text-neutral-900">{e.datos.legal_guardian_contact || '-'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
