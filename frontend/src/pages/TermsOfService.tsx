import { Link } from "react-router-dom";

const TermsOfService = () => {
    return (
        <div className="container">
            <div className="col center-align no-max-width" style={{margin: "50px 0px"}}>
                <h1>Terms of Service</h1>
                <div className="card" style={{maxWidth: 750, marginTop: 25}}>
                    <p style={{maxWidth: 750}}>Welcome to Helfy. By accessing or using our web application (“Service”), you agree to the following Terms of Service.
                        <ul>
                            <li>You must be 14 years old or have permission from a legal guardian to use this service.</li>
                            <li>You agree to provide accurate information when registering.</li>
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                        </ul>
                    </p>
                    <h3 className="sm-heading" style={{marginLeft: 5}}>Restrictions</h3>
                    <p style={{maxWidth: 750}}>
                        You agree <span style={{fontWeight: "bold"}}>not to:</span>
                        <ul>
                            <li>Use the app for illegal or unauthorised purposes</li>
                            <li>Attempt to reverse-engineer the service</li>
                            <li>Interfere with other users or the app's functioning</li>
                        </ul>
                        We reserve the right to suspend or terminate your access to the app if you violate these terms or misuse the service.
                    </p>
                    <h3 className="sm-heading" style={{marginLeft: 5}}>Not a medical advice</h3>
                    <p style={{maxWidth: 750, borderBottom: "2px solid var(--grey-color)", paddingBottom: 10}}>
                        Helfy provides information for general wellness and habit improvement purposes.  
                        <span style={{fontWeight: "bold"}}> It is not a substitute</span> for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p style={{maxWidth: 750}}>
                        These terms are governed by the laws of Latvia. Any disputes will be resolved under Latvian jurisdiction.
                        For any legal or support questions, please contact: <Link to="mailto: while.no.helf@gmail.com" target="_blank">while.no.helf@gmail.com</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default TermsOfService;