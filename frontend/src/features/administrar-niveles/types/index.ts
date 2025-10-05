export type Nivel = {
  id: number
  name: string
  description?: string
  active: boolean
}

export type NivelCreate = {
  name: string
  description?: string
  active?: boolean
}

export type NivelUpdate = {
  name?: string
  description?: string
  active?: boolean
}
