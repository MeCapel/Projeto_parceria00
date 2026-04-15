interface Props {
    title: string;
    subtitle?: string;
    onNew?: () => void;
}

export default function CrudHeader({ title, subtitle, onNew }: Props) {
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
                    className='btn-custom btn-custom-outline-black'
                    onClick={onNew}
                >
                    <p className='mb-0 p-1'>Novo</p>
                </button>
            )}

        </div>
    );
}