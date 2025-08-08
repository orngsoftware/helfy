import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="container">
            <div className="col center">
                <h1>FUTURE LANDING</h1>
                <button className="btn-primary" onClick={() => navigate("/sign-up")}>Sign up</button>
            </div>
        </div>
    )
}

export default LandingPage;