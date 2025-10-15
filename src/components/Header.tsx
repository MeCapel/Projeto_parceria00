// Header.tsx
import React, { useState } from "react";
import Notifications from "./Notifications";
import AccountSettings from "./AccountSettings";

interface HeaderProps {
  headerRef: React.RefObject<HTMLDivElement | null>;
  hidden?: boolean; // NEW: when true do not render the header
}

export default function Header({ headerRef, hidden = false }: HeaderProps) {
  const [openComponent, setOpenComponent] = useState<string | null>(null);

  if (hidden) {
    // Option A: do not render header at all while hidden
    return null;
  }

  const notificationsList = [{id: 1, imgUrl: '/vite.svg', title: 'Username#1', subtitle: 2, description: 'Descrição'},
                             {id: 2, imgUrl: '/vite.svg', title: 'Projeto#1', subtitle: 5, description: 'Descrição'},
                             {id: 3, imgUrl: '/vite.svg', title: 'Username#2', subtitle: 3, description: 'Descrição'},
                             {id: 4, imgUrl: '/vite.svg', title: 'Username#3', subtitle: 14, description: 'Descrição'},
                             {id: 5, imgUrl: '/vite.svg', title: 'Projeto#2', subtitle: 20, description: 'Descrição'},
  ]

  return (
    <header
      ref={headerRef}
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100 }}
      className="navbar navbar-light bg-light text-custom-black px-3 p-0 px-md-5 border"
    >
      <img height={30} src="/fromBrand/logo-baldan.png" alt="Logotipo da marca" />
      <div className="d-flex align-items-center py-2 gap-1 ms-auto">
        <Notifications
          notificationsList={notificationsList}
          isOpen={openComponent === "notifications"}
          onOpen={() => setOpenComponent("notifications")}
          onClose={() => setOpenComponent(null)}
        />
        <AccountSettings
          isOpen={openComponent === "account"}
          onOpen={() => setOpenComponent("account")}
          onClose={() => setOpenComponent(null)}
          accountInfos={{ id: 1, img: "/vite.svg", name: "Maria", email: "meccapelani@gmail.com" }}
        />
      </div>
    </header>
  );
}
