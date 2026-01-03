import { useNavigate } from "react-router-dom"
import { TickIcon } from "../../components/Icons"
import { SubscribeButton } from "../../components/StripeComponents"

const PricingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="col center-align no-max-width" style={{margin: "125px 0px 50px"}}>
            <h1>Choose Your Plan</h1>
            <p className="grey-subtext" style={{maxWidth: 500 , textAlign: "center", marginBottom: 25}}>Unlock all features and unlimited use of the application to improve your health even cooler</p>
            <div className="row-landing" style={{gap: 25}}>
                <div className="card" style={{maxWidth: 350, padding: 15, gap: 10}}>
                    <div className="col" style={{margin: 0}}>
                        <h2>Basic</h2>
                        <p className="grey-subtext" style={{maxWidth: 300}}>Perfect for those who want to kickstart their health improvement journey in one area.</p>
                    </div>
                    <div className="icon-row">
                    <h2>€0</h2>
                    <p className="grey-subtext">per month.</p>
                    </div>
                    <div className="col">
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="var(--black-color)" height={25} width={25} />
                            <p>1 health area/plan</p>
                        </div>
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="var(--black-color)" height={25} width={25} />
                            <p>14 days of use</p>
                        </div>
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="var(--black-color)" height={25} width={25} />
                            <p>Gamified features</p>
                        </div>
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="var(--black-color)" height={25} width={25} />
                            <p>Learns, Tasks and Habits</p>
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => navigate("/sign-up")}>Get Started</button>
                </div>
                <div className="card upgrade-bg" style={{maxWidth: 350, padding: 15, gap: 10}}>
                    <div className="col" style={{margin: 0}}>
                        <h2>Plus</h2>
                        <p>Perfect for those who want to take their health improvement to different areas without any limitations.</p>
                    </div>
                    <div className="icon-row">
                    <h2>€15</h2>
                    <p>per month.</p>
                    </div>
                    <div className="col">
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="white" height={25} width={25} />
                            <p>Unlimited areas/plans</p>
                        </div>
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="white" height={25} width={25} />
                            <p>Unlimited use</p>
                        </div>
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="white" height={25} width={25} />
                            <p>Gamified features</p>
                        </div>
                        <div className="icon-row" style={{gap: 5}}>
                            <TickIcon color="white" height={25} width={25} />
                            <p>Personal support</p>
                        </div>
                    </div>
                    <SubscribeButton errorNavigate="/">Upgrade to Helfy Plus</SubscribeButton>
                </div>
            </div>
        </div>
    )
}

export default PricingPage