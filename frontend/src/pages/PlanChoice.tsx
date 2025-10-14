import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/apiClient";
import Loading from "../components/Loading";
import { TickIcon } from "../components/Icons";

const PlanChoicePage = () => {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState([])

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
            console.error("Error starting new plan: ", error)
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
                        <div className="card clickable" style={{
                            border: plan.current ? "3px solid var(--dark-blue-color)" : ""
                            }} onClick={() => startPlan(plan.id)}
                        >
                            {plan.current ? (
                                <div className="circle" style={{backgroundColor: "var(--dark-blue-color)"}}>
                                    <TickIcon width={15} height={15} color="white" />
                                </div>
                                ) : ""}
                            <div className="task-mark">
                                <p style={{color: "var(--dark-green-color)"}}>{plan.status ? "Enrolled" : ""}</p>
                            </div>
                            <p className="sm-heading">{plan.name}</p>
                            <p>{plan.description}</p>
                        </div>
                    )
                ))}
                <button className="btn-primary to-bottom" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
                    Go back
                </button>
            </div>
        </div>
    )

}

export default PlanChoicePage;