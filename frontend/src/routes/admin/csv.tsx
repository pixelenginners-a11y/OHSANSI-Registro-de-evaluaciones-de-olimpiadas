import { createFileRoute } from '@tanstack/react-router'
import RegistroPage from '../../features/registro-csv/pages/RegistroPage'
import { withPhaseGuard } from '../../components/withPhaseGuard'

const RouteComponent = withPhaseGuard('cargar_csv')(function CsvRouteComponent() {
  return <RegistroPage />
});

export const Route = createFileRoute('/admin/csv')({
  component: RouteComponent,
})
