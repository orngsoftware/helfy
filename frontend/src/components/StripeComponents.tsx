import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/apiClient";

export const SubscribeButton = (props: any) => {
    const { children, bgClass, errorNavigate} = props
    const navigate = useNavigate()
    
    async function handleUpgradeCheckout() {
        try {
            const apiResponse = await axiosInstance.post("/create-checkout-session")
            const sessionURL = apiResponse.data.session_url
            window.location.href = sessionURL

        } catch (error: any) {
            console.error(error)
            navigate(errorNavigate)
        }
    }
    return (
        <button className={`btn-primary ${bgClass ? bgClass : ""}`} onClick={handleUpgradeCheckout}>
            {children}
        </button>
    )
}