import { useMemo, useState } from "react";
import { validarCSVInscritos, camposPlantilla } from "../logic/validarCSVInscritos";
import { type FilaCSVValida, type FilaCSVConError } from "../types/inscritos";
import { importInscritos } from "../services/import.service";

export function useCSVRegistro() {
  const [validas, setValidas] = useState<FilaCSVValida[]>([]);
  const [errores, setErrores] = useState<FilaCSVConError[]>([]);
  const [csvNombre, setCsvNombre] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totales = useMemo(() => ({
    validas: validas.length, errores: errores.length
  }), [validas, errores]);

  const onCSVParseado = (rows: Record<string,string>[], nombreArchivo: string) => {
    const { validas, errores } = validarCSVInscritos(rows);
    setValidas(validas);
    setErrores(errores);
    setCsvNombre(nombreArchivo);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const descargarPlantilla = () => {
    const csv = (camposPlantilla as readonly string[]).join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plantilla_inscritos.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const confirmarImportacion = () => setConfirmOpen(true);

  const doImport = async () => {
    setLoading(true);
    try {
      await importInscritos(validas);
      setToastText(`Importación OK: ${validas.length} filas válidas.`);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const reiniciar = () => { setValidas([]); setErrores([]); setCsvNombre(""); };

  return {
    state: { validas, errores, csvNombre, totales, confirmOpen, toastText, loading },
    actions: { onCSVParseado, descargarPlantilla, confirmarImportacion, doImport, reiniciar, setToastText, setConfirmOpen },
  };
}
