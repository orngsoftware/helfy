import { useNavigate } from "react-router-dom"
import { difficultyColor } from "./Tasks"

const Habits = ({ habitsData }: { habitsData: any}) => {
    const navigate = useNavigate()

    return (
            !habitsData ? (
                <div className="col center">
                    <p>No more habits for today</p>
                </div>
            ) : (
                <div className="card clickable" style={{border: "2px solid var(--yellow-color)"}} onClick={() => navigate("/habit", {state: habitsData})}>
                    <div className="row">
                        <p className="sm-heading">{habitsData.name}</p>
                        <div className="tag right-tag" style={{backgroundColor: "var(--yellow-color)", color: "var(--dark-yellow-color)"}}><p>Streak: {habitsData.streak}</p></div>
                    </div>
                    
                    <p style={{marginBottom: 10}}>{habitsData.description}</p>
                    <div className="row">
                        <div className="icon-row w-bg w-outline" style={{borderColor: "var(--grey-color)"}}>
                            <img src="/assets/icons/flyingstar.png" style={{height: 16}} />
                            <p className="pixel-sans">{habitsData.xp * 2} XP</p>
                        </div>
                        <div className="icon-row w-bg w-outline" style={{borderColor: "var(--grey-color)"}}>
                            <p className="pixel-sans" style={{color: difficultyColor(habitsData.difficulty)}}>{habitsData.difficulty}</p>
                        </div>
                    </div>
                </div>
                )
    )
}

export default Habits;