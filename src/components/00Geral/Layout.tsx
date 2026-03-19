// ===== GERAL IMPORTS =====
import React,{ useState } from "react";
import Header from './Header'
import Sidebar from './Sidebar'
import FloatingChat from "./FloatingChat";

// ===== TYPE INTERFACE =====
interface LayoutProps {
    children: React.ReactNode;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável por exibir a sidebar, recebe filhos (children) e os organiza no layout com a sidebar -----
export default function Layout({ children } : LayoutProps)
{
    const [ sidebarWidth, setSidebarWidth ] = useState<number>(0);

    return(
        <>
            <Sidebar onWidthChange={(w) => setSidebarWidth(w)}/>
            <div className="" style={{ marginLeft: `${sidebarWidth}px`, paddingTop: '60px' }}>
                <Header sidebarWidth={sidebarWidth}/>
                {children}
            </div>
            <FloatingChat />
        </>
    )
}
