// ===== GERAL IMPORTS =====
import { useState } from "react";
import { Link } from "react-router";
import { List } from "react-bootstrap-icons";
import AccountSettings from "../01LoginRelated/AccountSettings";

// ===== TYPE INTERFACE =====
interface HeaderProps {
  sidebarWidth: number;
  hidden?: boolean;
  isMobile?: boolean;
  onMenuClick?: () => void;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável pelo header que é exibido pelo app -----
export default function Header({ sidebarWidth, hidden = false, isMobile, onMenuClick }: HeaderProps) {
  const [openComponent, setOpenComponent] = useState<string | null>(null);

  if (hidden) return null;

  return (
   <header
    style={{ position: "fixed", top: 0, left: `${sidebarWidth}px`, right: 0 , zIndex: 5 }}
    className="header-main navbar navbar-light bg-white px-3 p-0 px-md-5 border-bottom border-secondary-subtle"
  >
      
       <div className="d-flex align-items-center gap-2">

    {isMobile && (
      <button className="btn-custom" onClick={onMenuClick}>
        <List size={25} />
      </button>
    )}

    {/* ÚNICA LOGO */}
    <Link to={"/home"}>
      <img height={30} src="/fromBrand/baldan-principal.png" alt="Logotipo da marca" />
    </Link>

  </div>

      <div className="header-actions d-flex align-items-center py-2 gap-2 ms-auto">

        <AccountSettings
          isOpen={openComponent === "account"}
          onOpen={() => setOpenComponent("account")}
          onClose={() => setOpenComponent(null)}
        />
        
      </div>
    </header>
  );
}