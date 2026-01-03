import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
    const navigate = useNavigate()
    
    return (
        <div className="col center-align no-max-width" style={{margin: 0, marginBottom: 50}}>
            <div className="col center-align no-max-width">
                <h1 style={{marginTop: 120}}>How Helfy works</h1> 
                <p className="grey-subtext" style={{maxWidth: 500, textAlign: "center"}}>Action is what matters, so we tried to make the approach as actionable and clear as possible</p>
            </div>
            <div className="col center-align no-max-width" style={{gap: 15, marginBottom: 25}}>
                <div className="card" style={{maxWidth: 600}}>
                    <h2>1. Choose your destiny</h2>
                    <p className="no-max-width">Choose a health area you believe you need to improve the most. Currently Helfy provides two health areas: <span className="bold">Training and Nutrition</span>. Plus users can choose unlimited amount of health areas, basic users only one.</p>
                </div>
                <div className="card" style={{maxWidth: 600}}>
                    <h2>2. Learn</h2>
                    <p className="no-max-width">Learn essential, health-related and practical information for regular people in the form of short 'Learns' that update every 3–5 days (depending on the plan and section) and consist of multiple texts. You receive Learn XP for each Learn.</p>
                </div>
                <div className="card" style={{maxWidth: 600}}>
                    <h2>3. Complete Tasks or Habits</h2>
                    <p className="no-max-width">We know what is right, but we don't know specifically what to do today. Every day, you are given tasks that you can: <span className="bold">1) complete</span> (receive Action XP) <span className="bold">2) incomplete</span> (lose Action XP)
<span className="bold"> 3) mark as a habit</span> (this task will reappear in your Helfy to-do list every day, and you will receive x2 XP). Some Tasks become Habits automatically.</p>
                </div>
                <div className="card" style={{maxWidth: 600}}>
                    <h2>4. Develop your Companion</h2>
                    <p className="no-max-width">To make the application more personable and engaging, there is Companion. The default Companion varies slightly depending on the plan, but you can customise it by purchasing accessories using the Action XP you earn.</p>
                </div>
            </div>
            <p className="grey-subtext" style={{marginBottom: 15}}>if you never try, you will never know...</p>
            <button className="btn-primary fit-content" onClick={() => navigate("/sign-up")}>Try Helfy out</button>
        </div>
    )
}

export default HowItWorks;