import { SidebarItem } from "./SideBarItem";
import { type MenuItem } from "./Menu";
import Icon from "./Icon";

type DesktopSideBarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarItems: MenuItem[];
}

export const DesktopSideBar = ({ open, setOpen, sideBarItems }: DesktopSideBarProps) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); //borrar token
  };

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
              item={item}
              open={open}
            />
          ))}
        </nav>
      </div>
      <div>
        <SidebarItem
          item={{
            icon: "logOut",
            text: "Cerrar Sesión",
            route: "/public/public/login"
          }}
          open={open}
          red={true}
          onClick={() => { handleLogout }}
        />
      </div>
    </div>
  )
}