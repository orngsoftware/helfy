import { useLocation, useNavigate } from "react-router-dom"
import { RepeatIcon, TickIcon, ArrowBack } from "../../components/Icons"
import axiosInstance from "../../lib/apiClient"
import TaskDescriptionRow from "../../components/TaskDescriptionRow"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const TaskPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const task = location.state
    const [showFlash, setShowFlash] = useState(false)

    async function completeTask() {
        try {
            await axiosInstance.post(`/tasks/complete/${task.id}`)
            navigate("/done/task", {state: {xp: task.delayed ? task.delayed_xp : task.xp}})
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Task completition error: ", error)
            }
        }
    }

    async function incompleteTask() {
        try {
            await axiosInstance.post(`/tasks/incomplete/${task.id}`)
            navigate("/done/fail", {state: {xp: task.xp}})
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Task incomplete error: ", error)
            }
        }
    }

    async function markAsHabit() {
        try {
            await axiosInstance.post(`/tasks/habits/mark/${task.id}`)
            setShowFlash(true)
            setTimeout(() => {
                navigate("/dashboard")
            }, 1000)
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Habit creation error: ", error)
            }
        }
    }

    return (
        <>
            <div className="color-container" style={{backgroundColor: "white"}}>
                <div className="col">
                    <div className="clickable" style={{marginTop: 15}} onClick={() => navigate(-1)}>
                        <ArrowBack color="var(--black-color)" width="32" height="32" />
                    </div>
                    <TaskDescriptionRow task={task} />
                    <div className="row to-bottom" style={{gap: 15, justifyContent: "center", marginBottom: 130}}>
                        <button className="circle-btn" onClick={completeTask} style={{backgroundColor: "var(--black-color)", height: 40, width: 40}}>
                            <TickIcon height="36" width="36" color="white" />
                        </button>
                        <button className="circle-btn" onClick={incompleteTask} style={{backgroundColor: "var(--black-color)", height: 40, width: 40}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </button>
                        <button className="circle-btn" onClick={markAsHabit} style={{backgroundColor: "var(--black-color)", height: 40, width: 40}}>
                            <RepeatIcon color="white" width="36" height="36"/>
                        </button>
                    </div>
                    {/* <div className="icon-row to-bottom" style={{marginBottom: 105}}>
                        <svg style={{marginBottom: 50}} xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="var(--dark-yellow-color)" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
                        <p style={{color: "var(--dark-yellow-color)", maxWidth: 270}}>When you make a task a habit you will be doing it everyday and receive twice more XP</p>
                    </div> */}
                </div>
            </div>
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{ duration: 0.8, type: "spring"}}
                        className="flash-overlay"
                    />
                )}
            </AnimatePresence>
        </>
    )
}

export default TaskPage;