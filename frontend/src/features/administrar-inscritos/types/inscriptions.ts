export interface Olympian {
  id: number;
  full_name: string;
  identity_document: string;
  educational_institution: string;
  department: string;
  academic_tutor: string;
}

export interface Area {
  id: number;
  name: string;
}

export interface Grade {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface Inscription {
  id: number;
  olympian_id: number;
  group_id: number | null;
  area_id: number;
  grade_id: number;
  status: "pending" | "approved" | "rejected" | "inscribed";
  created_at: string;
  updated_at: string;
  olympian: Olympian;
  area: Area;
  grade: Grade;
  group: Group | null;
}

export interface InscriptionsResponse {
  current_page: number;
  data: Inscription[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface InscriptionCreate {
  olympian: {
    full_name: string;
    identity_document: string;
    educational_institution: string;
    department: string;
    academic_tutor: string;
  };
  area_id: number;
  grade_id: number;
  status?: string;
  group_name?: string;
}

export interface InscriptionUpdate {
  olympian?: Partial<{
    full_name: string;
    identity_document: string;
    educational_institution: string;
    department: string;
    academic_tutor: string;
  }>;
  area_id?: number;
  grade_id?: number;
  group_id?: number | null;
  status?: "pending" | "approved" | "rejected" | "inscribed";
}

export interface InscriptionResponse {
  data: Inscription;
  message?: string;
}

export interface Column {
  key: keyof Inscription | keyof Olympian | 'area_name' | 'grade_name' | 'group_name';
  label: string;
}