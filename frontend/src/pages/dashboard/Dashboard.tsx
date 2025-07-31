import Learn from "../../components/Learn";
import Streak from "../../components/Streak";
import Tasks from "../../components/Tasks";

const Dashboard = () => {
    return (
        <div className="container">
            <div className="col">
                <div className="to-right" style={{marginRight: 15}}>
                    <Streak size="14" />
                </div>
                <h3 style={{marginBottom: 15, marginTop: 0}}>Learn</h3>
                <Learn />
                <h3 style={{marginBottom: 15, marginTop: 25}}>Take action today</h3>
                <Tasks />
            </div>
        </div>
    )
}

export default Dashboard