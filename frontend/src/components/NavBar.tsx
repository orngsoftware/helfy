import { useLocation, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

export const NavBar = () => {
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

export const NavBarLanding = () => {
    const navigate = useNavigate()
    const [isNavOpen, setNavOpen] = useState(false)

    return (
        <div className="navbar navbar-landing">
            <img style={{width: 32, marginLeft: 25}} src="/assets/icons/helfy_icon_black.svg" />
            <svg className="list-icon clickable" onClick={() => setNavOpen(!isNavOpen)} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="var(--black-color)" viewBox="0 0 256 256"><path d={isNavOpen ? "M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" : "M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"}></path></svg>
            {isNavOpen && (
                <AnimatePresence>
                    <motion.div 
                    initial={{scale: 0.1}}
                    animate={{
                        scale: 1,
                        transition: {duration: 0.3, type: "spring", stiffness: 200, damping: 20}
                    }} className="card nav-mobile">
                        <Link className="navbar-landing-link" to="/">Home</Link>
                        <Link className="navbar-landing-link" to="/how-it-works">How it works</Link>
                        <Link className="navbar-landing-link" to="/pricing">Pricing</Link>
                    </motion.div>
                </AnimatePresence>
            )}
            
            <Link className="navbar-landing-link desktop" to="/">Home</Link>
            <Link className="navbar-landing-link desktop" to="/how-it-works">How it works</Link>
            <Link className="navbar-landing-link desktop" to="/pricing">Pricing</Link>
            <div className="row to-right" style={{width: 185, gap: 15, marginRight: 10}}>
                <Link className="navbar-landing-link" to="/log-in">Log in</Link>
                <button className="btn-primary" style={{maxWidth: 125}} onClick={() => navigate("/sign-up")}>Sign up</button> 
            </div>
        </div>
    )
}