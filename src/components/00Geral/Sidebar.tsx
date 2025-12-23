import { NavLink } from 'react-router'
import { useState, useRef, useLayoutEffect } from "react";
import { LayoutSidebar, LayoutSidebarReverse, HouseFill, CollectionFill } from 'react-bootstrap-icons'

interface SidebarProps {
    onWidthChange?: (width: number) => void;
}

export default function Sidebar({ onWidthChange } : SidebarProps)
{
    const [ isCollapsed, setIsCollapsed ] = useState(false); 
    // const [ isHovered, setIsHovered ] = useState(false); 

    const navRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
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
    }, [isCollapsed, onWidthChange]);

    const NavItem = ({ to, label, icon } : { to: string; label: string; icon: React.ReactNode; }) => (
    <li>
      <NavLink to={to} onClick={() => setIsCollapsed(false)}
        className={({ isActive }) =>
          `btn-custom d-flex gap-3 py-2 text-decoration-none align-items-start
          ${isActive ? "rounded-1 text-danger btn-custom-white shadow bg-danger-subtle" : "text-secondary"}`}
        >
        {icon}
        {isCollapsed && <span className="m-0 p-0">{label}</span>}
      </NavLink>
    </li>
    )

    const navItems = [
                      { to: '/home', label: 'Home', icon: <HouseFill size={25} /> },
                      { to: '/projects', label: 'Projects', icon: <CollectionFill size={25} /> },
                     ]

    return(
        <nav ref={navRef} className="position-fixed border-end border-secondary-subtle vh-100 d-flex flex-column" 
            style={{ transition: 'width 0.3s ease', width: isCollapsed ? '275px' : '100px'}}>

            <ul className="d-flex flex-column gap-3 px-3 list-unstyled py-0 m-0 grow">

                {/* Header Logo */}
                <div style={{ width: '100%', transition: 'all 0.5s ease' }} className={`d-flex align-items-center gap-4 pt-3
                    ${isCollapsed ? "justify-content-between" : "flex-column"}`}>

                    {!isCollapsed ? (
                        <button className="btn-custom text-secondary" onClick={() => setIsCollapsed(true)}
                        aria-label="Expand sidebar" title="Expand sidebar" style={{ height: '3rem' }}>
                            <LayoutSidebarReverse size={25} />
                        </button>
                    ) : (
                        <button className="btn-custom text-secondary" onClick={() => setIsCollapsed(false)}
                                aria-label="Collapse sidebar" title="Collapse sidebar">
                            <LayoutSidebar size={25} />
                        </button>
                    )}

                </div>

                {/* Navigation Items */}

                <div className={`d-flex flex-column gap-3 ${isCollapsed ? "p-0" : "align-items-center"}`}>

                    {navItems.map((item) => (
                        <div key={item.to} className="">
                            <NavItem to={item.to} label={item.label} icon={item.icon} />
                        </div>
                    ))}
                </div>

                {/* HR separator for compact sidebar */}
                <hr />
            </ul>
        </nav>
    )
}