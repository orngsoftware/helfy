import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"

const NavBar = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("/dashboard")

    function changeTabs(tab: string) {
        setActiveTab(tab)
        if (tab === "/dashboard") {
            navigate(tab)
        } else {
            navigate("/dashboard/companion")
        }
    }

    return (
        <div className="navbar">
            <motion.div whileTap={{scale: 0.9}} 
                        animate={{scale: 1}} 
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
            }}>
                <div className={activeTab === "/dashboard" ? "clickable outline-box tab-active" : "outline-box tab clickable"} 
                    onClick={() => changeTabs("/dashboard")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill={activeTab === "/dashboard" ? "var(--dark-green-color)" : "var(--black-color)"} viewBox="0 0 256 256"><path d="M224,120v96a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V164a4,4,0,0,0-4-4H108a4,4,0,0,0-4,4v52a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V120a16,16,0,0,1,4.69-11.31l80-80a16,16,0,0,1,22.62,0l80,80A16,16,0,0,1,224,120Z"></path></svg>
                </div>
            </motion.div>
            <motion.div whileTap={{scale: 0.9}} 
                        animate={{scale: 1}} 
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
            }}>
                <div className={activeTab === "companion" ? "clickable outline-box tab-active" : "outline-box tab clickable"} 
                    onClick={() => changeTabs("companion")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill={activeTab === "companion" ? "var(--dark-green-color)" : "var(--black-color)"} viewBox="0 0 256 256"><path d="M200,144h-76.7l22.41-22.41a59.55,59.55,0,0,0,26.1,6.36,49.56,49.56,0,0,0,25.89-7.22c23.72-14.36,36.43-47.6,34-88.92a8,8,0,0,0-7.52-7.52c-41.32-2.43-74.56,10.28-88.93,34-9.35,15.45-9.59,34.11-.86,52L120,124.68l-12.21-12.21c6-13.25,5.57-27-1.39-38.48C95.53,56,70.61,46.41,39.73,48.22a8,8,0,0,0-7.51,7.51C30.4,86.6,40,111.52,58,122.4A38.22,38.22,0,0,0,78,128a45,45,0,0,0,18.52-4.19L108.69,136l-8,8H56a8,8,0,0,0,0,16h9.59L78.8,219.47A15.89,15.89,0,0,0,94.42,232h67.17a15.91,15.91,0,0,0,15.62-12.53L190.42,160H200a8,8,0,0,0,0-16Z"></path></svg>
                </div>
            </motion.div>
        </div>
    )
}

export default NavBar