import { PersonFill } from "react-bootstrap-icons";

// Interface flexível para aceitar qualquer um dos padrões
interface MembersCirclesProps {
    membersList: {
        id: string | number;
        image?: string; 
        img?: string;     // Aceita o antigo também
        username?: string;
        name?: string;    // Aceita o antigo também
    }[];
}

export default function MembersCircles({ membersList } : MembersCirclesProps)
{
    if (!membersList || membersList.length <= 0) return null;

    const firstThree = membersList.slice(0, 3);
    const extraMembers = membersList.length - 3;

    return(
        <div className="d-flex align-items-center justify-content-center" style={{ marginLeft: '10px' }}>
            {firstThree.map((member, index) => {
                // Prioriza os novos nomes, mas aceita os antigos se os novos forem undefined
                const displayImage = member.image || member.img;
                const displayName = member.username || member.name || "Membro";

                return (
                    <div 
                        className="rounded-circle bg-white border border-danger shadow-sm d-flex align-items-center justify-content-center overflow-hidden" 
                        key={member.id} 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            marginLeft: index === 0 ? '0px' : '-15px',
                            zIndex: 10 - index
                        }}
                        title={displayName}
                    >
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayName} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <PersonFill className="text-danger" size={20} />
                        )}
                    </div>
                );
            })}
            
            {extraMembers > 0 && (
                <div 
                    className="rounded-circle bg-light border border-danger shadow-sm d-flex align-items-center justify-content-center"
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        marginLeft: '-15px',
                        zIndex: 0
                    }}
                >
                    <p className="mb-0 fw-bold text-danger" style={{ fontSize: '0.75rem' }}>+{extraMembers}</p>
                </div>
            )}
        </div>
    )
}