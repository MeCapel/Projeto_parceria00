// ===== GERAL IMPORTS =====
import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

// ===== TYPE INTERFACE =====
interface TooltipProps {
    text: string;
    top: string | number;
    children: React.ReactElement;
}

// ===== MAIN COMPONENT =====
// ----- Componente responsável exibir uma pequena tooltip (modal de descrição) acima do item em questão -----
export default function Tooltip({ text, top, children } : TooltipProps)
{
    const [ isVisible, setIsVisible ] = useState(false);

    return(
        <div style={{ display: 'inline-block', position: 'relative' }}>
            <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
                {children}   
            </div>
            {isVisible && 
                createPortal(
                    <div style={{ position: 'absolute', backgroundColor: 'var(--red02)', color: 'var(--white00)', zIndex: '1000',
                         padding: '4px 8px', borderRadius: '5px', top: top, left: '85px', whiteSpace: 'nowrap' }}>
                        {text}
                    </div>
                    ,document.body 
                )
            }
        </div>
    )
}