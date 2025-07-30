import { useEffect, useState } from "react"
import axiosInstance from "../lib/apiClient"

const Streak = (props: any) => {
    const size = Number(props.size)
    const [streak, setStreak] = useState(null)
    const [status, setStatus] = useState("")

    function getStyling(status: string) {
        const d_cloud = "M160.06,40A88.1,88.1,0,0,0,81.29,88.67h0A87.48,87.48,0,0,0,72,127.73,8.18,8.18,0,0,1,64.57,136,8,8,0,0,1,56,128a103.66,103.66,0,0,1,5.34-32.92,4,4,0,0,0-4.75-5.18A64.09,64.09,0,0,0,8,152c0,35.19,29.75,64,65,64H160a88.09,88.09,0,0,0,87.93-91.48C246.11,77.54,207.07,40,160.06,40Z"
        const d_lightning = "M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"
        return {icon_d: (status === "kept" ? d_lightning : d_cloud), color: (status === "kept" ? "var(--red-color)" : "var(--black-color)")} 
    }

    async function fetchData() {
        const response = await axiosInstance.get("/users/stats/streak")
        setStreak(response.data.result.streak)
        setStatus(response.data.result.status)
        return;
    }
    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="icon-row">
            <svg xmlns="http://www.w3.org/2000/svg" width={size*1.5} height={size*1.5} fill={getStyling(status).color} viewBox="0 0 256 256"><path d={getStyling(status).icon_d}></path></svg>
            <p className="sm-heading" style={{fontSize: size}}>{streak}</p>
        </div>
    )
}

export default Streak;