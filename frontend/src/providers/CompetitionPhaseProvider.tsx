import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useCompetitionPhaseStore } from '../stores/useCompetitionPhase'

type Props = { children: ReactNode }

export default function CompetitionPhaseProvider({ children }: Props) {
  const fetchPhases = useCompetitionPhaseStore((s) => s.fetchPhases)

  useEffect(() => {
    fetchPhases()
  }, [fetchPhases])

  return <>{children}</>
}
