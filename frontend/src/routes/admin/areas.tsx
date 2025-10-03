import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/areas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/areas"!</div>
}
