import * as Papa from "papaparse";

export function parseCSVText(text: string): Record<string, string>[] {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

export const camposPlantilla = [
  "NombreCompleto",
  "CI",
  "TutorContacto",
  "UnidadEducativa",
  "Departamento",
  "Grado",
  "Area",
  "Nivel",
  "TutorAcademico", // opcional, permitido
] as const;

export type FilaCSVValida = {
  NombreCompleto: string;
  CI: string;
  TutorContacto: string;
  UnidadEducativa: string;
  Departamento: string;
  Grado: string;
  Area: string;
  Nivel: string;
  TutorAcademico?: string;
  __row: number;
};

export type FilaCSVConError = {
  __row: number;
  errores: string[];
  raw: Record<string, string>;
};

const departamentosBO = [
  "La Paz",
  "Cochabamba",
  "Santa Cruz",
  "Oruro",
  "Potosí",
  "Tarija",
  "Chuquisaca",
  "Beni",
  "Pando",
];

export function validarCSVInscritos(rows: Record<string, string>[]) {
  const errores: FilaCSVConError[] = [];
  const validas: FilaCSVValida[] = [];

  // Encabezados exactos
  const headerOk = rows.every((r) => camposPlantilla.every((c) => c in r));
  if (!headerOk) {
    rows.forEach((r, idx) =>
      errores.push({
        __row: idx + 2,
        raw: r,
        errores: ["Encabezados inválidos: use la plantilla oficial (Descargar plantilla)"],
      })
    );
    return { validas, errores };
  }

  const areasValidas = [
    "Matemáticas",
    "Física",
    "Química",
    "Biología",
    "Robótica",
    "Historia",
    "Literatura",
    "Informática",
  ];
  const nivelesValidos = [
    "3ro Primaria",
    "4to Primaria",
    "5to Primaria",
    "6to Primaria",
    "1ro Secundaria",
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria",
  ];

  const seen = new Set<string>(); // CI+Area+Nivel

  rows.forEach((r, idx) => {
    const rowNum = idx + 2;
    const errs: string[] = [];

    ["NombreCompleto", "CI", "Area", "Nivel", "Departamento", "UnidadEducativa", "Grado"].forEach(
      (c) => {
        if (!(r[c] ?? "").trim()) errs.push(`Campo obligatorio faltante: ${c}`);
      }
    );

    if (r.Departamento && !departamentosBO.includes(r.Departamento))
      errs.push("Departamento inexistente");

    if (r.Area && !areasValidas.includes(r.Area)) errs.push("Área no válida");
    if (r.Nivel && !nivelesValidos.includes(r.Nivel)) errs.push("Nivel no válido");

    const key = `${(r.CI || "").toUpperCase()}|${r.Area}|${r.Nivel}`;
    if (seen.has(key)) errs.push("Duplicado (misma persona, misma área y nivel)");
    else seen.add(key);

    if (errs.length) {
      errores.push({ __row: rowNum, errores: errs, raw: r });
    } else {
      validas.push({
        NombreCompleto: r.NombreCompleto,
        CI: r.CI,
        TutorContacto: r.TutorContacto ?? "",
        UnidadEducativa: r.UnidadEducativa,
        Departamento: r.Departamento,
        Grado: r.Grado,
        Area: r.Area,
        Nivel: r.Nivel,
        TutorAcademico: r.TutorAcademico,
        __row: rowNum,
      });
    }
  });

  return { validas, errores };
}
