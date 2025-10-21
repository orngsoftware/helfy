import { FlyingStar } from "./Icons"
import { difficultyColor } from "./Tasks"

const TaskDescriptionRow = (props: any) => {
    const { task, isHabit } = props

    const xp = isHabit ? (task.xp * 2) : task.xp

    return (
        <div style={{margin: "20px 0px 0px 15px"}}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <div className="row" style={{margin: "15px 0px"}}>
                <div className="pill-container">
                    <div className="icon-row">
                        <FlyingStar height={20} />
                        <p className="pixel-sans">+ {task.delayed ? task.delayed_xp : xp} XP</p>
                    </div>
                </div>
                <div className="pill-container" style={{backgroundColor: difficultyColor(task.difficulty)}}>
                    <p className="pixel-sans">{task.difficulty}/5</p>
                </div>
            </div>
        </div>
    )
}

export default TaskDescriptionRow