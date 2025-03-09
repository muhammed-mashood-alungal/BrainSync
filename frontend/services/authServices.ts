import { authInstance } from "@/axios/createInstance";
import { IuserLogin, IuserSignUp } from "@/types/userSignUp.types";
import { AxiosError } from "axios";

export const AuthServices = {
    registerService: async (data: IuserSignUp): Promise<{ status: number, message: string }> => {
        try {
            const response = await authInstance.post('/signup', data)
            return response.data
        } catch (error: unknown) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    loginService: async (data: IuserLogin): Promise<{ status: number, message: string }> => {
        try {
            const response = await authInstance.post('/signin', data)
            return response.data
        } catch (error: unknown) {
            console.log(error)
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    verifyOtp: async (email: string, otp: string): Promise<{ status: number, message: string }> => {
        try {
            const response = await authInstance.post('/verify-otp', { email, otp })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Verification failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    resendOtp: async (email: string): Promise<{ status: number, message: string }> => {
        try {
            const response = await authInstance.post('/resend-otp', { email })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Resending Otp failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    authMe: async (): Promise<{ id: string, email: string, role: string }> => {
        try {
            const response = await authInstance.post('/me')
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    googleAuth : async () : Promise<void> =>{
        try {
            window.location.href = "http://localhost:5000/api/auth/google";
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Google Auth failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    logout: async (): Promise<{ id: string, email: string, role: string }> => {
        try {
            console.log('inside ologu')
            const response = await authInstance.post('/logout')
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
            console.log(err)
            throw new Error(errorMessage)
        }
    }
}