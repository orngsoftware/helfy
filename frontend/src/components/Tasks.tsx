import { useNavigate } from "react-router-dom"
import { FlyingStar } from "./Icons"

export function difficultyColor(difficulty: number): string {
        if (difficulty < 3) {
            return "#c0d44bff"
        } else if (difficulty > 4) {
            return "var(--red-color)"
        } 
        return "var(--dark-yellow-color)"
}
const Tasks = ({ tasksData }: { tasksData: any}) => {
    const navigate = useNavigate()

    return (
            !tasksData ? (
                <div className="col center">
                    <p>No more tasks for today</p>
                </div>
            ) : (
                <div className="card clickable" onClick={() => navigate("/task", {state: tasksData})}>
                    <div className="row">
                        <p className="sm-heading">{tasksData.name}</p>
                        {tasksData.delayed && (
                            <div className="tag right-tag"><p>Delayed</p></div>
                        )}
                    </div>
                    
                    <p style={{marginBottom: 10}}>{tasksData.description}</p>
                    <div className="row">
                        <div className="icon-row w-bg w-outline" style={{borderColor: "var(--grey-color)"}}>
                            <FlyingStar height={16} />
                            <p className="pixel-sans">{tasksData.delayed ? tasksData.delayed_xp : tasksData.xp} XP</p>
                        </div>
                        <div className="icon-row w-bg w-outline" style={{borderColor: "var(--grey-color)"}}>
                            <p className="pixel-sans" style={{color: difficultyColor(tasksData.difficulty)}}>{tasksData.difficulty}</p>
                        </div>
                    </div>
                </div>
            )
    )
}

export default Tasks;
