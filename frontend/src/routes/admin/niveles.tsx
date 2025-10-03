import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/niveles')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/niveles"!</div>
}
