import { useMemo, useState } from "react";
import { validarCSVInscritos, camposPlantilla } from "../logic/validarCSVInscritos";
import { type FilaCSVParseada, type FilaCSVValida } from "../types/inscritos";
import { useImportOlympians } from "./useOlympianQueries";
import { useGetAreas } from "../../areas/hooks/useAreaQueries";
import { useGetGrades } from "../../administrar-niveles/hooks/useGradeQueries";

type ErrorBackendConDatos = {
  __row: number;
  datos: FilaCSVValida;
  errores: string[];
  camposConError: string[]; // Lista de campos que tienen error (ej: "full_name", "area_id")
};

export function useCSVRegistro() {
  const [parseadas, setParseadas] = useState<FilaCSVParseada[]>([]);
  const [erroresBackend, setErroresBackend] = useState<ErrorBackendConDatos[]>([]);
  const [csvNombre, setCsvNombre] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const importMutation = useImportOlympians();
  const { data: areas } = useGetAreas();
  const { data: grades } = useGetGrades();

  const totales = useMemo(() => ({
    validas: parseadas.length - erroresBackend.length,
    errores: erroresBackend.length
  }), [parseadas, erroresBackend]);

  const onCSVParseado = (rows: Record<string,string>[], nombreArchivo: string) => {
    const { validas } = validarCSVInscritos(rows);
    setParseadas(validas);
    setErroresBackend([]); // Limpiar errores del backend previo
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
      // Convertir todos los datos parseados a estructura del backend
      const validas: FilaCSVValida[] = parseadas.map((fila) => {
        // Buscar area_id por nombre
        const area = areas?.find((a) => a.name.toLowerCase() === fila.area?.toLowerCase());
        // Buscar grade_id por nombre
        const grade = grades?.find((g) => g.name.toLowerCase() === fila.grade?.toLowerCase());

        if (!area || !grade) {
          console.warn(`No se encontró área o grado para:`, fila);
        }

        return {
          olympian: {
            full_name: fila.full_name,
            identity_document: fila.identity_document,
            educational_institution: fila.educational_institution,
            department: fila.department,
            academic_tutor: fila.academic_tutor,
          },
          area_id: area?.id || 0,
          grade_id: grade?.id || 0,
          status: "pending",
        };
      });

      const payload = { data: validas };
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
        const erroresPorFila = new Map<number, { mensajes: string[], campos: string[] }>();

        Object.keys(errores).forEach(key => {
          const msgs = errores[key];
          if (Array.isArray(msgs)) {
            msgs.forEach(msg => {
              // Nuevo patrón: data.0.olympian.full_name o data.0.area_id
              const matchOlympian = key.match(/data\.(\d+)\.olympian\.(\w+)/);
              const matchDirect = key.match(/data\.(\d+)\.(\w+)/);

              let indice: number | null = null;
              let campo: string | null = null;

              if (matchOlympian) {
                indice = parseInt(matchOlympian[1]);
                campo = matchOlympian[2]; // full_name, identity_document, etc.
              } else if (matchDirect) {
                indice = parseInt(matchDirect[1]);
                campo = matchDirect[2]; // area_id, grade_id, status
              }

              if (indice !== null && campo !== null) {
                const fila = indice + 1; // +1 para convertir índice a número de fila (empezando en 1)

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
                    educational_institution: 'Unidad educativa',
                    department: 'Departamento',
                    area_id: 'Área',
                    grade_id: 'Grado',
                  };
                  mensajeAmigable = `El campo "${nombresCampos[campo] || campo}" es obligatorio`;
                }
                // Detectar máxima longitud
                else if (msg.includes('may not be greater than')) {
                  mensajeAmigable = 'El valor es demasiado largo';
                }

                if (!erroresPorFila.has(fila)) {
                  erroresPorFila.set(fila, { mensajes: [], campos: [] });
                }
                erroresPorFila.get(fila)!.mensajes.push(mensajeAmigable);
                erroresPorFila.get(fila)!.campos.push(campo);
              }
            });
          }
        });

        // Convertir a formato con datos completos
        const erroresFormateados: ErrorBackendConDatos[] = Array.from(erroresPorFila.entries()).map(([fila, errorInfo]) => {
          // Buscar los datos de la fila en parseadas
          const indiceFila = fila - 1; // Restar 1 para volver al índice del array (que empieza en 0)
          const parseada = parseadas[indiceFila];

          const datos: FilaCSVValida = {
            olympian: {
              full_name: parseada?.full_name || '',
              identity_document: parseada?.identity_document || '',
              educational_institution: parseada?.educational_institution || '',
              department: parseada?.department || '',
              academic_tutor: parseada?.academic_tutor,
            },
            area_id: 0,
            grade_id: 0,
          };

          return {
            __row: fila,
            datos,
            errores: errorInfo.mensajes,
            camposConError: errorInfo.campos,
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
    setParseadas([]);
    setErroresBackend([]);
    setCsvNombre("");
  };

  return {
    state: {
      validas: parseadas,
      errores: erroresBackend.map(e => ({ __row: e.__row, errores: e.errores })), // Convertir errores backend a formato de errores
      erroresBackend,
      csvNombre,
      totales,
      confirmOpen,
      toastText,
      loading
    },
    actions: { onCSVParseado, descargarPlantilla, confirmarImportacion, doImport, reiniciar, setToastText, setConfirmOpen },
  };
}
