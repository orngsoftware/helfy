import { useNavigate } from "react-router-dom"
import { TickIcon } from "./Icons"

export function difficultyColor(difficulty: number): string {
        if (difficulty < 3) {
            return "var(--dark-green-color)"
        } else if (difficulty > 4) {
            return "var(--red-color)"
        } 
        return "var(--dark-yellow-color)"
}
const Tasks = ({ tasksData }: { tasksData: any}) => {
    const navigate = useNavigate()

    return (
        <div className="col center-align" style={{gap: 15, marginBottom: 100}}>
            {tasksData.length === 0 ? (
                <p className="sm-heading">No more tasks for today</p>
            ) : (
                tasksData.map((task: any) => (
                    <div className={task.delayed ? "card clickable task delayed" : "card clickable task"} onClick={() => navigate("/task", {state: task})}>
                        <div className="task-mark icon-row">
                            <TickIcon color="var(--black-color)" width="20" height="20" />
                            <p>{task.delayed ? "Delayed task" : "Task"}</p>
                        </div>
                        <p className="sm-heading right-text" style={{marginTop: 10}}>{task.name}</p>
                        <p style={{maxWidth: "70%"}} className="right-text">{task.description}</p>
                        <div className="row to-right">
                            <p className="sm-heading">+ {task.delayed ? task.delayed_xp : task.xp} xp</p>
                            <div className="icon-row">
                                <p className="sm-heading" style={{color: difficultyColor(task.difficulty)}}>{task.difficulty}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={difficultyColor(task.difficulty)} viewBox="0 0 256 256"><path d="M221.87,90.86a4,4,0,0,0-6.17-.62l-75.42,75.42A8,8,0,0,1,129,154.35l92.7-92.69a8,8,0,0,0-11.32-11.32L197,63.73A112.05,112.05,0,0,0,22.34,189.25,16.09,16.09,0,0,0,37.46,200H218.53a16,16,0,0,0,15.11-10.71,112.28,112.28,0,0,0-11.77-98.43ZM57.44,166.41a8,8,0,0,1-6.25,9.43,7.89,7.89,0,0,1-1.6.16,8,8,0,0,1-7.83-6.41A88.06,88.06,0,0,1,143.59,65.38a8,8,0,0,1-2.82,15.75,72.07,72.07,0,0,0-83.33,85.28Z"></path></svg>
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    )
}

export default Tasks;
