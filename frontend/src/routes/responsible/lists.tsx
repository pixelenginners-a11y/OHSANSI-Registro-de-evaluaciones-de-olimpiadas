import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/responsible/lists')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/responsible/lists"!</div>
}
