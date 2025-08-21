import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axiosInstance from "../../lib/apiClient"
import Loading from "../../components/Loading"

const LearnPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [learnData, setLearnData] = useState({
        id: null,
        title: null,
        tldr: null,
        day: null,
        body: "",
        learning_xp: null
    })
    const isTLDR = searchParams.get("tldr")
    const [isLoading, setLoading] = useState(true)
    const navigate = useNavigate() 
    
    async function handleContinue() {
        if (isTLDR) {
            navigate("/learn")
            return
        }
        try {
            await axiosInstance.post(`/learning/complete/${learnData.id}`)
            navigate("/done/learn", {state: {xp: learnData.learning_xp}})
        } catch(error: any) {
            if (error.response?.status === 400) {
                navigate("/dashboard")
            } else {
                console.error("Learning completition error: ", error)
            }
        }
    }

    async function fetchData() {
        setLoading(true)
        try {
            const response = await axiosInstance.get("/learning")
            setLearnData(response.data.learning)
        } catch(error: any) {
            console.log("Error fetching learn data: ", error)
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
    ) : (
        <div className="container">
            <div className="col">
                <div className="arrow-back" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                </div>
                <h2>{learnData.title}</h2>
                {isTLDR ? (
                    <div className="card" style={{backgroundColor: "var(--blue-color)"}}>
                        <p className="sm-heading right-text" style={{marginTop: 5}}>TL;DR</p>
                        <p className="right-text">{learnData.tldr}</p>
                    </div>
                ): (
                <div style={{maxWidth: 350, marginBottom: 175}} dangerouslySetInnerHTML={{ __html: learnData.body }} />
                )}
                <button className="to-bottom btn-primary btn-down" onClick={handleContinue}>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default LearnPage
