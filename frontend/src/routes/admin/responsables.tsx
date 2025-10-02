import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/responsables')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/responsables"!</div>
}
