import { useState } from "react";

import { type IconName } from "../lib/Icons";
import { DesktopSideBar } from "./DesktopSideBar";
import { TopBarMobile } from "./TopBarMobile";

export type MenuItem = {
  icon: IconName;
  text: string;
  route?: string;
  children?: MenuItem[];
}

type MenuProps = {
  items: MenuItem[]
}

const Sidebar = ({ items }: MenuProps) => {
  const [open, setOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seleccion, setseleccion] = useState('');
  return (
    <>
      <TopBarMobile
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        itemRoutes={items}
        seleccion={seleccion}
        setseleccion={setseleccion}
      />
      <DesktopSideBar
        open={open}
        setOpen={setOpen}
        sideBarItems={items}
        seleccion={seleccion}
        setseleccion={setseleccion}
      />
    </>
  );
};

export default Sidebar;