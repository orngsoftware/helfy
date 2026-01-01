import { useEffect, useState } from "react";
import Habits from "../../components/Habits";
import Learn from "../../components/Learn";
import Tasks from "../../components/Tasks";
import { motion, AnimatePresence } from "motion/react"
import axiosInstance from "../../lib/apiClient";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import SmallStreak from "../../components/Streak";
import { SubscribeButton } from "../../components/StripeComponents";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("habits")
    const [isLoading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [data, setData] = useState({
        habitsData: [],
        learnData: {},
        tasksData: [],
        streak: 0,
        streakStatus: "lost",
        userCompletedLearning: true,
        current_plan: { name: "", user_days: "", category: ""},
        is_user_paid: false
    })
    const [currentTaskID, setCurrentTaskID] = useState(0)
    const [headerStyling, setHeaderStyling] = useState({bgColor: "", highlightColor: ""})

    async function fetchData() {
        setLoading(true)
        try {
            const planResponse = await axiosInstance.get("/plans/current")
            const tasksResponse = await axiosInstance.get("/tasks")
            const habitResponse = await axiosInstance.get("/tasks/habits")
            const learnResponse = await axiosInstance.get("/learning")
            const streakResponse = await axiosInstance.get("/users/stats/streak")

            setData({
                habitsData: habitResponse.data.habits,
                learnData: learnResponse.data,
                tasksData: tasksResponse.data.tasks,
                streak: streakResponse.data.result.streak,
                streakStatus: streakResponse.data.result.status,
                userCompletedLearning: learnResponse.data.completed,
                current_plan: planResponse.data.current_plan,
                is_user_paid: planResponse.data.current_plan.is_user_paid
            })
        } catch(error: any) {
            console.error("Error fetching data: ", error)
        } finally {
            setLoading(false)
        }
        return;
    }

    function nextTask() {
        if (activeTab === "habits") {
            if (currentTaskID + 1 < data.habitsData.length) {
                setCurrentTaskID(prev => prev + 1)
            }
        } else if (activeTab === "tasks") {
            if (currentTaskID + 1 < data.tasksData.length) {
                setCurrentTaskID(prev => prev + 1)
            }
        }
    }

    function switchTabs(newTab: string) {
        console.log(currentTaskID)
        setCurrentTaskID(0)
        setActiveTab(newTab)
        return;
    }

    function previousTask() {
        if (currentTaskID - 1 >= 0 ) {
            setCurrentTaskID(prev => prev - 1)
            return;
        }
    }

    function styleHeader(planCategory: string) {
        switch (planCategory) {
            case "Training":
                setHeaderStyling({bgColor: "#ff70a6", highlightColor: "#d5437bff"})
                break;
            case "Nutrition":
                setHeaderStyling({bgColor: "var(--green-color)", highlightColor: "var(--dark-green-color)"})
                break;
        }
    }

    useEffect(() => {
        fetchData()
        styleHeader(data.current_plan.category)
    }, [data.current_plan.category])

    return isLoading ? (
        <Loading />
    ) : (
        <div className="container">
            <div className="col" style={{gap: 10, marginTop: 0, marginBottom: 110}}>
                <div className="top-card clickable" style={{backgroundColor: headerStyling.bgColor}} onClick={() => navigate("/plans")}>
                    <div className="text-subtext">
                        <p style={{margin: 0}}>{data.current_plan.category}</p>
                        <h3 style={{margin: 0}} className="pixel-sans">{data.current_plan.name}</h3>
                    </div>
                    <SmallStreak streak={data.streak} status={data.streakStatus} bgColor={headerStyling.highlightColor} />
                </div>
                <h3>Take Action Today</h3>
                <div className="row" style={{alignItems: "center"}}>
                    <div className="row">
                        <button className="btn-primary" style={{
                            width: "fit-content", 
                            height: 35,
                            backgroundColor: activeTab === "habits" ? "var(--black-color)" : "white",
                            color: activeTab === "habits" ? "white" : "var(--dark-grey-color)"
                        }} onClick={() => switchTabs("habits")}>Habits</button>
                        <button className="btn-primary" style={{
                            width: "fit-content",
                            height: 35,
                            backgroundColor: activeTab === "tasks" ? "var(--black-color)" : "white",
                            color: activeTab === "tasks" ? "white" : "var(--dark-grey-color)"
                        }} onClick={() => switchTabs("tasks")}>Tasks</button>
                    </div>
                    <div className="row" style={{marginLeft: "auto"}}>     
                        <div className="circle-btn"><p style={{color: "var(--dark-grey-color)"}}>{activeTab === "habits" ? data.habitsData.length : data.tasksData.length}</p></div>                   
                        <button className="circle-btn" onClick={previousTask}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--dark-grey-color)" viewBox="0 0 256 256"><path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path></svg>
                        </button>
                        <button className="circle-btn" onClick={nextTask}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--dark-grey-color)" viewBox="0 0 256 256"><path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path></svg>
                        </button>
                    </div>
                </div>
                <AnimatePresence mode="wait">
                {activeTab === "habits" ? (
                    <motion.div
                    key="habits"
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2, ease: "easeInOut"}}
                    >
                    <Habits habitsData={data.habitsData[currentTaskID]}/>
                    </motion.div>
                ) : (
                    <motion.div
                    key="tasks"
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2, ease: "easeInOut"}}
                    >
                    <Tasks tasksData={data.tasksData[currentTaskID]}/>
                    </motion.div>
                )}
                </AnimatePresence>
                <h3>Learn</h3>
                <Learn learnData={data.learnData} userCompleted={data.userCompletedLearning} />
                {data.is_user_paid === false ? (
                    <SubscribeButton bgClass="upgrade-bg" errorNavigate="/dashboard">Upgrade to Plus</SubscribeButton>
                ): ""}
            </div>
        </div>
    )
}

export default Dashboard