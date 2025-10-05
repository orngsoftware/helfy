import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axiosInstance from "../../lib/apiClient"
import Loading from "../../components/Loading"
import { AnimatePresence, motion } from "motion/react"
import ProgressBar from "../../components/ProgressBar"

const LearnPage = () => {
    const location = useLocation()
    const { xp, id, maxTextPos, saved } = location.state || {} // pass xp, learning_id, maxTextPos from Learn

    const [isLoading, setLoading] = useState(true)
    const [currentPos, setCurrentPos] = useState(1)
    const [isSaved, setIsSaved] = useState(saved)

    const navigate = useNavigate()
    
    const [textData, setTextData] = useState({
        title: "",
        position: 0,
        learning_id: "",
        is_last: false,
        content: ""
    })
    
    async function handleContinue() {
        if (textData.is_last) {
            try {
                await axiosInstance.post(`/learning/complete/${textData.learning_id}`)
                navigate("/done/learn", {state: {xp: xp}})
            } catch(error: any) {
                if (error.response?.status === 400) {
                    navigate(-1)
                } else {
                    console.error("Learning completition error: ", error)
                }
            }
        } else {
            setCurrentPos(prev => prev + 1)
        }
        return;
    }

    async function saveLearning() {
        if (isSaved) {
            try {
                await axiosInstance.delete(`/learning/saved/unsave/${textData.learning_id}`)
                setIsSaved(false)
            } catch(error: any) {
                console.error("Error unsaving learning")
            }
        } else {
            try {
                await axiosInstance.post(`/learning/saved/new/${textData.learning_id}`)
                setIsSaved(true)
            } catch(error: any) {
                console.error("Error saving learning")
            }
        }
        return;
    }

    async function fetchText() {
        setLoading(true)
        try {
            const response = await axiosInstance.get(`/learning/${id}/text/${currentPos}`)
            setTextData(response.data.text)
        } catch(error: any) {
            console.log("Error fetching text data: ", error)
        } finally {
            setLoading(false)
        }
        return;
    }

    function goBack() {
        if (currentPos == 1) {
            navigate(-1)
        } else {
            setCurrentPos(prev => prev -1)
        }
        return;
    }

    useEffect(() => {
        fetchText()
    }, [currentPos])

    return  (
        <div className="container">
            <div className="col">
                <div className="row" style={{marginTop: 10, marginBottom: 10}}>
                    <div className="clickable" onClick={goBack}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                    </div>
                    <div onClick={saveLearning} style={{marginLeft: "auto"}} className="clickable">
                        {isSaved ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--red-color)" viewBox="0 0 256 256"><path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path></svg>
                        )
                        }
                    </div>
                </div>
                <ProgressBar maxValue={maxTextPos} value={currentPos} />
                <div style={{marginTop: 20}}>
                    {textData.title ? (<h3>{textData.title}</h3>) : ""}
                    {isLoading ? <Loading /> : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPos}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ 
                                    duration: 0.5, 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 20
                                }}
                                className="card" 
                                style={{width: 280, minHeight: 250, padding: 20}}>
                                <p>{textData.content}</p>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
                <button className="btn-primary to-bottom" style={{width: 300}} onClick={handleContinue}>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </button>
            </div>
        </div>
    )
}

export default LearnPage
