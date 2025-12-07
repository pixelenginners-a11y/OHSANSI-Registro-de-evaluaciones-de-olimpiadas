import { createFileRoute } from '@tanstack/react-router'
import FaseNoPermitida from '../../pages/FaseNoPermitida'

export const Route = createFileRoute('/public/fase-no-permitida')({
  component: FaseNoPermitida,
})
