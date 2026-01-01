import { useEffect, useState } from "react"
import axiosInstance from "../../lib/apiClient"
import Loading from "../../components/Loading"
import { useNavigate } from "react-router-dom"

const SavedLearnings = () => {
    const [isLoading, setLoading] = useState(true)
    const [savedLearnings, setSavedLearnings] = useState([])
    const navigate = useNavigate()
    
    async function fetchData() {
        setLoading(true)
        try {
            const apiResponse = await axiosInstance.get("/learning/saved")
            setSavedLearnings(apiResponse.data.saved_learnings)
        } catch(error: any) {
            console.error("Error fetching saved learnings: ", error)
        } finally {
            setLoading(false)
        }
        return;
    }
    
    useEffect(() => {
        fetchData()
    }, [])

    return isLoading ? (
        <Loading />
    ) :
    (
        <div className="container">
            <div className="col" style={{gap: 15}}>
                <h2>Saved learns</h2>
                {savedLearnings.length === 0 ? (
                    <p>You haven't saved any Learnings!</p>
                ) :
                    (savedLearnings.map((learning: any) => (
                        <div className="card clickable" onClick={() => navigate("/learn", {
                            state: {id: learning.learning.id,
                                    maxTextPos: learning.max_text_pos,
                                    saved: learning.saved
                                }
                        })}>
                            <p className="sm-heading" style={{marginTop: 10}}>{learning.learning.title}</p>
                            <p style={{maxWidth: "90%"}}>{learning.learning.tldr}</p>
                        </div>
                    )))
                }
            </div>
        </div>
    )
}

export default SavedLearnings