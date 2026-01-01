import { Outlet } from "react-router-dom"
import { NavBar } from "../../components/NavBar"

const DashboardLayout = () => {
    return (
        <div className="container">
            <div className="col" style={{margin: 0}}>
                <Outlet />
                <NavBar />
            </div>
        </div>
    )
}

export default DashboardLayout