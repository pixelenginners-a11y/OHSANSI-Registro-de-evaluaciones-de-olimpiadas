export type Olympian = {
  id: number
  full_name: string
  identity_document: string
  educational_institution: string
  department: string
  academic_tutor?: string
}

export type Area = {
  id: number
  name: string
}

export type Grade = {
  id: number
  name: string
}

export type Inscrito = {
  id: number
  olympian_id: number
  area_id: number
  grade_id: number
  status: string
  olympian: Olympian
  area: Area
  grade: Grade
}

export type InscritoCreate = {
  olympian: {
    full_name: string
    identity_document: string
    educational_institution: string
    department: string
    academic_tutor?: string
  }
  area_id: number
  grade_id: number
  status?: string
}

export type InscritoUpdate = {
  olympian?: {
    full_name?: string
    identity_document?: string
    educational_institution?: string
    department?: string
    academic_tutor?: string
  }
  area_id?: number
  grade_id?: number
  status?: string
}
