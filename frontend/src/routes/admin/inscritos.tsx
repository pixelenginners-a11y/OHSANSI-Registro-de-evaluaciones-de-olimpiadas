import { createFileRoute } from '@tanstack/react-router'
import InscritosPage from '../../features/administrar-inscritos/pages/InscritosPage'

export const Route = createFileRoute('/admin/inscritos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InscritosPage />
}
