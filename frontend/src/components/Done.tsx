import { useLocation, useNavigate } from "react-router-dom"

const Done = (props: any) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { xp } = location.state || {}
    const messages = ["Done", "Good job!", "YEAAAH!", "Amazing", "strong", "You are so healthy...", "Just look at it", "Perfect", "completed."]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    if (props.doneType === "task") {
        var colors = {bg_color: "var(--green-color)", xp_color: "var(--dark-green-color)"}
    } else if (props.doneType === "habit") {
        var colors = {bg_color: "var(--yellow-color)", xp_color: "var(--dark-yellow-color)"}
    } else {
        var colors = {bg_color: "white", xp_color: "var(--dark-blue-color)"}
    }

    return (
        <div className="container" style={{backgroundColor: colors.bg_color}}>
            <div className="col center">
                <h2>{randomMessage}</h2>
                <p className="sm-heading" style={{color: colors.xp_color}}>+ {xp} XP</p>
                <button className="btn-primary to-bottom" style={{width: 300}} onClick={() => navigate("/dashboard")}>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path></svg>
                </button>
            </div>
        </div>
    )

}

export default Done