import { createFileRoute } from '@tanstack/react-router'
import ResponsablesPage from '../../features/responsables/pages/ResponsablesPage'

export const Route = createFileRoute('/responsables/')({
  component: () => <ResponsablesPage />,
})
