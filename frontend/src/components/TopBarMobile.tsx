import React from 'react'

import { type IconName } from '../lib/Icons'
import { SidebarItem } from './SideBarItem'
import Icon from './Icon'

type SideBarItemProps = {
  icon: IconName,
  text: string;
  route: string;
}

type TopBarMobileProps = {
  mobileMenuOpen: boolean,
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  itemRoutes: SideBarItemProps[]
}

export const TopBarMobile = ({ mobileMenuOpen, setMobileMenuOpen, itemRoutes }: TopBarMobileProps) => {
  return (
    <div>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between p-4">
          <div className="font-bold text-lg">
            Oh! SanSi
            <p className="text-xs font-normal text-gray-500">
              Sistema de Olimpiadas
            </p>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <Icon name='x'></Icon>
            ) : (
              <Icon name='menu'></Icon>
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t bg-white">
            <nav className="flex flex-col gap-2 p-4">
              {itemRoutes.map((item, index) => (
                <SidebarItem
                  key={index}
                  route={item.route}
                  iconName={item.icon}
                  text={item.text}
                  open={true}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
              <div className="border-t pt-2 mt-2">
                <SidebarItem
                  text="Cerrar Sesión"
                  open={true}
                  route="/login"
                  iconName="logOut"
                  red={true}
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}