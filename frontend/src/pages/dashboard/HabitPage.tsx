import { useNavigate, useLocation } from "react-router-dom"
import TaskDescriptionRow from "../../components/TaskDescriptionRow"
import Divider from "../../components/Divider"
import { TickIcon, RepeatIcon } from "../../components/Icons"
import axiosInstance from "../../lib/apiClient"
import { useState } from "react"
import { SmallPopUp } from "../../components/PopUps"

const HabitPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const habit = location.state
    const [isOpen, setOpen] = useState(false)

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
            navigate("/dashboard")
        } catch(error: any) {
            if (error.response?.status === 400) {
                setOpen(true)
            } else {
                console.error("Habit unmark error: ", error)
            }
        }
    }

    return (
        <div className="container" style={{backgroundColor: "var(--yellow-color)"}}>
            <div className="col">
                <TaskDescriptionRow task={habit} isHabit={true} />
                <Divider color="var(--dark-yellow-color)" />
                <div className="row" style={{marginTop: 25, gap: 15}}>
                    <div className="col center" style={{color: "var(--dark-green-color)"}}>
                        <p className="sm-heading">+ {habit.xp * 2} xp</p>
                        <div className="circle-btn" onClick={completeHabit}>
                            <TickIcon height="36" width="36" color="var(--dark-green-color)" />
                        </div>
                        <p>Complete</p>
                    </div>
                    <div className="col center" style={{color: "var(--red-color)"}}>
                        <p className="sm-heading">- {habit.xp} xp</p>
                        <div className="circle-btn" onClick={incompleteHabit} style={{backgroundColor: "var(--orange-color)"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="var(--red-color)" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </div>
                        <p>Incomplete</p>
                    </div>
                    <div className="col center" style={{color: "var(--dark-yellow-color)"}}>
                        <div className="circle-btn" onClick={unmarkHabit} 
                            style={{backgroundColor: "var(--yellow-color)", 
                                    border: "2px solid var(--dark-yellow-color)",
                                    marginTop: 30}}>
                            <RepeatIcon color="var(--dark-yellow-color)" width="36" height="36"/>
                        </div>
                        <p>Remove habit</p>
                    </div>
                </div>
                {isOpen && <SmallPopUp title="You can't unmark this habit" 
                    subTitle="You must wait at least 7 days after habit creation to unmark it."
                    closePopUp={() => setOpen(false)} btnText="Okay" />}
            </div>
        </div>
    )
}

export default HabitPage