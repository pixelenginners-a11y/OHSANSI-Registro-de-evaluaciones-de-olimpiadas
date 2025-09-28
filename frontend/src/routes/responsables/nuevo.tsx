import { createFileRoute } from '@tanstack/react-router'
import ResponsableNewPage from '../../features/responsables/pages/ResponsableNewPage'

export const Route = createFileRoute('/responsables/nuevo')({
  component: () => <ResponsableNewPage />,
})
