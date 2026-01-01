import { useNavigate, useLocation } from "react-router-dom"
import TaskDescriptionRow from "../../components/TaskDescriptionRow"
import { TickIcon, RepeatIcon, ArrowBack } from "../../components/Icons"
import axiosInstance from "../../lib/apiClient"
import { useState } from "react"
import { SmallPopUp } from "../../components/PopUps"
import { AnimatePresence, motion } from "motion/react"

const HabitPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const habit = location.state
    const [isOpen, setOpen] = useState(false)
    const [showFlash, setShowFlash] = useState(false)

    async function completeHabit() {
        try {
            await axiosInstance.post(`/tasks/complete/${habit.id}`)
            navigate("/done/habit", {state: {xp: habit.xp * 2}})
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Task completition error: ", error)
            }
        }
    }

    async function incompleteHabit() {
        try {
            await axiosInstance.post(`/tasks/incomplete/${habit.id}`)
            navigate("/done/fail", {state: {xp: habit.xp}})
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Habit incomplete error: ", error)
            }
        }
    }

    async function unmarkHabit() {
        try {
            await axiosInstance.post(`/tasks/habits/unmark/${habit.id}`)
            setShowFlash(true)
            setTimeout(() => {
                navigate("/dashboard")
            }, 1000)
        } catch(error: any) {
            if (error.response?.status === 400) {
                setOpen(true)
            } else {
                console.error("Habit unmark error: ", error)
            }
        }
    }

    return (
        <>
            <div className="color-container" style={{backgroundColor: "var(--yellow-color)"}}>
                <div className="col">
                    <div className="clickable" style={{marginTop: 15}} onClick={() => navigate(-1)}>
                        <ArrowBack color="var(--black-color)" width="32" height="32" />
                    </div>
                    <TaskDescriptionRow task={habit} isHabit={true} />
                    <div className="row to-bottom" style={{gap: 15, justifyContent: "center", marginBottom: 130}}>
                        <button className="circle-btn" onClick={completeHabit} style={{backgroundColor: "var(--black-color)", height: 40, width: 40}}>
                            <TickIcon height="36" width="36" color="white" />
                        </button>
                        <button className="circle-btn" onClick={incompleteHabit} style={{backgroundColor: "var(--black-color)", height: 40, width: 40}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </button>
                        <button className="circle-btn" onClick={unmarkHabit} style={{backgroundColor: "var(--black-color)", height: 40, width: 40}}>
                            <RepeatIcon color="white" width="36" height="36"/>
                        </button>
                    </div>
                    {isOpen && <SmallPopUp title="You can't unmark this habit" 
                        subTitle="You must wait at least 7 days after habit creation to unmark it."
                        closePopUp={() => setOpen(false)} btnText="Okay" />}
                </div>
            </div>
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{ duration: 0.5, type: "spring"}}
                        className="flash-overlay"
                        style={{backgroundColor: "rgba(239, 239, 239, 0.5)", borderColor: "#EFEFEF"}}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default HabitPage