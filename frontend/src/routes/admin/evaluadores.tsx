import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/evaluadores')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/evaluadores"!</div>
}
