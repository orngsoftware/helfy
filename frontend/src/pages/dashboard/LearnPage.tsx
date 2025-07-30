import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axiosInstance from "../../lib/apiClient"

const LearnPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [learnData, setLearnData] = useState({
        id: null,
        title: null,
        tldr: null,
        day: null,
        body: null,
        learning_xp: null
    })
    const isTLDR = searchParams.get("tldr")
    const navigate = useNavigate() // <-- later change to clickHandler that will either complete the learning (this should also handle errors and etc, separate func) or navigate()
    const nextUrl = isTLDR ? "/learn" : "/dashboard" // <-- later change to "finish-page" or smth like this

    async function fetchData() {
        const response = await axiosInstance.get("/learning")
        setLearnData(response.data.learning)
        return;
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container" style={{backgroundColor: "white"}}>
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
                <p style={{maxWidth: 300}}>{learnData.body}</p>
                )}
                <button className="btn-primary to-bottom" onClick={() => navigate(nextUrl)}>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default LearnPage