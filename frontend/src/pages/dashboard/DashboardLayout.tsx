import { Outlet } from "react-router-dom"
import NavBar from "../../components/NavBar"

const DashboardLayout = () => {
    return (
        <div className="container">
            <div style={{width: "100%"}}>
                <Outlet />
                <NavBar />
            </div>
        </div>
    )
}

export default DashboardLayout