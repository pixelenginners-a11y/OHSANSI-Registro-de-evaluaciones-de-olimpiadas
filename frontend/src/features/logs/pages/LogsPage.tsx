import { useMemo, useState } from "react";
import { useLogs } from "../hooks/useLogs";
import type { LogRecord } from "../../../api/endpointLogs";

type FiltersState = {
  role: string;
  phase: string;
  page: number;
};

const LogsPage = () => {
  const [formFilters, setFormFilters] = useState<FiltersState>({
    role: "",
    phase: "",
    page: 1,
  });
  const [appliedFilters, setAppliedFilters] = useState<FiltersState>({
    role: "",
    phase: "",
    page: 1,
  });

  const { data, isLoading, isError, refetch } = useLogs(cleanFilters(appliedFilters));
  const rows = useMemo<LogRecord[]>(() => data?.data ?? [], [data]);
  const [selectedLog, setSelectedLog] = useState<LogRecord | null>(null);

  const handleChange = (field: keyof FiltersState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormFilters((prev) => ({ ...prev, [field]: e.target.value, page: 1 }));
  };

  const handlePage = (delta: number) => {
    setAppliedFilters((prev) => ({ ...prev, page: Math.max(1, prev.page + delta) }));
  };

  const applyFilters = () => {
    setAppliedFilters(formFilters);
    refetch();
  };

  return (
    <div className="w-full px-3 sm:px-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Logs de auditoría</h1>
          <p className="text-sm text-gray-500">Acciones registradas por rol, fase y entidad.</p>
        </div>
        <button
          className="hidden h-10 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:block"
          onClick={() => refetch()}
        >
          Refrescar
        </button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Rol</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={formFilters.role}
              onChange={handleChange("role")}
            >
              <option value="">Todos</option>
              <option value="Administrador">Administrador</option>
              <option value="Evaluador">Evaluador</option>
              <option value="Responsable Academico">Responsable Académico</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600">Fase</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={formFilters.phase}
              onChange={handleChange("phase")}
            >
              <option value="">Todas</option>
              <option value="clasificacion">Clasificación</option>
              <option value="final">Final</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            onClick={applyFilters}
          >
            Aplicar filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-xs font-semibold uppercase text-gray-600">
              <tr>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Acción</th>
                <th className="px-3 py-2">Actor (rol)</th>
                <th className="px-3 py-2">Entidad</th>
                <th className="px-3 py-2">Área</th>
                <th className="px-3 py-2">Nivel</th>
                <th className="px-3 py-2">Fase</th>
                <th className="px-3 py-2 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                    Cargando logs...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-red-600">
                    Error al cargar logs.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                    Sin registros
                  </td>
                </tr>
              )}
              {rows.map((log: LogRecord) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{log.action}</td>
                  <td className="px-3 py-2">
                    {log.actor_id ?? "—"}{" "}
                    <span className="text-xs text-gray-500">
                      {log.actor_role ? `(${log.actor_role})` : ""}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {log.entity_type ?? "—"}
                    {log.entity_id ? ` #${log.entity_id}` : ""}
                  </td>
                  <td className="px-3 py-2">{log.area_id ?? "—"}</td>
                  <td className="px-3 py-2">{log.grade_id ?? "—"}</td>
                  <td className="px-3 py-2">{log.phase ?? "—"}</td>
                  <td className="px-3 py-2 text-center">
                    <button
                      className="rounded-md border px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      onClick={() => setSelectedLog(log)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md bg-gray-50 px-3 py-2 text-sm">
            <button
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              disabled={appliedFilters.page <= 1}
              onClick={() => handlePage(-1)}
            >
              Anterior
            </button>
            <span className="text-gray-600">
              Página {data.current_page} de {data.last_page} (total {data.total})
            </span>
            <button
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              disabled={data.current_page >= data.last_page}
              onClick={() => handlePage(1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};

function cleanFilters(filters: FiltersState) {
  const cleaned: Record<string, string | number> = {};
  if (filters.role) cleaned.role = filters.role;
  if (filters.phase) cleaned.phase = filters.phase;
  cleaned.page = filters.page;
  return cleaned;
}

export default LogsPage;

type LogDetailModalProps = {
  log: LogRecord;
  onClose: () => void;
};

function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  const meta = log.metadata ?? {};
  const before = (meta as any).before ?? (meta as any).previous ?? null;
  const after = (meta as any).after ?? null;

  const keys = Array.from(
    new Set([
      ...Object.keys(before || {}),
      ...Object.keys(after || {}),
    ])
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detalle de log</h2>
            <p className="text-sm text-gray-500">
              Acción: {log.action} · Entidad: {log.entity_type ?? "—"}
              {log.entity_id ? ` #${log.entity_id}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div><span className="font-semibold">Fecha:</span> {new Date(log.created_at).toLocaleString()}</div>
          <div><span className="font-semibold">Actor:</span> {log.actor_id ?? "—"} {log.actor_role ? `(${log.actor_role})` : ""}</div>
          <div><span className="font-semibold">Área:</span> {log.area_id ?? "—"} · <span className="font-semibold">Nivel:</span> {log.grade_id ?? "—"} · <span className="font-semibold">Fase:</span> {log.phase ?? "—"}</div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Cambios</h3>
          {keys.length === 0 ? (
            <p className="text-sm text-gray-600">Sin detalles adicionales.</p>
          ) : (
            <div className="space-y-3">
              {keys.map((k) => (
                <div key={k} className="flex items-start justify-between gap-4 rounded-md border px-3 py-2">
                  <div className="text-xs font-semibold uppercase text-gray-500">{k}</div>
                  <div className="flex-1 text-sm text-gray-800">
                    <span className="text-gray-500">Antes: </span>
                    <span>{stringifyValue(before?.[k]) ?? "—"}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-gray-500">Después: </span>
                    <span>{stringifyValue(after?.[k]) ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="rounded-md border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
