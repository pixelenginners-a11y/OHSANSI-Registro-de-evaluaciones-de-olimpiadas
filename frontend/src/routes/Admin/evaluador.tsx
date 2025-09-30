import { createFileRoute } from '@tanstack/react-router'
import EvaluadorPage from '../../features/evaluator/pages/evaluador'

export const Route = createFileRoute('/Admin/evaluador')({
  component: EvaluadorPage,
})
