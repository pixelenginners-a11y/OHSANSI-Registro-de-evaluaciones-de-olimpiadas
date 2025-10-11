import { useState } from "react";

import { type IconName } from "../lib/Icons";
import { DesktopSideBar } from "./DesktopSideBar";
import { TopBarMobile } from "./TopBarMobile";

type SideBarItemProps = {
  icon: IconName,
  text: string;
  route: string;
}

type MenuProps = {
  items: SideBarItemProps[]
}

const Sidebar = ({ items }: MenuProps) => {
  const [open, setOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <TopBarMobile
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        itemRoutes={items}
      />
      <DesktopSideBar
        open={open}
        setOpen={setOpen}
        sideBarItems={items}
      />
    </>
  );
};

export default Sidebar;