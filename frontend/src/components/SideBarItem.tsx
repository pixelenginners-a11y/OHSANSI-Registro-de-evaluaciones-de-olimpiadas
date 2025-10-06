import { Link } from "@tanstack/react-router";

import Icon from "./Icon";
import { type IconName } from "../lib/Icons";

type SidebarItemProps = {
  iconName: IconName;
  text: string;
  route?: string;
  open?: boolean;
  red?: boolean;
  onClick?: () => void;
};

export const SidebarItem = ({ iconName, text, open, red, route, onClick }: SidebarItemProps) => {
  return (
    <Link to={route} className="w-full">
      <button
        onClick={onClick}
        className={`${red ? "text-red-500 hover:bg-red-50" : "hover:bg-gray-100"
          } flex items-center gap-3 p-3 rounded-lg transition-colors w-full`}
      >
        <Icon name={iconName} />
        <span className={`${open ? "block" : "hidden"} text-sm font-medium`}>
          {text}
        </span>
      </button>
    </Link>
  );
};
