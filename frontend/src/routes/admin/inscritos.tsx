import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/inscritos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/inscritos"!</div>
}
