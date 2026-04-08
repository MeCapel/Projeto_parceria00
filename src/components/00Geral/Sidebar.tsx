import { NavLink } from 'react-router'
import { useState, useRef, useLayoutEffect } from "react";
import { LayoutSidebar, LayoutSidebarReverse, HouseFill, CollectionFill, PeopleFill } from 'react-bootstrap-icons'

interface SidebarProps {
    onWidthChange?: (width: number) => void;
    isMobile?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ onWidthChange, isMobile, isOpen, onClose }: SidebarProps)
{
    const [isCollapsed, setIsCollapsed] = useState(false); 
    const navRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        if (isMobile) return;

        const navElement = navRef.current;
        if (!navElement) return;

        const reportWidth = () => {
            const rect = navElement.getBoundingClientRect();
            onWidthChange?.(Math.round(rect.width));
        };

        reportWidth();

        const ro = new ResizeObserver(() => {
            reportWidth();
        });

        ro.observe(navElement);

        return () => ro.disconnect();
    }, [isCollapsed, onWidthChange, isMobile]);

    const NavItem = ({ to, label, icon } : { to: string; label: string; icon: React.ReactNode; }) => (
    <li>
      <NavLink to={to} onClick={() => onClose?.()}
        className={({ isActive }) =>
          `btn-custom d-flex gap-3 py-2 text-decoration-none align-items-start
          ${isActive ? "rounded-1 text-danger btn-custom-white shadow bg-danger-subtle" : "text-secondary"}`}
        >
        {icon}
        {(isCollapsed || isMobile) && <span>{label}</span>}
      </NavLink>
    </li>
    )

    const navItems = [
                      { to: '/home', label: 'Home', icon: <HouseFill size={25} /> },
                      { to: '/projects', label: 'Projects', icon: <CollectionFill size={25} /> },
                      { to: '/clientes', label: 'Clientes', icon: <PeopleFill size={25} /> }, 
                     ];

    // 🔥 MOBILE (OVERLAY)
    if (isMobile) {
        return (
            <>
                {isOpen && (
                    <div 
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.4)",
                            zIndex: 4
                        }}
                    />
                )}

                <nav
                    style={{
                        position: "fixed",
                        top: 0,
                        left: isOpen ? 0 : "-300px",
                        width: "250px",
                        height: "100%",
                        background: "white",
                        transition: "0.3s",
                        zIndex: 5,
                        padding: "1rem"
                    }}
                >
                    <ul className="d-flex flex-column gap-3 list-unstyled">

                        <button 
                            className="btn-custom mb-3"
                            onClick={onClose}
                        >
                            Fechar
                        </button>

                        {navItems.map((item) => (
                            <NavItem key={item.to} {...item} />
                        ))}
                    </ul>
                </nav>
            </>
        )
    }

    // 💻 DESKTOP NORMAL
    return(
        <nav ref={navRef} className="position-fixed border-end vh-100 d-flex flex-column"
            style={{ transition: 'width 0.3s', width: isCollapsed ? '275px' : '100px'}}>

            <ul className="d-flex flex-column gap-3 px-3 list-unstyled">

                <div className={`d-flex pt-3 ${isCollapsed ? "justify-content-between" : "flex-column"}`}>
                    <button className="btn-custom text-secondary" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <LayoutSidebar /> : <LayoutSidebarReverse />}
                    </button>
                </div>

                <div className={`d-flex flex-column gap-3 ${isCollapsed ? "" : "align-items-center"}`}>
                    {navItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                    ))}
                </div>

                <hr />
            </ul>
        </nav>
    )
}