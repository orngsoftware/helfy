import { useLocation, useNavigate } from "react-router-dom"
import { ArrowForward } from "./Icons"
import { useEffect, useState } from "react"
import { animate, motion } from "motion/react"
import axiosInstance from "../lib/apiClient"

const Done = (props: any) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { xp } = location.state || {}
    const [displayXP, setDisplayXP] = useState(0)
    const [randomMessage, setRandomMesasge] = useState("")
    const messages = ["Done", "Good job!", "YEAAAH!", "Amazing", "strong", "You are so healthy...", "Just look at it", "Perfect", "completed."]
    const badMessages = ["Oh no", "Perfection isn't the goal...", "sad, but not bad", "GOOD JOB :|", "you lost some xp..."]
    

    function countXp() {
        const controls = animate(0, xp, {
            duration: 1,
            ease: "easeInOut",
            onUpdate(latest) {
                setDisplayXP(Math.floor(latest))
            }
        })
        return () => controls.stop()
    }

    function chooseMessage() {
        if (props.doneType === "fail") {
            setRandomMesasge(badMessages[Math.floor(Math.random() * badMessages.length)])
        } else {
            setRandomMesasge(messages[Math.floor(Math.random() * messages.length)])
        }
    }

    async function updateStreak() {
        // data from here gets passed to StreakCelebration
        try {
            const streakResponse = await axiosInstance.post("/users/stats/streak/update")
            if (streakResponse.data.result.celebrate) {
                navigate("/streak-celebration", {state: {streak: streakResponse.data.result.streak}})
                return;
            } else {
                navigate("/dashboard")
                return;
            }
        } catch(error: any) {
            console.error("Error updating streak: ")
        }
    }

    useEffect(() => {
        countXp()
        chooseMessage()
    }, [xp])

    return (
        <div className="color-container" style={{backgroundColor: props.doneType === "fail" ? "var(--orange-color)" : "white"}}>
            <div className="col center">
                <motion.div 
                    initial={{scale: 3}}
                    animate={{
                        scale: 1, 
                        transition: {duration: 0.5, type: "spring", stiffness: 300, damping: 20}
                    }}
                    className="circle-btn black" style={{marginTop: 250}}>
                    <p className="pixel-sans" style={{margin: 0}}>XP</p>
                    <p className="pixel-sans" style={{fontSize: 32}}>{props.doneType === "fail" ? `- ${xp}` : `+ ${displayXP}`}</p>
                </motion.div>
                <h2 style={{marginTop: 25}}>{randomMessage}</h2>
                <button className="btn-primary to-bottom" style={{marginBottom: 105}} onClick={updateStreak}>
                    Continue
                    <ArrowForward color="white" width="24" height="24" />
                </button>
            </div>
        </div>
    )

}

export default Done