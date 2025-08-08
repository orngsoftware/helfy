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

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("habits")
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState({
        habitsData: [],
        learnData: {},
        tasksData: [],
        userCompletedLearning: true
    })

    async function fetchData() {
        setLoading(true)
        try {
            const tasksResponse = await axiosInstance.get("/tasks")
            const habitResponse = await axiosInstance.get("/tasks/habits")
            const learnResponse = await axiosInstance.get("/learning?short=True")

            setData({
                habitsData: habitResponse.data.habits,
                learnData: learnResponse.data.learning,
                tasksData: tasksResponse.data.tasks,
                userCompletedLearning: learnResponse.data.completed
            })
        } catch(error: any) {
            console.log("Error fetching data: ", error)
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
            <div className="col" style={{marginRight: 10, marginLeft: 10, marginTop: 10}}>
                <div className="to-right" style={{marginRight: 15}}>
                    <Streak size="14" />
                </div>
                <h3 style={{marginBottom: 15, marginTop: 0}}>Learn</h3>
                <Learn learnData={data.learnData} userCompleted={data.userCompletedLearning} />
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