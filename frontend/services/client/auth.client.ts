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
            
            return response.data?.tokens
        } catch (error: unknown) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    verifyOtp: async (email: string, otp: string): Promise<{ status: number, message: string }> => {
        try {
            const response = await authInstance.post('/verify-otp', { email, otp })
            return response.data?.tokens
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
    authMe: async (): Promise<{ id: string, email: string, role: string , isPremiumMember : boolean , profilePicture : string , username :string}> => {
        try {
            const response = await authInstance.post('/me')
            return response.data?.user
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    verifyToken: async (token: string): Promise<{ id: string, email: string, role: string } | null> => {
        try {
            const response = await authInstance.post('/verify-token', {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
            return response.data.user
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Failed. Please try again.";
            return null
        }
    },
    refreshToken: async (token: string): Promise<{ id: string, email: string, role: string } | null> => {
        try {
            const response = await authInstance.post('/refresh-token', {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
            return response.data?.user
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Failed. Please try again.";
            return null
        }
    },
    googleAuth: async (): Promise<void> => {
        try {
            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Google Auth failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    forgotPassword: async (email: string): Promise<{ status: number, message: string }> => {
        try {
            const response = await authInstance.post('/forgot-password', { email })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Sending Reset Link failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    logout: async (): Promise<{ id: string, email: string, role: string }> => {
        try {
            const response = await authInstance.post('/logout')
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Logout failed. Please try again.";
            throw new Error(errorMessage)
        }
    },
    resetPassword: async (token: string, password: string): Promise<{ status: number, mesasge: string }> => {
        try {
            const response = await authInstance.post('/reset-password', { token, password })
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data?.error || "Reset Password failed. Please try again.";
            throw new Error(errorMessage)
        }
    }
}  