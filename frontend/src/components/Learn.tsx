import { useNavigate } from "react-router-dom";

const Learn = ({ learnData, userCompleted }: {learnData: any, userCompleted: boolean}) => {
    const navigate = useNavigate()
    
    return (
        <div className="card clickable"
            style={{
                backgroundColor: "var(--black-color)",
                color: "white"
            }} 
            onClick={
                () => navigate(`/learn`, {
                    state: {xp: learnData.learning.learning_xp, 
                            id: learnData.learning.id,
                            maxTextPos: learnData.max_text_pos,
                            saved: learnData.saved
                        }
                })
            }>
            <div className="row">
                <p className="sm-heading">{learnData.learning.title}</p>
                {!userCompleted && (
                    <div className="tag right-tag"><p>New</p></div>
                )}
            </div>
            
            <p style={{marginBottom: 10}}>Here won't be TL;DR in the future, just short description about what the user will learn in the Learn.</p>
            <div className="icon-row w-bg w-outline">
                <img src="/assets/icons/bluestar.png" style={{height: 16}} />
                <p className="pixel-sans">{learnData.learning.learning_xp} XP</p>
            </div>
        </div>
    )
}

export default Learn;
