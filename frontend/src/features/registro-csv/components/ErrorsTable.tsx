import { type FilaCSVConError } from "../types/inscritos";

type Props = {
  errores: FilaCSVConError[];
};

export default function ErrorsTable({ errores }: Props) {
  if (errores.length === 0) return null;

  return (
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
  );
}
