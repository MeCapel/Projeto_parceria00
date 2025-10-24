import type React from "react"
import { useState } from "react";
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layuot({ children } : LayoutProps)
{
    const [ sidebarWidth, setSidebarWidth ] = useState<number>(0);

    return(
        <>
            <Sidebar onWidthChange={(w) => setSidebarWidth(w)}/>
            <div className="" style={{ marginLeft: `${sidebarWidth}px`, paddingTop: '60px' }}>
                <Header sidebarWidth={sidebarWidth}/>
                {children}
            </div>
        </>
    )
}
