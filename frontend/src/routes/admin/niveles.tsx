import { createFileRoute } from '@tanstack/react-router'
import NivelesPage from '../../features/administrar-niveles/pages/NivelesPage'
import { withPhaseGuard } from '../../components/withPhaseGuard'

const GuardedNiveles = withPhaseGuard('asignar_area_nivel')(NivelesPage);

export const Route = createFileRoute('/admin/niveles')({
  component: GuardedNiveles,
})
