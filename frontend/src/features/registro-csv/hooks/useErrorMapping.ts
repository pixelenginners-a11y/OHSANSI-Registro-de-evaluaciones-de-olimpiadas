import { useMemo } from "react";
import { type FilaCSVConError } from "../types/inscritos";

export const FIELD_NAMES: Record<string, string> = {
  full_name: 'Nombre completo',
  identity_document: 'Documento de identidad',
  educational_institution: 'Unidad educativa',
  department: 'Departamento',
  academic_tutor: 'Tutor académico',
  area: 'Área',
  grade: 'Grado',
  group_name: 'Grupo',
};

export type ErrorInfo = {
  camposConError: Set<string>;
  mensajes: string[];
};

export function useErrorMapping(errores: FilaCSVConError[]) {
  const erroresPorFila = useMemo(() => {
    const mapa = new Map<number, ErrorInfo>();

    errores.forEach((error) => {
      const camposConError = new Set<string>();

      error.errores.forEach((msg) => {
        const msgLower = msg.toLowerCase();

        if (msgLower.includes('full_name') || msgLower.includes('nombre completo')) {
          camposConError.add('full_name');
        }
        if (msgLower.includes('identity_document') || msgLower.includes('documento')) {
          camposConError.add('identity_document');
        }
        if (msgLower.includes('educational_institution') || msgLower.includes('unidad educativa')) {
          camposConError.add('educational_institution');
        }
        if (msgLower.includes('department') || msgLower.includes('departamento')) {
          camposConError.add('department');
        }
        if (msgLower.includes('academic_tutor') || msgLower.includes('tutor')) {
          camposConError.add('academic_tutor');
        }
        if (msgLower.includes('area') || msgLower.includes('área')) {
          camposConError.add('area');
        }
        if (msgLower.includes('grade') || msgLower.includes('grado')) {
          camposConError.add('grade');
        }
        if (msgLower.includes('grop_name') || msgLower.includes('grupo')) {
          camposConError.add('group_name');
        }
      });

      mapa.set(error.__row, {
        camposConError,
        mensajes: error.errores,
      });
    });

    return mapa;
  }, [errores]);

  const getMensajesError = (fila: number, campo: string): string[] => {
    const errorInfo = erroresPorFila.get(fila);
    if (!errorInfo || !errorInfo.camposConError.has(campo)) return [];

    const mensajesRelacionados = errorInfo.mensajes.filter(msg => {
      const msgLower = msg.toLowerCase();
      if (msgLower.includes(campo.toLowerCase())) return true;
      const nombreAmigable = FIELD_NAMES[campo]?.toLowerCase();
      if (nombreAmigable && msgLower.includes(nombreAmigable)) return true;
      return false;
    });

    return mensajesRelacionados.length > 0 ? mensajesRelacionados : errorInfo.mensajes;
  };

  const hasFieldError = (fila: number, campo: string): boolean => {
    const errorInfo = erroresPorFila.get(fila);
    return errorInfo ? errorInfo.camposConError.has(campo) : false;
  };

  return {
    erroresPorFila,
    getMensajesError,
    hasFieldError,
  };
}
