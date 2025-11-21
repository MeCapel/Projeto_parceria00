import React,{ useState } from "react";

import Header from './Header'
import Sidebar from './Sidebar'

interface LayoutProps {
    children: React.ReactNode;
}

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
        </>
    )
}
