// frontend/src/routes/areas.tsx

import { createFileRoute } from '@tanstack/react-router'
import AreasManager from '../components/areas/AreasManager'

export const Route = createFileRoute('/areas')({
  component: () => <AreasManager />,
})