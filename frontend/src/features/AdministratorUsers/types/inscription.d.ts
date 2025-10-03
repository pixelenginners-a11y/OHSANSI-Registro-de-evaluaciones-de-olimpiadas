export interface Olympian {
  id: number;
  full_name: string;
  identity_document: string;
  educational_institution: string;
  department?: string;
  academic_tutor?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Area {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  responsable_id?: number | null;
}

export interface Grade {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Inscription {
  id: number;
  olympian_id: number;
  area_id: number;
  grade_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  olympian: Olympian;
  area: Area;
  grade: Grade;
}

export type InscriptionListResponse = Inscription[];

export interface InscriptionResponse {
  id: number;
  olympian_id: number;
  area_id: number;
  grade_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  olympian: Olympian;
  area: Area;
  grade: Grade;
}
