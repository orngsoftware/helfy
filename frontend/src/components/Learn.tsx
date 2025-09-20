import { useNavigate } from "react-router-dom";


const Learn = ({ learnData, userCompleted }: {learnData: any, userCompleted: boolean}) => {
    const navigate = useNavigate()
    
    return (
        <div className="col center" style={{width: 320}}>
            <div className="card clickable learn" onClick={() => navigate("/learn?tldr=True")}>
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
