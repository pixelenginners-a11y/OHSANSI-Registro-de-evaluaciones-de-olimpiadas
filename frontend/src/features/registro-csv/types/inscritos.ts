// Tipo para los datos parseados del CSV (intermedio)
export type FilaCSVParseada = {
  __row?: number; // Número de fila en el CSV original
  full_name: string;
  identity_document: string;
  educational_institution: string;
  department: string;
  academic_tutor?: string;
  area?: string;
  grade?: string;
};

// Tipo para los datos validados listos para el backend
export type FilaCSVValida = {
  olympian: {
    full_name: string;
    identity_document: string;
    educational_institution: string;
    department: string;
    academic_tutor?: string;
  };
  area_id: number;
  grade_id: number;
  status?: string;
};

export type FilaCSVConError = {
  __row: number;
  errores: string[];
};

export const CAMPOS_PLANTILLA = [
  "nombre_completo",
  "documento_identidad",
  "unidad_educativa",
  "departamento",
  "tutor_academico",
  "area",
  "grado",
] as const;

export type CampoPlantilla = (typeof CAMPOS_PLANTILLA)[number];

// Mapeo de campos en español (CSV) a campos en inglés (parseado)
export const MAPEO_CAMPOS: Record<string, keyof FilaCSVParseada> = {
  "nombre_completo": "full_name",
  "documento_identidad": "identity_document",
  "unidad_educativa": "educational_institution",
  "departamento": "department",
  "tutor_academico": "academic_tutor",
  "area": "area",
  "grado": "grade",
};

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