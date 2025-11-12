import { useState } from "react";
// import Notifications from "./Notifications";
import AccountSettings from "./AccountSettings";

// const notificationsList = [{id: 1, imgUrl: '/vite.svg', title: 'Username#1', subtitle: 2, description: 'Descrição'},
//                            {id: 2, imgUrl: '/vite.svg', title: 'Projeto#1', subtitle: 5, description: 'Descrição'},
//                            {id: 3, imgUrl: '/vite.svg', title: 'Username#2', subtitle: 3, description: 'Descrição'},
//                            {id: 4, imgUrl: '/vite.svg', title: 'Username#3', subtitle: 14, description: 'Descrição'},
//                            {id: 5, imgUrl: '/vite.svg', title: 'Projeto#2', subtitle: 20, description: 'Descrição'},
// ]

interface HeaderProps {
  sidebarWidth: number;
  hidden?: boolean;
}

export default function Header({ sidebarWidth, hidden = false }: HeaderProps) {
  const [openComponent, setOpenComponent] = useState<string | null>(null);

  if (hidden) return null;


  return (
    <header
      style={{ position: "fixed", top: 0, left: `${sidebarWidth}px`, right: 0 , zIndex: 1100 }}
      className="showOrHide navbar navbar-light bg-white text-custom-black px-3 p-0 px-md-5 border-bottom"
    >
      <img height={30} src="/fromBrand/baldan-principal.png" alt="Logotipo da marca" />
      <div className="d-flex align-items-center py-2 gap-1 ms-auto">
        {/* <Notifications
          notificationsList={notificationsList}
          isOpen={openComponent === "notifications"}
          onOpen={() => setOpenComponent("notifications")}
          onClose={() => setOpenComponent(null)}
        /> */}

        <AccountSettings
          isOpen={openComponent === "account"}
          onOpen={() => setOpenComponent("account")}
          onClose={() => setOpenComponent(null)}
        />
        
      </div>
    </header>
  );
}
