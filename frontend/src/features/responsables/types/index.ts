export type ID = string

export interface Area {
  id: ID
  nombre: string
}

export interface ResponsableInput {
  nombreCompleto: string
  ci: string
  email: string
  areaId: ID

 
  nombreUsuario?: string
  password?: string
  telefono?: string
}

export interface Responsable extends ResponsableInput {
  id: ID
  areaNombre?: string
  createdAt?: string
  updatedAt?: string
}
