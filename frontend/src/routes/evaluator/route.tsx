import { createFileRoute } from '@tanstack/react-router'
import { type IconName } from '../../lib/Icons';
import { Outlet } from '@tanstack/react-router'
import Sidebar from '../../components/Menu'

export const Route = createFileRoute('/evaluator')({
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
    { text: "Evaluar Niveles", route: "/evaluator/evaluations", icon: "album" },
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
