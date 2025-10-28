import {
  type FilaCSVParseada,
  type FilaCSVConError,
  CAMPOS_PLANTILLA,
  MAPEO_CAMPOS,
} from "../types/inscritos";

// Utils
const normalize = (s: string) => s?.trim();

// CSV parser (simple, con comillas básicas)
export function parseCSVText(text: string): Record<string, string>[] {
  const lines = text.replace(/\r/g, "").split("\n").filter(Boolean);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    return obj;
  });
}
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

export function validarCSVInscritos(
  rows: Record<string, string>[]
): { validas: FilaCSVParseada[]; errores: FilaCSVConError[] } {
  const errores: FilaCSVConError[] = [];
  const validas: FilaCSVParseada[] = [];

  // Solo parsear los datos, sin validaciones
  rows.forEach((raw, idx) => {
    const rowNum = idx + 1;

    const data = {
      full_name: normalize(raw.nombre_completo ?? ""),
      identity_document: normalize(raw.documento_identidad ?? ""),
      educational_institution: normalize(raw.unidad_educativa ?? ""),
      department: normalize(raw.departamento ?? ""),
      academic_tutor: normalize(raw.tutor_academico ?? ""),
      area: normalize(raw.area ?? ""),
      grade: normalize(raw.grado ?? ""),
    };

    // Agregar todas las filas parseadas sin validar
    validas.push({
      __row: rowNum,
      full_name: data.full_name,
      identity_document: data.identity_document,
      educational_institution: data.educational_institution,
      department: data.department,
      academic_tutor: data.academic_tutor || undefined,
      area: data.area,
      grade: data.grade,
    });
  });

  return { validas, errores };
}

// Encabezados para descargar plantilla (lo usa el hook/página)
export const camposPlantilla = CAMPOS_PLANTILLA;
