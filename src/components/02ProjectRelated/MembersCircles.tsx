import { PersonFill } from "react-bootstrap-icons";

interface MembersCirclesProps {
    membersList: {id: string | number, img?: string, name: string}[];
}

export default function MembersCircles({ membersList } : MembersCirclesProps)
{
    if (membersList.length <= 0) return null;

    const firstThree = membersList.slice(0, 3);
    const extraMembers = membersList.length - 3;

    return(
        <div className="d-flex align-items-center justify-content-center" style={{ marginLeft: '10px' }}>
            {firstThree.map((member, index) => (
                <div 
                    className="rounded-circle bg-white border border-danger shadow-sm d-flex align-items-center justify-content-center overflow-hidden" 
                    key={member.id} 
                    style={{ 
                        width: '40px', 
                        height: '40px', 
                        marginLeft: index === 0 ? '0px' : '-15px',
                        zIndex: 10 - index
                    }}
                    title={member.name}
                >
                    {member.img ? (
                        <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                        <PersonFill className="text-danger" size={20} />
                    )}
                </div>
            ))}
            
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
