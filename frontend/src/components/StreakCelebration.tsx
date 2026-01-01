import { useLocation, useNavigate } from "react-router-dom";
import { ArrowForward } from "./Icons";
import { useEffect, useState } from "react";
import { animate } from "motion";

const StreakCelebration = () => {
    const location = useLocation()
    const { streak } = location.state || {}
    const [displayStreak, setDisplayStreak] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const controls = animate((streak - 1), streak, {
            duration: 1,
            ease: "easeInOut",
            onUpdate(latest) {
                setDisplayStreak(Math.floor(latest))
            }
        })
        return () => controls.stop()
    }, [streak])

    return (
        <div className="color-container" style={{backgroundColor: "white"}}>
            <div className="col center">
                <div className="col center-align" style={{marginTop: 250, gap: 15}}>
                    <h3 className="pixel-sans" style={{color: "var(--dark-grey-color)"}}>Your Streak Has Increased</h3>
                    <div className="circle-btn black">
                        <p className="pixel-sans" style={{fontSize: 32}}>{displayStreak}</p> 
                    </div>
                </div>
                
                <button className="btn-primary to-bottom" style={{marginBottom: 105}} onClick={() => navigate("/dashboard")}>
                    Continue
                    <ArrowForward color="white" width="24" height="24" />
                </button>
            </div>
        </div>
    )
}

export default StreakCelebration;