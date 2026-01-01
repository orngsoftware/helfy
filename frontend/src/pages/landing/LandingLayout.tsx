import { Outlet } from "react-router-dom";
import { NavBarLanding } from "../../components/NavBar";
import { LandingFooter } from "./HomePage";

const LandingLayout = () => {
    return (
        <div className="container">
            <div className="col" style={{margin: 0, maxWidth: "none"}}>
                <NavBarLanding />
                <Outlet />
                <LandingFooter />
            </div>
        </div>
    )
}

export default LandingLayout