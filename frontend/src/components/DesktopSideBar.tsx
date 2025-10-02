import { SidebarItem } from "./SideBarItem"
import { type IconName } from "../lib/Icons"
import Icon from "./Icon";

type SideBarItemProps = {
  icon: IconName;
  text: string;
  route: string;
}

type DesktopSideBarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarItems: SideBarItemProps[];
}

export const DesktopSideBar = ({ open, setOpen, sideBarItems }: DesktopSideBarProps) => {
  return (
    <div
      className={`${open ? "basis-1/5 min-w-[14rem]" : "basis-[4%] min-w-[3rem]"} 
        bg-white h-screen shadow-md flex-col justify-between transition-all duration-300 hidden lg:flex`}
    >
      <div>
        <div
          className={`${open ? "justify-between" : ""
            } flex items-center p-4 border-b`}
        >
          <div className={`${open ? "block" : "hidden"} font-bold text-lg`}>
            Oh! SanSi
            <p className="text-xs font-normal text-gray-500">
              Sistema de Olimpiadas
            </p>
          </div>
          <button onClick={() => setOpen(!open)}>
            <Icon name="menu" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-2">
          {sideBarItems.map((item, index) => (
            <SidebarItem
              key={index}
              iconName={item.icon}
              text={item.text}
              route={item.route}
              open={open}
            />
          ))}
        </nav>
      </div>
      <div>
        <SidebarItem
          iconName="logOut"
          text="Cerrar Sesión"
          route="/login"
          open={open}
          red={true}
        />
      </div>
    </div>
  )
}
