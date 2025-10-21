import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "motion/react"

const NavBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    
    return (
        <div className="navbar">
            <BounceAnimation>
                <div onClick={() => navigate("/dashboard")} className={location.pathname === "/dashboard" ? "nav-element active" : "nav-element"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill={location.pathname === "/dashboard" ? "white" : "var(--black-color)" } viewBox="0 0 256 256"><path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z"></path></svg>
                </div>
            </BounceAnimation>
            <BounceAnimation>
                <div onClick={() => navigate("/dashboard/saved")} className={location.pathname === "/dashboard/saved" ? "nav-element active" : "nav-element"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill={location.pathname === "/dashboard/saved" ? "white" : "var(--black-color)"} viewBox="0 0 256 256"><path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"></path></svg>
                </div>
            </BounceAnimation>
            <BounceAnimation>
                <div onClick={() => navigate("/dashboard/companion")} className={location.pathname === "/dashboard/companion" ? "nav-element active" : "nav-element"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill={location.pathname === "/dashboard/companion" ? "white" : "var(--black-color)"} viewBox="0 0 256 256"><path d="M212,80a28,28,0,1,0,28,28A28,28,0,0,0,212,80Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,212,120ZM72,108a28,28,0,1,0-28,28A28,28,0,0,0,72,108ZM44,120a12,12,0,1,1,12-12A12,12,0,0,1,44,120ZM92,88A28,28,0,1,0,64,60,28,28,0,0,0,92,88Zm0-40A12,12,0,1,1,80,60,12,12,0,0,1,92,48Zm72,40a28,28,0,1,0-28-28A28,28,0,0,0,164,88Zm0-40a12,12,0,1,1-12,12A12,12,0,0,1,164,48Zm23.12,100.86a35.3,35.3,0,0,1-16.87-21.14,44,44,0,0,0-84.5,0A35.25,35.25,0,0,1,69,148.82,40,40,0,0,0,88,224a39.48,39.48,0,0,0,15.52-3.13,64.09,64.09,0,0,1,48.87,0,40,40,0,0,0,34.73-72ZM168,208a24,24,0,0,1-9.45-1.93,80.14,80.14,0,0,0-61.19,0,24,24,0,0,1-20.71-43.26,51.22,51.22,0,0,0,24.46-30.67,28,28,0,0,1,53.78,0,51.27,51.27,0,0,0,24.53,30.71A24,24,0,0,1,168,208Z"></path></svg>
                </div>
            </BounceAnimation>
        </div>
    )
}

const BounceAnimation = ({children} : {children: any}) => {
    return ( 
        <motion.div 
            whileTap={{scale: 0.9}}
            animate={{scale: 1}} 
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 20,
                }}>
        {children}
        </motion.div>
    )
}


export default NavBar;