import { createFileRoute } from '@tanstack/react-router'
import RegistroPage from '../../features/registro-csv/pages/RegistroPage' 

export const Route = createFileRoute('/concursantes/registro')({
  component: RegistroPage,
})
