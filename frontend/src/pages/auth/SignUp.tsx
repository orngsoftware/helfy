import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/apiClient";
import Divider from "../../components/Divider";
import { setAccessToken } from "../../lib/tokenManager";
import { continueWithGoogle } from "./LogIn";

export default function SignUpForm () {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");

    const [type, setType] = useState('password');
    const navigate = useNavigate()

    function handleChange(e: any) {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/auth/sign-up", formData)
            const result = await response.data;
            setMessage(result.msg);
            setAccessToken(result.token.access_token)
            navigate("/plans")

        } catch(error: any) {
            if (error.response?.status === 400) {
                setMessage("Account with this email already exists.")
            } else {
                setMessage("500, Error connecting to the server")
            }   
        }
    }

    function handleToggle() {
        if (type === "password") {
            setType('text');
        } else {
            setType('password')
        }
    }

    return (
        <div className="container" style={{backgroundColor: "white"}}>
            <div className='col' style={{marginTop: 50}}>
                <h1 style={{margin: "0px 0px 25px 5px"}}>let's <span className="pixel-sans">start</span> health.</h1>
                <button onClick={continueWithGoogle} className="btn-primary btn-outline"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>Continue with Google</button>
                <Divider text="or" color="var(--grey-color)" />
                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <p className="sm-heading">Email address</p>
                        <input
                            className='auth-input'
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            style={{border: "2px solid var(--grey-color)"}}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <p className="sm-heading">Set password</p>
                        <input
                            className='auth-input'
                            type={type}
                            name="password"
                            id="psw-input"
                            placeholder="Enter password"
                            value={formData.password}
                            style={{border: "2px solid var(--grey-color)"}}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <span style={{fontSize: 14}}>
                        <input type="checkbox" onClick={handleToggle}/>
                        Show password
                    </span>
                    <button type="submit" className='btn-primary'>Sign up</button>
                    <p>Have an account? <Link to="/log-in">Log in instead</Link></p>
                    {message && <p className='msg'>{message}</p>}
                </form>
            </div>
        </div>
    );
}
