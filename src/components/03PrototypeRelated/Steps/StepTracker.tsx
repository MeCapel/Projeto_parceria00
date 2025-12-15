import { useEffect, useState } from "react"
import { CheckLg } from "react-bootstrap-icons"

interface Props {
    currentStep: number,
    stepsList: string[],
    totalSteps: number
}

export default function StepTracker({ currentStep, stepsList, totalSteps } : Props)
{
    const [ current, setCurrent ] = useState(currentStep);

    useEffect(() => {
        setCurrent(currentStep);
    }, [currentStep])

    return(
        <>
            <div className="d-flex align-items-center justify-content-center mb-3">

                {stepsList.map((item, i) => (
                    <div className="d-flex align-items-center justify-content-center" key={i}>
                    
                    <div className="d-flex flex-column gap-2 align-items-center justify-content-center" style={{ width: "3rem" }}>

                        {i == current && (
                            <div 
                                className="d-flex align-items-center justify-content-center rounded-circle" 
                                style={{ height: "50px", width: "50px", backgroundColor: "var(--white00)", border: "2px solid var(--gray00)" }}
                            >
                                <p className="fs-5 fw-bold mb-0">
                                    {i + 1}
                                </p>
                            </div>
                        )}

                        {i < current && (
                            <div 
                                style={{ height: "50px", width: "50px", backgroundColor: "var(--success00)" }}
                                className="d-flex align-items-center justify-content-center rounded-circle text-white" 
                            >
                                <CheckLg size={25}/>
                            </div>
                        )}

                        {i > current && (
                            <div 
                                style={{ height: "50px", width: "50px", backgroundColor: "var(--gray01)" }}
                                className="d-flex align-items-center justify-content-center rounded-circle" 
                            >
                                <p className="fs-5 fw-bold mb-0 text-white">
                                    {i + 1}
                                </p>
                            </div>
                        )}


                        <p className="text-center">
                            {item}
                        </p>
                    </div>
                        
                        {i < totalSteps - 1 && (
                            <div 
                                className="position-relative" 
                                style={{ width: "5rem", top: "-1.5rem", borderBottom: "1px solid var(--gray00)" }}
                            ></div>
                        )}
                    </div>
                ))}

                

            </div>
        </>
    )
}