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
      <div className="card overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b p-2 text-left font-semibold">Nombre completo</th>
              <th className="border-b p-2 text-left font-semibold">Documento</th>
              <th className="border-b p-2 text-left font-semibold">Unidad educativa</th>
              <th className="border-b p-2 text-left font-semibold">Departamento</th>
              <th className="border-b p-2 text-left font-semibold">Área</th>
              <th className="border-b p-2 text-left font-semibold">Curso/Nivel</th>
              <th className="border-b p-2 text-left font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((r)=>(
              <tr key={`${r.CI}-${r.Area}-${r.Nivel}-${r.__row}`} className="even:bg-gray-50/40">
                <td className="border-b p-2">{r.NombreCompleto}</td>
                <td className="border-b p-2">{r.CI}</td>
                <td className="border-b p-2">{r.UnidadEducativa}</td>
                <td className="border-b p-2">{r.Departamento}</td>
                <td className="border-b p-2">{r.Area}</td>
                <td className="border-b p-2">{r.Nivel}</td>
                <td className="border-b p-2"><span className="badge-ok">Válida</span></td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center">No hay filas válidas</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center justify-center gap-2">
        <button onClick={()=>setPage(1)} disabled={page===1} className="btn btn-sec disabled:opacity-50">≪</button>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn btn-sec disabled:opacity-50">{"<"}</button>
        <span className="rounded-md border border-gray-300 px-2 py-1 text-sm">{page} / {pages}</span>
        <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="btn btn-sec disabled:opacity-50">{">"}</button>
        <button onClick={()=>setPage(pages)} disabled={page===pages} className="btn btn-sec disabled:opacity-50">≫</button>
      </div>

      {errores.length > 0 && (
        <div className="mt-3">
          <h3 className="mb-2 text-base font-semibold">Filas con error ({errores.length})</h3>
          <div className="card overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b p-2 text-left font-semibold">Fila</th>
                  <th className="border-b p-2 text-left font-semibold">Errores</th>
                </tr>
              </thead>
              <tbody>
                {errores.map(e=>(
                  <tr key={e.__row} className="even:bg-gray-50/40">
                    <td className="border-b p-2">#{e.__row}</td>
                    <td className="border-b p-2"><span className="badge-err">{e.errores.join("; ")}</span></td>
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
