import { useEffect } from 'react';
import { usePhaseStore } from '../stores/phaseStore';
import { checkPhaseAllowed } from '../lib/phase';
import type { Functionality } from '../lib/phase';

export function usePhaseGuard(funcionalidad: Functionality) {
  const { phase, name, loading, error, fetchPhase } = usePhaseStore();

  useEffect(() => {
    if (phase === null && !loading && !error) {
      void fetchPhase();
    }
  }, [phase, loading, error, fetchPhase]);

  const result = checkPhaseAllowed(funcionalidad, phase);

  return {
    allowed: result.allowed,
    message: result.allowed ? undefined : result.message,
    loading,
    phase,
    phaseName: name,
    error,
  };
}
