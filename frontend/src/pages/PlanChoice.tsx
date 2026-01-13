import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/apiClient";
import Loading from "../components/Loading";
import { ArrowBack } from "../components/Icons";
import { SmallPopUp, UpgradePopUp } from "../components/PopUps";

const PlanChoicePage = () => {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [isDisclaimerClosed, setDisclaimerClosed] = useState(localStorage.getItem("disclaimer_opened"))
    const [data, setData] = useState([])

    function handleDisclaimerClose() {
        localStorage.setItem("disclaimer_opened", "t")
        setDisclaimerClosed("t")
    }

    async function fetchData() {
        setLoading(true)
        try {
            const plansResponse = await axiosInstance.get("/plans")
            setData(plansResponse.data.plans)
        } catch(error: any) {
            console.log("Error fetching data: ", error)
        } finally {
            setLoading(false)
        }
        return;
    }

    async function startPlan(planID: number) {
        try {
            await axiosInstance.post(`/plans/start/${planID}`)
            navigate("/dashboard")
        } catch(error: any) {
            if (error.response?.status === 403) {
                setIsUpgradeOpen(true)
            }
            console.error("Error starting new plan: ", error)
        }
    }

    async function switchPlan(planID: number) {
        try {
            await axiosInstance.patch(`/plans/switch/${planID}`)
            navigate("/dashboard")
        } catch(error: any) {
            if (error.response?.status === 400) {
                startPlan(planID)
            }
            console.error("Error switching to the plan: ", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return isLoading ? (
        <Loading />
    ) : (
        <div className="container">
            <div className="col center-align" style={{gap: 15}}>
                <div className="col center-align" style={{textAlign: "center"}}>
                    <h3>Choose your area</h3>
                    <p>pick an area you think you currently need the most</p>
                </div>
                {data.length === 0 ? (
                    <p className="sm-heading">No plans</p>
                ) : (
                    data.map((plan: any) => (
                        <div className="card clickable" onClick={() => switchPlan(plan.id)}>
                            <div className="row">
                                <h3 className="pixel-sans">{plan.name}</h3>
                                {plan.status && (
                                    <div className="tag right-tag" style={{backgroundColor: "rgba(217, 242, 83, 0.5)", color: "#c0d44bff"}}><p>Enrolled</p></div>
                                )}
                                {plan.current && (
                                    <div className="tag right-tag" style={{backgroundColor: "rgba(112, 214, 255, 0.5)", color: "#35c6ff", marginLeft: 2}}><p>Current</p></div>
                                )}
                            </div>
                            <p>{plan.description}</p>
                        </div>
                    )
                ))}
                {isUpgradeOpen && (
                    <UpgradePopUp closePopUp={() => setIsUpgradeOpen(false)} />
                )}
                {isDisclaimerClosed !== "t" && (
                    <SmallPopUp 
                    title="Disclaimer" 
                    subTitle="Helfy provides information for general wellness and habit improvement purposes. It is not a substitute for professional medical advice, diagnosis, or treatment."
                    btnText="Alright!"
                    closePopUp={handleDisclaimerClose} 
                    />
                )}
                <button className="btn-primary to-bottom" onClick={() => navigate(-1)}>
                    <ArrowBack color="white" width="24" height="24" />
                    Go back
                </button>
            </div>
        </div>
    )

}

export default PlanChoicePage;