// ===== GERAL IMPORTS =====
import { useEffect, useState } from "react"
import { CheckLg } from "react-bootstrap-icons"

// ===== TYPE INTERFACE =====
interface Props {
    currentStep: number,
    stepsList: string[],
    totalSteps: number
}

// ===== MAIN COMPONENT =====
// ----- Component responsable for display the progress on new prototype modal creation ----
export default function StepTracker({ currentStep, stepsList, totalSteps } : Props)
{
    const [ current, setCurrent ] = useState(currentStep);

    useEffect(() => {
        setCurrent(currentStep);
    }, [currentStep])

    return(
        <>
            <div className="stepper-container d-flex justify-content-center">
                <div className="stepper d-flex flex-wrap justify-content-between align-items-center">

                {stepsList.map((item, i) => (
                    <div className="step-wrapper d-flex align-items-center" key={i}>

                    <div className="step d-flex flex-column align-items-center text-center">

                        {/* Círculo */}
                        <div
                        className={`step-circle 
                            ${i < current ? "completed" : ""}
                            ${i === current ? "active" : ""}
                            ${i > current ? "inactive" : ""}
                        `}
                        >
                        {i < current ? (
                            <CheckLg size={18} />
                        ) : (
                            <span>{i + 1}</span>
                        )}
                        </div>

                        {/* Label */}
                        <span className="step-label mt-2">
                        {item}
                        </span>
                    </div>

                    {/* Linha */}
                    {i < totalSteps - 1 && (
                        <div
                        className={`step-line ${
                            i < current ? "line-completed" : ""
                        }`}
                        />
                    )}
                    </div>
                ))}

                </div>
            </div>
        </>
    )
}