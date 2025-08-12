import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const WordSwitcher = (props: any) => {
    const { words, interval, color } = props

    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (index < words.length - 1) {
            const timer = setTimeout(() => {
                setIndex((prev) => prev + 1)
            }, interval)
            return () => clearTimeout(timer)
        }
    }, [index, words.length, interval])

    return (
        <span style={{display: "inline-block", color: color}}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut"}}
                    style={{ display: "inline-block" }}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

const LandingFooter = () => {
    return (
        <footer>
            <div className="row" style={{gap: 20}}>
                <Link to="/sign-up">Sign up</Link>
                <Link to="/log-in">Log in</Link>
                <Link to="/">Home Page</Link>
                <Link to="mailto: while.no.helf@gmail.com">Contact Us</Link>
            </div>
            <p>© 2025 Helfy. All rights reserved</p>
        </footer>
    )
}

const LandingPage = () => {
    const navigate = useNavigate()
    const words = ["stress-free", "in a gamified way", "efficiently", "smartly", "simpler"]

    return (
        <div className="container">
            <div className="col center-align" style={{gap: 25}}>
                <div className="row to-left">
                    <Link to="/">
                        <img src="/assets/helfy_logo_v1.svg" alt="Helfy Logo" style={{height: 100}}/>
                    </Link>
                    <p style={{color: "var(--red-color)"}}>Beta v0.1</p>
                </div>
                <div className="col center-align" style={{textAlign: "center"}}>
                    <h1 style={{marginBottom: 10, marginTop: 0}}>improve your nutrition <WordSwitcher words={words} interval={1000} color="var(--dark-green-color)" />.</h1>
                    <p>Free, fun and gamified app to improve your nutrition</p>
                    <div className="col" style={{gap: 10}}>
                        <button style={{height: 45, width: 250}} className="btn-primary" onClick={() => navigate("/sign-up")}>Get started</button>
                        <button style={{height: 45, width: 250}} className="btn-primary btn-outline" onClick={() => navigate("/dashboard")}>I have an account already</button>
                    </div>
                </div>
                <div className="row-landing">
                    <div className="card landing-demo" 
                        style={{backgroundColor: "var(--green-color)", border: "2px solid var(--dark-green-color)"}}>
                        <img className="landing-img" src="/assets/demo-plant.png" alt="Plant (companion) page demo" />
                    </div>
                    <div className="card landing-demo">
                        <img className="landing-img" style={{maxWidth: 235}} src="/assets/demo-dashboard.png" alt="Dashboard page demo" />
                    </div>
                </div>
                <div className="col center-align" style={{textAlign: "center"}}>
                    <h2>That's how it works</h2>
                    <p>To make progress you need to <span style={{fontWeight: "bold"}}>act</span>, to act smartly you need to <span style={{fontWeight: "bold"}}>learn.</span></p>
                </div>
                <div className="row-landing">
                    <motion.div
                        initial={{y: 50}}
                        whileInView={{y: 0}}
                        transition={{duration: 0.8, ease: "easeInOut", damping: 20, stiffness: 500, type: "spring"}}
                        className="card landing-feature" 
                        style={{backgroundColor: "var(--blue-color)"}}>
                        <div className="icon-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--dark-blue-color)"viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
                            <h2>Learn</h2>
                        </div>
                        <p>Every 3–7 days, you get a new Learn block with essential nutritional information to make you more knowledgeable. You get  <span style={{fontWeight: "bold"}}>Learn XP</span> for reading them.</p>
                    </motion.div>
                    <motion.div 
                        initial={{y: 50}}
                        whileInView={{y: 0}}
                        transition={{duration: 0.8, ease: "easeInOut", damping: 20, stiffness: 500, type: "spring", delay: 0.2}}
                        className="card landing-feature" 
                        style={{backgroundColor: "var(--yellow-color)"}}>
                        <div className="icon-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--dark-yellow-color)"viewBox="0 0 256 256"><path d="M235.24,84.38l-28.06,23.68,8.56,35.39a13.34,13.34,0,0,1-5.09,13.91,13.54,13.54,0,0,1-15,.69L164,139l-31.65,19.06a13.51,13.51,0,0,1-15-.69,13.32,13.32,0,0,1-5.1-13.91l8.56-35.39L92.76,84.38a13.39,13.39,0,0,1,7.66-23.58l36.94-2.92,14.21-33.66a13.51,13.51,0,0,1,24.86,0l14.21,33.66,36.94,2.92a13.39,13.39,0,0,1,7.66,23.58ZM88.11,111.89a8,8,0,0,0-11.32,0L18.34,170.34a8,8,0,0,0,11.32,11.32l58.45-58.45A8,8,0,0,0,88.11,111.89Zm-.5,61.19L34.34,226.34a8,8,0,0,0,11.32,11.32l53.26-53.27a8,8,0,0,0-11.31-11.31Zm73-1-54.29,54.28a8,8,0,0,0,11.32,11.32l54.28-54.28a8,8,0,0,0-11.31-11.32Z"></path></svg>
                            <h2>Act</h2>
                        </div>
                        <p>Knowing is cool, but acting is even cooler, so you receive tasks of varying difficulty every day. You can make any task a habit (x2 XP). You get <span style={{fontWeight: "bold"}}>Action XP</span> for completing them.</p>
                    </motion.div>
                    <motion.div
                        initial={{y: 50}}
                        whileInView={{y: 0}}
                        transition={{duration: 0.8, ease: "easeInOut", damping: 20, stiffness: 500, type: "spring", delay: 0.4}}
                        className="card landing-feature" 
                        style={{border: "2px solid var(--dark-blue-color)"}}>
                        <div className="icon-row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--black-color)" viewBox="0 0 256 256"><path d="M200,144h-76.7l22.41-22.41a59.55,59.55,0,0,0,26.1,6.36,49.56,49.56,0,0,0,25.89-7.22c23.72-14.36,36.43-47.6,34-88.92a8,8,0,0,0-7.52-7.52c-41.32-2.43-74.56,10.28-88.93,34-9.35,15.45-9.59,34.11-.86,52L120,124.68l-12.21-12.21c6-13.25,5.57-27-1.39-38.48C95.53,56,70.61,46.41,39.73,48.22a8,8,0,0,0-7.51,7.51C30.4,86.6,40,111.52,58,122.4A38.22,38.22,0,0,0,78,128a45,45,0,0,0,18.52-4.19L108.69,136l-8,8H56a8,8,0,0,0,0,16h9.59L78.8,219.47A15.89,15.89,0,0,0,94.42,232h67.17a15.91,15.91,0,0,0,15.62-12.53L190.42,160H200a8,8,0,0,0,0-16Z"></path></svg>
                            <h2>Grow your plant</h2>
                        </div>
                        <p><span style={{fontWeight: "bold"}}>Learn XP</span> is used to grow your plant automatically: for every 10 XP, the plant grows by one stage. You can also purchase <span style={{fontWeight: "bold"}}>Action XP</span> to buy accessories for your plant.</p>
                    </motion.div>
                </div>
                <LandingFooter />
            </div>
        </div>
    )
}

export default LandingPage;