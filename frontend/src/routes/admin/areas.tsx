import { createFileRoute } from '@tanstack/react-router'
import AreasManager from '../../features/areas/pages/AreasManager'
import { withPhaseGuard } from '../../components/withPhaseGuard'

const GuardedAreas = withPhaseGuard('asignar_area_nivel')(AreasManager);

export const Route = createFileRoute('/admin/areas')({
  component: GuardedAreas,
})
