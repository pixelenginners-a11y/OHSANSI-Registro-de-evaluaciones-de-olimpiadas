import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/csv')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/cargar-Csv"!</div>
}
