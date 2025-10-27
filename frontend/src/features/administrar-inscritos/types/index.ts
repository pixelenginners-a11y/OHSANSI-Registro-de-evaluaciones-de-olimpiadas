export type Olympian = {
  id: number
  olympian_id: number
  area_id: number
  grade_id: number
  status: string
  created_at: string
  updated_at: string
  olympian: {
    id: number
    full_name: string
    identity_document: string
    educational_institution: string
    department: string
    academic_tutor: string
  }
  area: {
    id: number
    name: string
  }
  grade: {
    id: number
    name: string
  }
}

export type OlympianCreate = {
  full_name: string
  identity_document: string
  legal_guardian_contact: string
  educational_institution: string
  department: string
  school_grade: string
  academic_tutor?: string
}

export type OlympianUpdate = {
  area_id?: number
  grade_id?: number
  status?: 'pending' | 'approved' | 'rejected'
  olympian?: {
    full_name?: string
    identity_document?: string
    educational_institution?: string
    department?: string
    academic_tutor?: string
  }
}

// Alias para compatibilidad con componentes existentes
export type Inscrito = Olympian
export type InscritoCreate = OlympianCreate
export type InscritoUpdate = OlympianUpdate
