import { createFileRoute } from '@tanstack/react-router'
import RegistroPage from '../../features/registro-csv/pages/RegistroPage'

export const Route = createFileRoute('/admin/csv')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegistroPage />
}
