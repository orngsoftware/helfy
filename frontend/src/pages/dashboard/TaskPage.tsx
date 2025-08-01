import { useLocation, useNavigate } from "react-router-dom"
import Divider from "../../components/Divider"
import { difficultyColor } from "../../components/Tasks"
import { RepeatIcon, TickIcon } from "../../components/Icons"
import axiosInstance from "../../lib/apiClient"

const TaskPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const task = location.state

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
            navigate("/dashboard")
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Habit creation error: ", error)
            }
        }
    }

    return (
        <div className="container" style={{backgroundColor: "white"}}>
            <div className="col">
                <div className="arrow-back" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                </div>
                <h2>{task.name}</h2>
                <p className="right-text">{task.description}</p>
                <div className="row" style={{margin: "15px 0px"}}>
                    <div className="outline-box">
                        <div className="icon-row">
                            <TickIcon color="var(--black-color)" width="20" height="20" />
                            <p className="sm-heading">Task</p>
                        </div>
                    </div>
                    <div className="outline-box" style={{borderColor: difficultyColor(task.difficulty), color: difficultyColor(task.difficulty)}}>
                        <div className="icon-row">
                            <p className="sm-heading">{task.difficulty}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={difficultyColor(task.difficulty)} viewBox="0 0 256 256"><path d="M221.87,90.86a4,4,0,0,0-6.17-.62l-75.42,75.42A8,8,0,0,1,129,154.35l92.7-92.69a8,8,0,0,0-11.32-11.32L197,63.73A112.05,112.05,0,0,0,22.34,189.25,16.09,16.09,0,0,0,37.46,200H218.53a16,16,0,0,0,15.11-10.71,112.28,112.28,0,0,0-11.77-98.43ZM57.44,166.41a8,8,0,0,1-6.25,9.43,7.89,7.89,0,0,1-1.6.16,8,8,0,0,1-7.83-6.41A88.06,88.06,0,0,1,143.59,65.38a8,8,0,0,1-2.82,15.75,72.07,72.07,0,0,0-83.33,85.28Z"></path></svg>
                        </div>
                    </div>
                    <div className="outline-box">
                        <p className="sm-heading">+ {task.delayed ? task.delayed_xp : task.xp} xp</p>
                    </div>
                </div>
                <Divider color="var(--dark-grey-color)" />
                <div className="row" style={{marginTop: 25, gap: 15}}>
                    <div className="col center" style={{color: "var(--dark-green-color)"}}>
                        <p className="sm-heading">+ {task.delayed ? task.delayed_xp : task.xp} xp</p>
                        <div className="circle-btn" onClick={completeTask}>
                            <TickIcon height="36" width="36" color="var(--dark-green-color)" />
                        </div>
                        <p>Complete</p>
                    </div>
                    <div className="col center" style={{color: "var(--red-color)"}}>
                        <p className="sm-heading">- {task.xp} xp</p>
                        <div className="circle-btn" onClick={incompleteTask} style={{backgroundColor: "var(--orange-color)"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="var(--red-color)" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                        </div>
                        <p>Incomplete</p>
                    </div>
                    <div className="col center" style={{color: "var(--dark-yellow-color)"}}>
                        <p className="sm-heading">x2 xp</p>
                        <div className="circle-btn" onClick={markAsHabit} style={{backgroundColor: "var(--yellow-color)"}}>
                            <RepeatIcon color="var(--dark-yellow-color)" width="36" height="36"/>
                        </div>
                        <p>Make habit</p>
                    </div>
                </div>
                <div className="icon-row to-bottom">
                    <svg style={{marginBottom: 50}} xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="var(--dark-yellow-color)" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"></path></svg>
                    <p style={{color: "var(--dark-yellow-color)", maxWidth: 270}}>When you make a task a habit you will be doing it everyday and receive twice more XP</p>
                </div>
            </div>
        </div>
    )
}

export default TaskPage;