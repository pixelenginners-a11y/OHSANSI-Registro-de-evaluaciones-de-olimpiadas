import {
  type FilaCSVValida,
  type FilaCSVConError,
  CAMPOS_PLANTILLA,
  DEPARTAMENTOS_DEFAULT,
  AREAS_DEFAULT,
  CATEGORIAS_NIVEL,
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

export type Catalogos = {
  departamentos?: string[];
  areas?: string[];
  niveles?: string[];
};

export function validarCSVInscritos(
  rows: Record<string, string>[],
  catalogos: Catalogos = {}
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

  const DEPTOS = (catalogos.departamentos ?? DEPARTAMENTOS_DEFAULT).map((d) => d.toLowerCase());
  const AREAS = (catalogos.areas ?? AREAS_DEFAULT).map((a) => a.toLowerCase());
  const NIVELES = (catalogos.niveles ?? CATEGORIAS_NIVEL).map((n) => n.toLowerCase());

  const seen = new Set<string>(); // CI|Area|Nivel

  rows.forEach((raw, idx) => {
    const rowNum = idx + 1;
    const errs: string[] = [];

    const data = {
      NombreCompleto: normalize(raw.NombreCompleto ?? ""),
      CI: normalize(raw.CI ?? ""),
      TutorContacto: normalize(raw.TutorContacto ?? ""),
      UnidadEducativa: normalize(raw.UnidadEducativa ?? ""),
      Departamento: normalize(raw.Departamento ?? ""),
      Grado: normalize(raw.Grado ?? ""),
      Area: normalize(raw.Area ?? ""),
      Nivel: normalize(raw.Nivel ?? ""),
      TutorAcademico: normalize(raw.TutorAcademico ?? ""),
    };

    // Reglas HU-01
    if (!nonEmpty(data.NombreCompleto)) errs.push("NombreCompleto vacío");
    if (!nonEmpty(data.CI)) errs.push("CI vacío");
    if (!nonEmpty(data.Area)) errs.push("Área vacía");
    if (!nonEmpty(data.Nivel)) errs.push("Nivel vacío");

    if (nonEmpty(data.Departamento) && !DEPTOS.includes(data.Departamento.toLowerCase())) {
      errs.push(`Departamento no válido: ${data.Departamento}`);
    }
    if (nonEmpty(data.Area) && !AREAS.includes(data.Area.toLowerCase())) {
      errs.push(`Área no válida: ${data.Area}`);
    }
    if (nonEmpty(data.Nivel) && !NIVELES.includes(data.Nivel.toLowerCase())) {
      errs.push(`Nivel no válido: ${data.Nivel}`);
    }

    if (nonEmpty(data.CI) && nonEmpty(data.Area) && nonEmpty(data.Nivel)) {
      const key = `${data.CI.toLowerCase()}|${data.Area.toLowerCase()}|${data.Nivel.toLowerCase()}`;
      if (seen.has(key)) errs.push("Duplicado (mismo CI + Área + Nivel)");
      else seen.add(key);
    }

    if (nonEmpty(data.TutorContacto)) {
      const digits = data.TutorContacto.replace(/\D/g, "");
      if (digits.length < 7) errs.push("TutorContacto inválido (muy corto)");
    }

    if (errs.length) errores.push({ __row: rowNum, errores: errs });
    else {
      validas.push({
        __row: rowNum,
        NombreCompleto: data.NombreCompleto!,
        CI: data.CI!,
        TutorContacto: data.TutorContacto!,
        UnidadEducativa: data.UnidadEducativa!,
        Departamento: data.Departamento!,
        Grado: data.Grado!,
        Area: data.Area!,
        Nivel: data.Nivel!,
        TutorAcademico: data.TutorAcademico || undefined,
      });
    }
  });

  return { validas, errores };
}

// Encabezados para descargar plantilla (lo usa el hook/página)
export const camposPlantilla = CAMPOS_PLANTILLA;
