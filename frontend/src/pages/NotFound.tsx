import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="container" style={{backgroundColor: "var(--orange-color)"}}>
            <div className="col center">
                <h2>Error 404</h2>
                <p>The page you were looking for doesn't exist</p>
                <button style={{marginTop: 25}} className="btn-primary" onClick={() => navigate(-1)}>Go back</button>
            </div>
        </div>
    )
}

export default NotFound;