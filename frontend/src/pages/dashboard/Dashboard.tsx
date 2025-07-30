import { useEffect, useState } from "react";
import axiosInstance from "../../lib/apiClient";
import Learn from "../../components/Learn";
import Streak from "../../components/Streak";

const Dashboard = () => {
    const [user_xp, setUserXP] = useState(null)

    async function fetchData() {
        const response = await axiosInstance.get("/users/stats/xp")
        setUserXP(response.data.xp)
        return null
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="container">
            <div className="col">
                <div className="to-right" style={{marginRight: 15}}>
                    <Streak size="14" />
                </div>
                <h3 style={{marginBottom: 15, marginTop: 0}}>Learn</h3>
                <Learn />
            </div>
        </div>
    )
}

export default Dashboard