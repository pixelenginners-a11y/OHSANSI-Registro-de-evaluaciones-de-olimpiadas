import { create } from 'zustand';
import api from '../api/axios';

interface PhaseState {
  phase: string | null;
  name: string | null;
  loading: boolean;
  error: string | null;
  fetchPhase: () => Promise<void>;
  setPhase: (phase: string | null, name?: string | null) => void;
}

export const usePhaseStore = create<PhaseState>()((set) => ({
  phase: null,
  name: null,
  loading: false,
  error: null,
  setPhase: (phase, name = null) => set({ phase, name, loading: false, error: null }),
  fetchPhase: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/fase-actual');
      const data = res.data ?? {};
      set({ phase: data.phase ?? null, name: data.name ?? null, loading: false, error: null });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Error al obtener la fase';
      set({ loading: false, error: message });
    }
  },
}));
