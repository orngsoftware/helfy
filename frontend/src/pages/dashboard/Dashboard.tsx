import { useEffect, useState } from "react";
import Divider from "../../components/Divider";
import Habits from "../../components/Habits";
import { RepeatIcon, TickIcon } from "../../components/Icons";
import Learn from "../../components/Learn";
import Streak from "../../components/Streak";
import Tasks from "../../components/Tasks";
import { motion, AnimatePresence } from "motion/react"
import axiosInstance from "../../lib/apiClient";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("habits")
    const [isLoading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [data, setData] = useState({
        habitsData: [],
        learnData: {},
        tasksData: [],
        userCompletedLearning: true,
        current_plan: { name: "", user_days: ""}
    })

    async function fetchData() {
        setLoading(true)
        try {
            const planResponse = await axiosInstance.get("/plans/current")
            const tasksResponse = await axiosInstance.get("/tasks")
            const habitResponse = await axiosInstance.get("/tasks/habits")
            const learnResponse = await axiosInstance.get("/learning")

            setData({
                habitsData: habitResponse.data.habits,
                learnData: learnResponse.data,
                tasksData: tasksResponse.data.tasks,
                userCompletedLearning: learnResponse.data.completed,
                current_plan: planResponse.data.current_plan
            })
        } catch(error: any) {
            console.error("Error fetching data: ", error)
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
            <div className="col" style={{marginTop: 10}}>
                <div className="row" style={{marginBottom: 5}}>
                    <div className="icon-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M224,48V152a16,16,0,0,1-16,16H112v16a8,8,0,0,1-13.66,5.66l-24-24a8,8,0,0,1,0-11.32l24-24A8,8,0,0,1,112,136v16h96V48H96v8a8,8,0,0,1-16,0V48A16,16,0,0,1,96,32H208A16,16,0,0,1,224,48ZM168,192a8,8,0,0,0-8,8v8H48V104h96v16a8,8,0,0,0,13.66,5.66l24-24a8,8,0,0,0,0-11.32l-24-24A8,8,0,0,0,144,72V88H48a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16H160a16,16,0,0,0,16-16v-8A8,8,0,0,0,168,192Z"></path></svg>
                        <h3 className="clickable" onClick={() => navigate("/plans")}>{data.current_plan.name}</h3>
                    </div>
                    <div style={{marginLeft: "auto"}}>
                        <Streak size="14" />
                    </div>
                </div>
                <Divider color="var(--dark-grey-color)" />
                <h3 style={{marginTop: 25}}>Learn</h3>
                <div className="col center" style={{margin: 0}}>
                    <Learn learnData={data.learnData} userCompleted={data.userCompletedLearning} />
                </div>
                
                <h3 style={{marginBottom: 15, marginTop: 25}}>Take action today</h3>
                <div className="row" style={{marginBottom: 15, gap: 25}}>
                    <motion.div whileTap={{scale: 0.9}} 
                        animate={{scale: 1}} 
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                    }}>
                        <div className={activeTab === "habits" ? "outline-box tab-active" : "outline-box tab"} style={{cursor: "pointer"}} onClick={() => setActiveTab("habits")}>
                            <div className="icon-row">
                                <RepeatIcon color={activeTab === "habits" ? "var(--dark-green-color)": "var(--black-color)"} width="20" height="20" />
                                <p>Habits</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div whileTap={{scale: 0.9}} 
                        animate={{scale: 1}} 
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                    }}>
                        <div className={activeTab === "tasks" ? "outline-box tab-active" : "outline-box tab"} style={{cursor: "pointer"}} onClick={() => setActiveTab("tasks")}>
                            <div className="icon-row">
                                <TickIcon color={activeTab === "tasks" ? "var(--dark-green-color)": "var(--black-color)"} width="20" height="20" />
                                <p>Tasks</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <Divider color="var(--dark-grey-color)" />
                <AnimatePresence mode="wait">
                {activeTab === "habits" ? (
                    <motion.div
                    key="habits"
                    className="col center"
                    style={{margin: 0, marginTop: 10}}
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2, ease: "easeInOut"}}
                    >
                    <Habits habitsData={data.habitsData}/>
                    </motion.div>
                ) : (
                    <motion.div
                    key="tasks"
                    className="col center"
                    style={{margin: 0, marginTop: 10}}
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2, ease: "easeInOut"}}
                    >
                    <Tasks tasksData={data.tasksData}/>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Dashboard