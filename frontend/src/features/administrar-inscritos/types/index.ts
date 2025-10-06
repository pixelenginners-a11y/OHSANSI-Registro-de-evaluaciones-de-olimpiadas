export type Olympian = {
  id: number
  full_name: string
  identity_document: string
  educational_institution: string
  department: string
  academic_tutor?: string
}

export type OlympianCreate = {
  full_name: string
  identity_document: string
  educational_institution: string
  department: string
  academic_tutor?: string
}

export type OlympianUpdate = {
  full_name?: string
  identity_document?: string
  educational_institution?: string
  department?: string
  academic_tutor?: string
}

// Alias para compatibilidad con componentes existentes
export type Inscrito = Olympian
export type InscritoCreate = OlympianCreate
export type InscritoUpdate = OlympianUpdate
