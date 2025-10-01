

export type FilaCSVValida = {
  __row: number; // 1-based (sin header)
  NombreCompleto: string;
  CI: string;
  TutorContacto: string;
  UnidadEducativa: string;
  Departamento: string;
  Grado: string;
  Area: string;
  Nivel: string;
  TutorAcademico?: string; // opcional
};

export type FilaCSVConError = {
  __row: number;
  errores: string[];
};

// Encabezados oficiales (HU-01 / pliego)
export const CAMPOS_PLANTILLA = [
  "NombreCompleto",
  "CI",
  "TutorContacto",
  "UnidadEducativa",
  "Departamento",
  "Grado",
  "Area",
  "Nivel",
  "TutorAcademico", // opcional en contenido, pero parte del header
] as const;

export type CampoPlantilla = (typeof CAMPOS_PLANTILLA)[number];

// Catálogos por defecto (si no pasas desde backend)
export const DEPARTAMENTOS_DEFAULT = [
  "Chuquisaca","La Paz","Cochabamba","Oruro","Potosí","Tarija","Santa Cruz","Beni","Pando",
];

export const AREAS_DEFAULT = [
  "Matemática","Física","Química","Informática","Biología","Astronomía","Robótica","Ciencias de la Tierra",
];

export const NIVELES_DEFAULT = [
  { categoria: "Primaria", ejemplos: ["3ro", "4to", "5to", "6to"] },
  { categoria: "Secundaria", ejemplos: ["1ro", "2do", "3ro", "4to", "5to", "6to"] },
];
export const CATEGORIAS_NIVEL = NIVELES_DEFAULT.map(n => n.categoria);