import { useState } from "react";
import { Link } from "@tanstack/react-router";

import Icon from "./Icon";
import { type MenuItem } from "./Menu";

type SidebarItemProps = {
  item: MenuItem;
  open?: boolean;
  red?: boolean;
  onClick?: () => void;
  isChild?: boolean;
};

export const SidebarItem = ({ item, open, red, onClick, isChild }: SidebarItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.route && onClick) {
      onClick();
    }
  };

  const ButtonContent = () => (
    <button
      onClick={handleClick}
      className={`${red ? "text-red-500 hover:bg-red-50" : "hover:bg-gray-100"
        } ${isChild ? "pl-8" : ""} flex items-center gap-3 p-3 rounded-lg transition-colors w-full`}
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
                onClick={onClick}
                isChild={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.route) {
    return (
      <Link to={item.route} className="w-full">
        <ButtonContent />
      </Link>
    );
  }

  return <ButtonContent />;
};