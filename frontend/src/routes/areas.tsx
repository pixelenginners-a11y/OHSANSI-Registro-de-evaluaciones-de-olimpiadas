// frontend/src/routes/areas.tsx

import { createFileRoute } from '@tanstack/react-router'
import AreasManager from '../features/evaluator/areas/pages/AreasManager'

export const Route = createFileRoute('/areas')({
  component: () => <AreasManager />,
})