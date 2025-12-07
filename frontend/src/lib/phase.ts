export type Functionality =
  | 'registrar_inscrito'
  | 'asignar_area_nivel'
  | 'cargar_csv'
  | 'registrar_evaluadores'
  | 'registrar_responsables'
  | 'generar_lista_inscritos'
  | 'registrar_notas'
  | 'clasificar'
  | 'generar_listas_clasificatorias'
  | 'preparar_entorno_final'
  | 'registrar_notas_finales'
  | 'generar_ganadores'
  | 'generar_certificados'
  | 'premiacion'
  | 'medallero';

const allowedByPhase: Record<string, Set<Functionality>> = {
  inscripcion: new Set([
    'registrar_inscrito',
    'asignar_area_nivel',
    'cargar_csv',
    'registrar_evaluadores',
    'registrar_responsables',
    'generar_lista_inscritos',
  ]),
  clasificacion: new Set([
    'registrar_notas',
    'clasificar',
    'generar_listas_clasificatorias',
    'preparar_entorno_final',
  ]),
  final: new Set([
    'registrar_notas_finales',
    'generar_ganadores',
    'generar_certificados',
    'premiacion',
    'medallero',
  ]),
};

export function phaseName(phase: string | null | undefined) {
  if (!phase) return null;
  const lower = phase.toLowerCase();
  if (lower === 'inscripcion') return 'Inscripcion';
  if (lower === 'clasificacion') return 'Clasificatoria';
  if (lower === 'final') return 'Final';
  return phase;
}

/**
 * Determina si la funcionalidad esta permitida para la fase dada.
 * Devuelve { allowed, message }
 */
export function checkPhaseAllowed(funcionalidad: Functionality, faseActual: string | null | undefined) {
  if (!faseActual) {
    return {
      allowed: false,
      message: `La funcionalidad ${funcionalidad} no esta disponible en la fase actual (sin fase activa).`,
    };
  }

  const key = faseActual.toLowerCase();
  const allowedSet = allowedByPhase[key] ?? new Set();
  const allowed = allowedSet.has(funcionalidad);
  if (!allowed) {
    const name = phaseName(faseActual) ?? faseActual;
    return {
      allowed: false,
      message: `La funcionalidad ${funcionalidad} no esta disponible en la fase actual (${name}).`,
    };
  }

  return { allowed: true };
}
