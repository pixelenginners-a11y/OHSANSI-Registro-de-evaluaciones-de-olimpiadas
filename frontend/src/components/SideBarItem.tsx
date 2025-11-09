import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import Icon from "./Icon";
import { type MenuItem } from "./Menu";

type SidebarItemProps = {
  item: MenuItem;
  open?: boolean;
  red?: boolean;
  onClick?: () => void;
  isChild?: boolean;
  seleccion?: string;
  setseleccion: React.Dispatch<React.SetStateAction<string>>;
};

export const SidebarItem = ({ item, open, red, onClick, isChild, seleccion, setseleccion }: SidebarItemProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.route) {
      navigate({ to: item.route});
      setseleccion(item.text)
    }
  };

  const ButtonContent = () => (
    <button
      onClick={handleClick}
      className={`${red ? "text-red-500 hover:bg-red-50" : "hover:bg-gray-100"
        } ${isChild ? "pl-8" : ""
        } ${seleccion === item.text ? "bg-blue-100 font-semibold text-blue-700 border-l-4 border-blue-500" : ""
        } flex items-center gap-3 p-3 rounded-lg transition-colors w-full`}
    >
      <Icon name={item.icon} />
      <span className={`${open ? "block" : "hidden"} text-sm font-medium flex-1 text-left`}>
        {item.text}
      </span>
      {hasChildren && open && (
        <Icon name={isExpanded ? "chevron-up" : "chevron-down"} />
      )}
    </button>
  );

  if (hasChildren) {
    return (
      <div>
        <ButtonContent />
        {isExpanded && open && (
          <div className="flex flex-col gap-1 mt-1">
            {item.children!.map((child, index) => (
              <SidebarItem
                key={index}
                item={child}
                open={open}
                isChild={true}
                seleccion={seleccion}
                setseleccion={setseleccion}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.route) {
    return (
      <ButtonContent />
    );
  }

  return <ButtonContent />;
};