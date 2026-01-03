import { Link } from "react-router-dom";
import { FlyingStar, TickIcon, ArrowBack, ArrowForward } from "../../components/Icons";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "../../components/ProgressBar";

export const LandingFooter = () => {
    return (
        <div className="col center no-max-width" style={{margin: 0}}>
            <footer>
                <div className="col">
                    <div className="icon-row">
                        <img className="pixelated-img" src="/assets/icons/helfy_icon_white.png" style={{width: 32, marginLeft: 5}}/>
                        <h1>Helfy</h1>
                    </div>
                    <p>Improve your health simpler in gamified way.</p>
                </div>
                <div className="col" style={{gap: 15}}>
                    <p style={{margin: 0}} className="bold">Site Map</p>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/">Home</Link>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/dashboard">Dashboard</Link>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/how-it-works">How it works</Link>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/pricing">Pricing</Link>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/sign-up">Sign Up</Link>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/log-in">Log In</Link>
                </div>
                <div className="col" style={{gap: 15}}>
                    <p style={{margin: 0}} className="bold">Legal</p>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/privacy-policy">Privacy Policy</Link>
                    <Link className="navbar-landing-link" style={{color: "white"}} to="/terms-of-service">Terms of Service</Link>
                </div>
            </footer>
            <div className="rect-bg" style={{padding: "15px 0px"}}>
                <p style={{textAlign: "center"}}>Copyright © 2025, Helfy. All Right Reserved.</p>
            </div>
        </div>
    )
}

const LearnDemo = () => {
    const [currentPos, setCurrentPos] = useState(1)
    const texts = {
        1: {content: "Eating mainly nutrient-dense foods, i.e. foods that contain a high amount of nutrients relative to their calorie content, can help prevent overeating, as they provide greater satiety and nutrients (with less calories). Such foods are usually minimally or unprocessed. For example whole grains, vegetables, lean proteins, basically almost all whole foods can be considered as nutrient-dense.", 
            title: "What is nutrient dense?"},
        2: {content: "Processed foods are often (1) higher in calories than minimally processed or whole foods, which can lead to unnoticeable overeating. Try to choose whole foods, e.g. just a bell pepper, but don't go into 'not-eating-anything-except-X' mode, remember that you should try to expand (and moderate), not restrict, feel free to eat processed foods, just maybe choose ones that are lower in calories.", 
            title: "Processed food"}
    }
    function nextText () {
        if (currentPos < 2) {
            setCurrentPos(prev => prev + 1)
        }
    }

    function previousText () {
        if (currentPos > 1) {
            setCurrentPos(prev => prev - 1)
        }
    }

    return (
        <div className="card" style={{backgroundColor: "var(--grey-color)", maxWidth: 400, height: 465, alignItems: "center", padding: 0, marginBottom: 25}}>
            <div className="col center-align" style={{marginBottom: 110}}>
                <div className="row" style={{marginTop: 10, marginBottom: 10, width: "100%"}}>
                    <div className="clickable" onClick={previousText}>
                        <ArrowBack color="var(--black-color)" width="32" height="32" />
                    </div>
                    <div className="clickable" onClick={nextText} style={{marginLeft: "auto"}}>
                        <ArrowForward color="var(--black-color" width="32" height="32" />
                    </div>
                </div>
                <ProgressBar maxValue={2} value={currentPos} />
                <div className="col center-align" style={{margin: "20px 0px 0px 0px"}}>
                    <h3 style={{alignSelf: "flex-start"}}>{texts[currentPos as keyof typeof texts].title}</h3>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPos}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ 
                                    duration: 0.5, 
                                    type: "spring", 
                                    stiffness: 300, 
                                    damping: 20
                                }}
                                className="card" 
                                style={{minHeight: 250, padding: 20, marginBottom: 10, maxWidth: 350}}>
                                <p>{texts[currentPos as keyof typeof texts].content}</p>
                            </motion.div>
                        </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

const HomePage = () => {
    const navigate = useNavigate()

    return (
        <div className="col center-align no-max-width" style={{margin: 0}}>
            <motion.div
                // animate={{x: [0, -10, 0]}}
                transition={{duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}}
                className="card floating-card left-card" style={{backgroundColor: "var(--black-color)", color: "white", rotate: -15}}>
                <p className="sm-heading">Expansion over restriction</p>
                <p style={{marginBottom: 10}}>Rather than using up all your willpower by giving up certain foods completely, it's better to invest it in developing good eating habits and adding more healthy foods to your nutrition.</p>
                <div className="icon-row w-bg w-outline">
                    <img src="/assets/icons/bluestar.png" style={{height: 16}} />
                    <p className="pixel-sans">10 XP</p>
                </div>
            </motion.div>
            <div className="card floating-card square-card" id="landing-icon-square1">
                <img src="/assets/icons/lightning.png" style={{height: 48, width: 48}} className="pixelated-img" />
            </div>
            <div className="card floating-card square-card" id="landing-icon-square2">
                <img src="/assets/icons/flyingstar.png" style={{height: 48, width: 48}} className="pixelated-img" />
            </div>
            <div className="col center-align no-max-width" style={{marginTop: 150, textAlign: "center"}}>
                <h1>Improve your Health <span className="pixel-sans">Cooler</span></h1> 
                <p className="grey-subtext" style={{maxWidth: "none", marginBottom: 20}}>Improve your <span className="bold">Nutrition & Training</span> in Gamified Way</p>
                <button className="btn-primary fit-content" onClick={() => navigate("/sign-up")}>Get Started</button>
            </div>
            <motion.div 
                // animate={{x: [0, 8, 0]}}
                transition={{duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}}
                className="card floating-card right-card" style={{rotate: 15}}>
                <p className="sm-heading">Do 15 push ups</p>                
                <p style={{marginBottom: 10}}>They will help you build chest and stay consistent with strength workouts</p>
                <div className="row">
                    <div className="icon-row w-bg w-outline" style={{borderColor: "var(--grey-color)"}}>
                        <FlyingStar height={16} />
                        <p className="pixel-sans">10 XP</p>
                    </div>
                    <div className="icon-row w-bg w-outline" style={{borderColor: "var(--grey-color)"}}>
                        <p className="pixel-sans" style={{color: "#80B918"}}>1</p>
                    </div>
                </div>
            </motion.div>
            <div className="rect-bg" style={{marginTop: 170, borderRadius: "15px 15px 0px 0px"}}>
                <div className="row-landing">
                    <img src="/assets/PhoneDemo.png" style={{width: 320, marginTop: 45}}/>
                    <div className="col no-max-width">
                        <h1>Learn. Act. <span className="pixel-sans">Recieve XP</span></h1>
                        <p className="grey-subtext" style={{maxWidth: 500, margin: 5}}>Helfy provides a <span className="bold">gamified system</span> to help you build healthy habits and stay engaged with your <span className="bold">well-being.</span></p>
                        <div className="col no-max-width" style={{marginTop: 25, gap: 5, marginBottom: 25}}>
                            <div className="icon-row" style={{gap: 5}}>
                                <TickIcon color="var(--black-color)" height={25} width={25} />
                                <p style={{maxWidth: "none"}}><span className="bold">Everyday Tasks and Habits</span> so you would know what to do every day</p>
                            </div>
                            <div className="icon-row" style={{gap: 5}}>
                                <TickIcon color="var(--black-color)" height={25} width={25} />
                                <p style={{maxWidth: 500}}><span className="bold">Plans with Realistic Goals of Building Long-Term Habits</span>, not quick hacks</p>
                            </div>
                            <div className="icon-row" style={{gap: 5}}>
                                <TickIcon color="var(--black-color)" height={25} width={25} />
                                <p style={{maxWidth: 500, fontWeight: "bold"}}>Learns with Science-Based Info for Normal people</p>
                            </div>
                            <div className="icon-row" style={{gap: 5}}>
                                <TickIcon color="var(--black-color)" height={25} width={25} />
                                <p style={{maxWidth: 500, fontWeight: "bold"}}>Gain XP from completing Tasks and Habits and upgrade your Companion</p>
                            </div>
                        </div>
                        <div className="row" style={{gap: 15}}>
                            <button className="btn-primary fit-content" onClick={() => navigate("/sign-up")}>Create Account</button>
                            <Link className="navbar-landing-link" to="/log-in">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rect-bg" style={{borderTop: "1px solid var(--dark-grey-color)"}}>
                <div className="row-landing">
                    <div className="col no-max-width">
                        <h1><span className="pixel-sans">Learn</span> Essentials</h1>
                        <p style={{maxWidth: 500, margin: 5, marginBottom: 25}}>It the abundance of information we currently are living in it is important 
                            to filter out the things we consume and learn, so Helfy provides only essential information 
                            — <span className="bold">practical</span> and <span className="bold">clear</span>, about health that is relevant to regular people, not athletes, billionaires or people with infinite time. 
                            <br/><br/>For completing Learns you receive <span className="bold">Learn XP.</span></p>
                        <button className="btn-primary fit-content" onClick={() => navigate("/sign-up")}>Start Learning</button>
                    </div>
                    <LearnDemo />
                </div>
            </div>
            <div className="row-landing">
                <img className="companion" src="/assets/companion_demo_gif.gif" style={{borderRadius: 15, marginBottom: 25}}/>         
                <div className="col no-max-width">
                    <h1>Develop your<span className="pixel-sans"> Companion</span></h1>
                    <p style={{maxWidth: 500, margin: 5, marginBottom: 25}}>
                        This little guy is called <span className="bold">Companion</span>, he is different on every plan in the application.
                        <br/><br/>
                        After completing <span className="bold">Task</span> or <span className="bold">Habit</span> you receive <span className="bold">Action XP</span>, that can be used to <span className="bold">buy new accessories</span> for your Companion.
                    </p>
                    <button className="btn-primary fit-content" onClick={() => navigate("/sign-up")}>Start Developing</button>
                </div>
            </div>
            <div className="rect-bg" style={{backgroundColor: "var(--black-color)", color: "white"}}>
                <div className="col center no-max-width" style={{padding: "100px 0 100px 0px"}}>
                    <h1 className="pixel-sans">Newsletter?</h1>
                    <p style={{maxWidth: 500, textAlign: "center"}}>Join <span className="bold">Helfy Newsletter</span> to receive short, simple, actionable <span className="bold">health insights, 
                        tips and strategies + info about new features and updates</span>, straight to your inbox.</p>
                    <form
                        action="https://app.kit.com/forms/8843705/subscriptions"
                        method="post"
                        className="col center-align"
                        style={{gap: 10, marginTop: 25}}
                    >
                        <input
                            type="email"
                            name="email_address"
                            placeholder="Enter your email"
                            className="newsletter-input"
                            required
                        />

                        <button type="submit" className="btn-primary btn-white">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </div>
        
    )
}

export default HomePage;
