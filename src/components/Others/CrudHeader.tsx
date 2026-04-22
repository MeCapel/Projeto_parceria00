import { PlusLg } from "react-bootstrap-icons";

interface Props {
    title: string,
    subtitle?: string,
    onNew?: () => void,
}

function normalizeTitle(title: string)
{
    const normalizedTitle = title.toLocaleLowerCase();
    if (normalizedTitle.endsWith('s')) return normalizedTitle.slice(0, -1);
}

export default function CrudHeader({ title, subtitle, onNew }: Props) {
    const normalizedTitle = normalizeTitle(title);
    
    return (
        <div className="d-flex flex-wrap align-items-center gap-3 justify-content-between mb-4">
            
            <div>
                <p className='mb-0 text-custom-red fs-5'>
                    {title}
                </p>
                {subtitle && (
                    <h1 className='mb-0 text-custom-black fw-bold'>
                        {subtitle}
                    </h1>
                )}
            </div>

            {onNew && (
                <button 
                    className='btn-custom btn-custom-outline-black d-flex gap-3 align-items-center'
                    onClick={onNew}
                >
                    <PlusLg size={18}/>
                    Novo {normalizedTitle}
                </button>
            )}

        </div>
    );
}