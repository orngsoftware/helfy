import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "./tokenManager";

const authAxios= axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

const axiosInstance= axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let requestsQueue: ((token: string | null) => void)[] = []
let isRequestInProgress = false
let refreshPromise = null

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            if (!isRequestInProgress) {
                isRequestInProgress = true
                refreshPromise = authAxios.post("/auth/token/refresh")
                .then(res => {
                    const newToken = res.data.token.access_token
                    setAccessToken(newToken)

                    requestsQueue.forEach(callback => callback(newToken))
                    requestsQueue = []
                })
                .catch(err => {
                    requestsQueue = []
                    clearAccessToken()
                    console.log("Token refresh error: ", err)
                    window.location.href = "/log-in"
                })
                .finally(() => {
                    isRequestInProgress = false
                    refreshPromise = null
                })
            }
            return new Promise((resolve, reject) => {
                requestsQueue.push((newToken) => {
                    if (newToken) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                        resolve(axiosInstance(originalRequest))
                    } else {
                        reject(error)
                    }
                })
            })
        }
        return Promise.reject(error)
    }
);

export default axiosInstance;