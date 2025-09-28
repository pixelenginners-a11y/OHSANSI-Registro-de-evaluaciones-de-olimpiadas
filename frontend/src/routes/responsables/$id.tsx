import { createFileRoute } from '@tanstack/react-router'
import ResponsableEditPage from '../../features/responsables/pages/ResponsableEditPage'

export const Route = createFileRoute('/responsables/$id')({
  component: () => <ResponsableEditPage />,
})
