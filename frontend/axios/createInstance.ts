import axios from "axios"
import { redirect } from "next/navigation";
export const authInstance = axios.create({
    baseURL : "http://localhost:5000/api/auth/",
    withCredentials :true
})

authInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            redirect('/login')
        }
        return Promise.reject(error)
    }
);