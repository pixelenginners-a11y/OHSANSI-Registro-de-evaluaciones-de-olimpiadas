import { createFileRoute } from '@tanstack/react-router'
import { Competition } from '../../features/competition/pages/Competition'

export const Route = createFileRoute('/responsible/competition')({
  component: Competition,
})
