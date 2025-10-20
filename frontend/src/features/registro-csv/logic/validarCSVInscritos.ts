import {
  type FilaCSVValida,
  type FilaCSVConError,
  CAMPOS_PLANTILLA,
} from "../types/inscritos";

// Utils
const normalize = (s: string) => s?.trim();
const nonEmpty = (s?: string | null) => !!(s && s.trim().length > 0);

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
): { validas: FilaCSVValida[]; errores: FilaCSVConError[] } {
  const errores: FilaCSVConError[] = [];
  const validas: FilaCSVValida[] = [];

  const header = Object.keys(rows[0] ?? {});
  const faltantes = (CAMPOS_PLANTILLA as readonly string[]).filter((h) => !header.includes(h));
  const extra = header.filter((h) => !(CAMPOS_PLANTILLA as readonly string[]).includes(h));
  if (faltantes.length || extra.length) {
    errores.push({
      __row: 0,
      errores: [
        ...(faltantes.length ? [`Encabezados faltantes: ${faltantes.join(", ")}`] : []),
        ...(extra.length ? [`Encabezados desconocidos: ${extra.join(", ")}`] : []),
      ],
    });
  }

  const seen = new Set<string>(); // CI|Area|Nivel

  rows.forEach((raw, idx) => {
    const rowNum = idx + 1;
    const errs: string[] = [];

    const data = {
      full_name: normalize(raw.full_name ?? ""),
      identity_document: normalize(raw.identity_document ?? ""),
      educational_institution: normalize(raw.educational_institution ?? ""),
      department: normalize(raw.department ?? ""),
      academic_tutor: normalize(raw.academic_tutor ?? ""),
    };

    // Reglas de validación
    if (!nonEmpty(data.full_name)) errs.push("full_name vacío");
    if (!nonEmpty(data.identity_document)) errs.push("identity_document vacío");
    if (!nonEmpty(data.educational_institution)) errs.push("educational_institution vacío");
    if (!nonEmpty(data.department)) errs.push("department vacío");

    // Validar duplicados por identity_document
    if (nonEmpty(data.identity_document)) {
      const key = data.identity_document.toLowerCase();
      if (seen.has(key)) errs.push("Duplicado (mismo identity_document)");
      else seen.add(key);
    }

    if (errs.length) errores.push({ __row: rowNum, errores: errs });
    else {
      validas.push({
        full_name: data.full_name!,
        identity_document: data.identity_document!,
        educational_institution: data.educational_institution!,
        department: data.department!,
        academic_tutor: data.academic_tutor || undefined,
      });
    }
  });

  return { validas, errores };
}

// Encabezados para descargar plantilla (lo usa el hook/página)
export const camposPlantilla = CAMPOS_PLANTILLA;
