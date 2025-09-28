// src/features/responsables/services/responsables.service.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from '../../../api/axios'
import type { Area, ID, Responsable, ResponsableInput } from '../types'

const RESPONSABLES_KEY = ['responsables']
const AREAS_KEY = ['areas']



// Catálogo estático de fallback
const STATIC_AREAS: Area[] = [
  { id: 'matematicas', nombre: 'Matemáticas' },
  { id: 'fisica', nombre: 'Física' },
  { id: 'quimica', nombre: 'Química' },
  { id: 'biologia', nombre: 'Biología' },
  { id: 'historia', nombre: 'Historia' },
  { id: 'literatura', nombre: 'Literatura' },
  { id: 'informatica', nombre: 'Informática' },
  { id: 'robotica', nombre: 'Robótica' },
]

export function useAreas() {
  return useQuery({
    queryKey: AREAS_KEY,
    queryFn: async () => {
      try {
        const { data } = await axios.get<Area[]>('/areas')
        if (Array.isArray(data) && data.length > 0) {
          return data
        }
        return STATIC_AREAS
      } catch (err) {
        return STATIC_AREAS
      }
    },
    initialData: STATIC_AREAS, // para que el select no se vea vacío
  })
}


export function useResponsables(q?: string) {
  return useQuery({
    queryKey: [...RESPONSABLES_KEY, q ?? ''],
    queryFn: async () => {
      const { data } = await axios.get<Responsable[]>('/responsables', { params: { q } })
      return data
    },
  })
}

export function useResponsable(id: ID) {
  return useQuery({
    queryKey: [...RESPONSABLES_KEY, id],
    queryFn: async () => {
      const { data } = await axios.get<Responsable>(`/responsables/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateResponsable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ResponsableInput) => {
      const { data } = await axios.post<Responsable>('/responsables', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESPONSABLES_KEY })
    },
  })
}

export function useUpdateResponsable(id: ID) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ResponsableInput) => {
      const { data } = await axios.put<Responsable>(`/responsables/${id}`, payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESPONSABLES_KEY })
    },
  })
}

export function useDeleteResponsable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: ID) => {
      await axios.delete(`/responsables/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RESPONSABLES_KEY })
    },
  })
}
