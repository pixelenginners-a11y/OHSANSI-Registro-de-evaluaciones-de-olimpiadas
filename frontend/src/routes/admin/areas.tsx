import { createFileRoute } from '@tanstack/react-router'
import AreasManager from '../../features/areas/pages/AreasManager'

export const Route = createFileRoute('/admin/areas')({
  component: AreasManager,
})
