import { useNavigate, useSearchParams } from "react-router-dom"
import { authAxios } from "../lib/apiClient"
import { setAccessToken } from "../lib/tokenManager"
import Loading from "../components/Loading"

const AuthGoogle = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const code = searchParams.get("code")
    const navigate = useNavigate()

    async function callback() {
        try {
            const response = await authAxios.post("/auth/google/callback", { code: code})
            setAccessToken(response.data.token.access_token)
            navigate("/plans")
        } catch(error: any) {
            console.error("Google callback error: ", error)
        }
        return;
    }

    if (code) {
        callback()
    } else {
        console.error("No code was provided")
    }

    return <Loading />
}

export default AuthGoogle