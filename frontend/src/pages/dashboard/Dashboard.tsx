import { useState } from "react";
import Divider from "../../components/Divider";
import Habits from "../../components/Habits";
import { RepeatIcon, TickIcon } from "../../components/Icons";
import Learn from "../../components/Learn";
import Streak from "../../components/Streak";
import Tasks from "../../components/Tasks";
import { motion, AnimatePresence } from "motion/react"

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("habits")


    return (
        <div className="container">
            <div className="col">
                <div className="to-right" style={{marginRight: 15}}>
                    <Streak size="14" />
                </div>
                <h3 style={{marginBottom: 15, marginTop: 0}}>Learn</h3>
                <Learn />
                <h3 style={{marginBottom: 15, marginTop: 25}}>Take action today</h3>
                <div className="row" style={{marginBottom: 15, gap: 25}}>
                    <div className={activeTab === "habits" ? "outline-box tab" : ""} style={{cursor: "pointer"}} onClick={() => setActiveTab("habits")}>
                        <div className="icon-row">
                            <RepeatIcon color={activeTab === "habits" ? "var(--dark-green-color)": "var(--black-color)"} width="20" height="20" />
                            <p>Habits</p>
                        </div>
                    </div>
                    <div className={activeTab === "tasks" ? "outline-box tab" : ""} style={{cursor: "pointer"}} onClick={() => setActiveTab("tasks")}>
                        <div className="icon-row">
                            <TickIcon color={activeTab === "tasks" ? "var(--dark-green-color)": "var(--black-color)"} width="20" height="20" />
                            <p>Tasks</p>
                        </div>
                    </div>
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
                    <Habits />
                    </motion.div>
                ) : (
                    <motion.div
                    key="tasks"
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    exit={{ opacity: 0}}
                    transition={{ duration: 0.2, ease: "easeInOut"}}
                    >
                    <Tasks />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Dashboard