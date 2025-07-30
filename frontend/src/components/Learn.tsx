import { useEffect, useState } from "react";
import axiosInstance from "../lib/apiClient";
import { useNavigate } from "react-router-dom";


const Learn = () => {
    const [learnData, setLearnData] = useState({
        id: null, 
        title: null,
        tldr: null,
        learning_xp: null
    })
    const [userCompleted, setUserCompleted] = useState(false)

    const navigate = useNavigate()

    async function fetchData() {
        const response = await axiosInstance.get("/learning?short=True")
        setLearnData(response.data.learning)
        setUserCompleted(response.data.completed)
        return;
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    return (
        <div>
            <div className="card clickable" style={{backgroundColor: "var(--blue-color)"}} 
                onClick={() => navigate("/learn?tldr=True")}>
                {userCompleted ? <div className="red-circle"></div> : ""}
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
