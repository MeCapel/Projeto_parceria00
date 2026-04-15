// ===== GERAL IMPORTS =====
import React, { useState, useEffect } from "react";
import Header from './Header'
import Sidebar from './Sidebar'
import FloatingChat from "./FloatingChat";

// ===== INTERFACE TYPES ======
interface LayoutProps {
    children: React.ReactNode;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável por juntar o header e sidebar, recebe children -----
export default function Layout({ children }: LayoutProps)
{
    const [sidebarWidth, setSidebarWidth] = useState<number>(0);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <>
            <Sidebar 
                onWidthChange={(w) => setSidebarWidth(w)} 
                isMobile={isMobile}
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            <div 
                style={{ 
                    marginLeft: isMobile ? 0 : `${sidebarWidth}px`, 
                    paddingTop: '60px' 
                }}
            >
                <Header 
                    sidebarWidth={isMobile ? 0 : sidebarWidth}
                    isMobile={isMobile}
                    onMenuClick={() => setMenuOpen(true)}
                />
                {children}
            </div>

            <FloatingChat />
        </>
    )
}