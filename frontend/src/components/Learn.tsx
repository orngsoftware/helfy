import { useNavigate } from "react-router-dom";

const Learn = ({ learnData, userCompleted }: {learnData: any, userCompleted: boolean}) => {
    const navigate = useNavigate()
    
    return (
        <div className="col center-align">
            <div className="card clickable learn" 
                onClick={
                    () => navigate(`/learn`, {
                        state: {xp: learnData.learning.learning_xp, 
                                id: learnData.learning.id,
                                maxTextPos: learnData.max_text_pos,
                                saved: learnData.saved
                            }
                    })
                }>
                {!userCompleted ? <div className="circle"></div> : ""}
                <p className="sm-heading right-text" style={{marginTop: 10}}>{learnData.learning.title}</p>
                <p style={{maxWidth: "90%"}} className="right-text">{learnData.learning.tldr}</p>
                <div className="to-right">
                    <p className="sm-heading">+ {learnData.learning.learning_xp} xp</p>
                </div>
            </div>
        </div>
    )
}

export default Learn;
