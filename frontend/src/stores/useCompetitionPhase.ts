import { create } from 'zustand'

export type Phase = {
  phase: string
  active: boolean
  startedAt?: string | null
}

type State = {
  phases: Record<string, Phase>
  loading: boolean
  error?: string | null
  fetchPhases: () => Promise<void>
  activatePhase: (phase: string) => Promise<{ success: boolean; message?: string }>
  deactivatePhase: (phase: string) => Promise<{ success: boolean; message?: string }>
  getActivePhase: () => Phase | null
}

export const useCompetitionPhaseStore = create<State>((set, get) => ({
  phases: {},
  loading: false,
  error: null,

  fetchPhases: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/admin/competition/phases', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      // data.phases expected as object keyed by phase
      set({ phases: data.phases || {}, loading: false })
    } catch (err: any) {
      set({ error: err.message || 'Error fetching phases', loading: false })
    }
  },

  activatePhase: async (phase: string) => {
    try {
      const res = await fetch(`/api/admin/competition/phases/${encodeURIComponent(phase)}/activate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (res.ok && json.success) {
        await get().fetchPhases()
      }
      return { success: json.success ?? res.ok, message: json.message }
    } catch (err: any) {
      return { success: false, message: err.message }
    }
  },

  deactivatePhase: async (phase: string) => {
    try {
      const res = await fetch(`/api/admin/competition/phases/${encodeURIComponent(phase)}/deactivate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (res.ok && json.success) {
        await get().fetchPhases()
      }
      return { success: json.success ?? res.ok, message: json.message }
    } catch (err: any) {
      return { success: false, message: err.message }
    }
  },

  getActivePhase: () => {
    const phases = Object.values(get().phases)
    const active = phases.find((p) => p.active)
    return active ?? null
  },
}))
