import { useMemo, useState } from "react";
import { type FilaCSVValida, type FilaCSVConError } from "../logic/validarCSVInscritos";

type Props = {
  validas: FilaCSVValida[];
  errores: FilaCSVConError[];
  pageSize?: number;
};

export default function PreviewTabla({ validas, errores, pageSize = 10 }: Props) {
  const [page, setPage] = useState(1);
  const total = validas.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  const slice = useMemo(()=>{
    const start = (page - 1) * pageSize;
    return validas.slice(start, start + pageSize);
  }, [page, pageSize, validas]);

  return (
    <>
      <div className="rounded-xl ring-1 ring-neutral-200 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50 text-neutral-800">
              {["Nombre completo","Documento","Unidad educativa","Departamento","Área","Curso/Nivel","Estado"].map(h=>(
                <th key={h} className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r)=>(
              <tr key={`${r.CI}-${r.Area}-${r.Nivel}-${r.__row}`} className="even:bg-neutral-50/60">
                <td className="border-b border-neutral-200 px-3 py-2">{r.NombreCompleto}</td>
                <td className="border-b border-neutral-200 px-3 py-2">{r.CI}</td>
                <td className="border-b border-neutral-200 px-3 py-2">{r.UnidadEducativa}</td>
                <td className="border-b border-neutral-200 px-3 py-2">{r.Departamento}</td>
                <td className="border-b border-neutral-200 px-3 py-2">{r.Area}</td>
                <td className="border-b border-neutral-200 px-3 py-2">{r.Nivel}</td>
                <td className="border-b border-neutral-200 px-3 py-2">
                  <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-500/20">
                    Válida
                  </span>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-neutral-600">No hay filas válidas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button onClick={()=>setPage(1)} disabled={page===1} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">≪</button>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">{"<"}</button>
        <span className="rounded-md border border-neutral-300 px-2 py-1 text-sm">{page} / {pages}</span>
        <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">{">"}</button>
        <button onClick={()=>setPage(pages)} disabled={page===pages} className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100 disabled:opacity-50">≫</button>
      </div>

      {/* Errores */}
      {errores.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-base font-semibold text-neutral-900">
            Filas con error ({errores.length})
          </h3>
          <div className="rounded-xl ring-1 ring-neutral-200 overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50 text-neutral-800">
                  <th className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">Fila</th>
                  <th className="border-b border-neutral-200 px-3 py-2 text-left font-semibold">Errores</th>
                </tr>
              </thead>
              <tbody>
                {errores.map(e=>(
                  <tr key={e.__row} className="even:bg-neutral-50/60">
                    <td className="border-b border-neutral-200 px-3 py-2">#{e.__row}</td>
                    <td className="border-b border-neutral-200 px-3 py-2">
                      <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-500/20">
                        {e.errores.join("; ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
