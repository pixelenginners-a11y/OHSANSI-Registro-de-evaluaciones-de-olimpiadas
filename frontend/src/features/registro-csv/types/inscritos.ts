

export type FilaCSVValida = {
  full_name: string;
  identity_document: string;
  legal_guardian_contact: string;
  educational_institution: string;
  department: string;
  school_grade: string;
  academic_tutor?: string;
};

export type FilaCSVConError = {
  __row: number;
  errores: string[];
};

export const CAMPOS_PLANTILLA = [
  "full_name",
  "identity_document",
  "legal_guardian_contact",
  "educational_institution",
  "department",
  "school_grade",
  "academic_tutor",
] as const;

export type CampoPlantilla = (typeof CAMPOS_PLANTILLA)[number];

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