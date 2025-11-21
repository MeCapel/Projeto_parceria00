interface MembersCirclesProps {
    membersList: {id: number, img: string, name: string}[];
}

export default function MembersCircles({ membersList } : MembersCirclesProps)
{
    if (membersList.length <= 0) return null;

    const firstThree = membersList.slice(0, 3);

    const extraMembers = membersList.length - 3;

    return(

        /* --- 🔴 Inner content div --- */
        <div className="container-fluid d-flex align-items-center justify-content-center" 
            style={{ maxWidth: 'calc(18rem - 5rem)'}}>
            {firstThree.map((member) => (

                /* --- 🔵 Img content div --- */
                <div className="container d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle left-less" 
                    key={member.id} style={{ width: '50px', height: '50px', overflow: 'hidden' }}>
                        <img src={member.img} alt={member.name} className="img-fluid" 
                            style={{ width: '100%', height: '100%' }}/>
                </div>
            ))}
            {extraMembers > 0 && (

                /* --- 🔵 More members content div --- */
                <div className="text-custom-black">
                    <p className="mb-0 position-absolute translate-middle">+{extraMembers}</p>
                </div>
            )}
        </div>
    )
}