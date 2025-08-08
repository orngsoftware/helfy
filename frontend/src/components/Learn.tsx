import { useNavigate } from "react-router-dom";


const Learn = ({ learnData, userCompleted }: {learnData: any, userCompleted: boolean}) => {
    const navigate = useNavigate()
    
    return (
        <div>
            <div className="card clickable" style={{backgroundColor: "var(--blue-color)"}} 
                onClick={() => navigate("/learn?tldr=True")}>
                {!userCompleted ? <div className="circle"></div> : ""}
                <p className="sm-heading right-text" style={{marginTop: 10}}>{learnData.title}</p>
                <p style={{maxWidth: "90%"}} className="right-text">{learnData.tldr}</p>
                <div className="to-right">
                    <p className="sm-heading">+ {learnData.learning_xp} xp</p>
                </div>
            </div>
        </div>
    )
}

export default Learn;
