import { useMemo, useState } from "react";
import { validarCSVInscritos, camposPlantilla } from "../logic/validarCSVInscritos";
import { type FilaCSVValida, type FilaCSVConError } from "../types/inscritos";
import { useImportOlympians } from "./useOlympianQueries";

type ErrorBackendConDatos = {
  __row: number;
  datos: FilaCSVValida;
  errores: string[];
};

export function useCSVRegistro() {
  const [validas, setValidas] = useState<FilaCSVValida[]>([]);
  const [errores, setErrores] = useState<FilaCSVConError[]>([]);
  const [erroresBackend, setErroresBackend] = useState<ErrorBackendConDatos[]>([]);
  const [csvNombre, setCsvNombre] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const importMutation = useImportOlympians();

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

  const confirmarImportacion = () => {
    setConfirmOpen(true);
  }

  const doImport = async () => {
    setLoading(true);
    setErroresBackend([]); // Limpiar errores previos
    try {
      const payload = { rows: validas };
      await importMutation.mutateAsync(payload);
      setToastText(`✅ Importación exitosa: ${validas.length} concursantes registrados.`);
      // Limpiar después de éxito
      setTimeout(() => {
        reiniciar();
      }, 2000);
    } catch (error: any) {
      console.error('Error importando:', error);
      let mensaje = '❌ No se pudo completar la importación. Revise el reporte de errores más abajo.';

      // Manejar errores de validación de Laravel
      if (error?.response?.data?.errors) {
        const errores = error.response.data.errors;
        const erroresPorFila = new Map<number, string[]>();

        Object.keys(errores).forEach(key => {
          const msgs = errores[key];
          if (Array.isArray(msgs)) {
            msgs.forEach(msg => {
              const match = key.match(/rows\.(\d+)\.(\w+)/);
              if (match) {
                const indice = parseInt(match[1]);
                const fila = indice + 1; // +1 para convertir índice a número de fila (empezando en 1)
                const campo = match[2];

                let mensajeAmigable = msg;

                // Detectar duplicados
                if (msg.includes('has already been taken') || msg.includes('already exists')) {
                  if (campo === 'identity_document') {
                    mensajeAmigable = 'El documento de identidad ya está registrado en el sistema';
                  } else {
                    mensajeAmigable = `El campo "${campo}" ya existe en el sistema`;
                  }
                }
                // Detectar campos requeridos
                else if (msg.includes('required')) {
                  const nombresCampos: Record<string, string> = {
                    full_name: 'Nombre completo',
                    identity_document: 'Documento de identidad',
                    legal_guardian_contact: 'Contacto del tutor legal',
                    educational_institution: 'Unidad educativa',
                    department: 'Departamento',
                    school_grade: 'Grado escolar'
                  };
                  mensajeAmigable = `El campo "${nombresCampos[campo] || campo}" es obligatorio`;
                }
                // Detectar máxima longitud
                else if (msg.includes('may not be greater than')) {
                  mensajeAmigable = 'El valor es demasiado largo';
                }

                if (!erroresPorFila.has(fila)) {
                  erroresPorFila.set(fila, []);
                }
                erroresPorFila.get(fila)!.push(mensajeAmigable);
              }
            });
          }
        });

        // Convertir a formato con datos completos
        const erroresFormateados: ErrorBackendConDatos[] = Array.from(erroresPorFila.entries()).map(([fila, errores]) => {
          // Buscar los datos de la fila en validas
          const indiceFila = fila - 1; // Restar 1 para volver al índice del array (que empieza en 0)
          const datos = validas[indiceFila] || {
            full_name: '',
            identity_document: '',
            legal_guardian_contact: '',
            educational_institution: '',
            department: '',
            school_grade: ''
          };

          return {
            __row: fila,
            datos,
            errores
          };
        });

        setErroresBackend(erroresFormateados);

        const cantidadErrores = erroresFormateados.length;
        mensaje = `❌ No se pudieron importar ${cantidadErrores} fila${cantidadErrores > 1 ? 's' : ''}. Revise el reporte más abajo.`;
      } else if (error?.response?.data?.message) {
        mensaje = `❌ ${error.response.data.message}`;
      } else if (error?.message) {
        mensaje = `❌ ${error.message}`;
      }

      setToastText(mensaje);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const reiniciar = () => {
    setValidas([]);
    setErrores([]);
    setErroresBackend([]);
    setCsvNombre("");
  };

  return {
    state: { validas, errores, erroresBackend, csvNombre, totales, confirmOpen, toastText, loading },
    actions: { onCSVParseado, descargarPlantilla, confirmarImportacion, doImport, reiniciar, setToastText, setConfirmOpen },
  };
}
