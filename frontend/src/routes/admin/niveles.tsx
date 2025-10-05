import { createFileRoute } from '@tanstack/react-router'
import NivelesPage from '../../features/administrar-niveles/pages/NivelesPage'

export const Route = createFileRoute('/admin/niveles')({
  component: NivelesPage,
})
