import { createFileRoute, Outlet } from '@tanstack/react-router'

import Sidebar from '../../components/Menu'
import { type IconName } from '../../lib/Icons'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {

  const items = [
    { text: "Cargar CSV", route: "/admin/csv", icon: "upload" },
    { text: "Administrar Niveles", route: "/admin/niveles", icon: "layers" },
    { text: "Administrar Areas", route: "/admin/areas", icon: "book-open" },
    { text: "Administrar Evaluadores", route: "/admin/evaluadores", icon: "userCog" },
    { text: "Administrar Responsables", route: "/admin/responsables", icon: "userCheck" },
    { text: "Administrar Inscritos", route: "/admin/inscritos", icon: "users" },
  ] satisfies { text: string; route: string; icon: IconName }[];

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar items={items} />
      <div className="flex-1 pt-20 lg:pt-0">
        <Outlet />
      </div>
    </div>
  )
}