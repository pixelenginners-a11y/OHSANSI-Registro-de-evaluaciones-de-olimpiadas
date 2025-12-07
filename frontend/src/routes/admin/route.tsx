import { createFileRoute, Outlet } from '@tanstack/react-router'

import Sidebar from '../../components/Menu'
import { type IconName } from '../../lib/Icons'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

export type MenuItem = {
  text: string;
  route?: string;
  icon: IconName;
  children?: MenuItem[];
}

function RouteComponent() {
  const items: MenuItem[] = [
    { text: "Cargar CSV", route: "/admin/csv", icon: "upload" },
    {
      text: "Administrar",
      icon: "settings",
      children: [
        { text: "Competencia", route: "/admin/competition", icon: "trophy" },
        { text: "Niveles", route: "/admin/niveles", icon: "layers" },
        { text: "Áreas", route: "/admin/areas", icon: "book-open" },
        { text: "Evaluadores", route: "/admin/evaluadores", icon: "userCog" },
        { text: "Responsables", route: "/admin/responsables", icon: "userCheck" },
        { text: "Inscritos", route: "/admin/inscritos", icon: "users" },
      ]
    },
    { text: "Generar Listas", route: "/admin/lists", icon: "album" },
    {
      text: "Reportes",
      icon: "activity",
      children: [
        { text: "Logs", route: "/admin/logs", icon: "clipboard-list" },
      ]
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar items={items} />
      <div className="flex-1 pt-20 lg:pt-0">
        <Outlet />
      </div>
    </div>
  )
}
