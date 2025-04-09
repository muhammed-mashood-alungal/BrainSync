import { reportInsances } from "@/axios/createInstance"
import { AxiosError } from "axios"

export const reportService = {
    reportSession: async (data: any) => {
        try {
            const response = await reportInsances.post(`/report-session`, { data })
            return response.data.report
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Failed to get initial Note content. Please try again."
            throw new Error(errorMessage)
        }
    },
    getAllReports :async (status :string, skip : number , limit : number) => {
        try {
            const response = await reportInsances.get(`/all-reports?status=${status}&skip=${skip}&limit=${limit}`)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Failed to get initial Note content. Please try again."
            throw new Error(errorMessage)
        }
    },
    resolve:async (reportId :string) => {
        try {
            const response = await reportInsances.put(`/resolve-session-report/${reportId}`)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Failed to get initial Note content. Please try again."
            throw new Error(errorMessage)
        }
    },
    closeReport:async (reportId :string) => {
        try {
            const response = await reportInsances.put(`/close-session-report/${reportId}`)
            return response.data
        } catch (error) {
            const err = error as AxiosError<{ error: string }>
            const errorMessage = err.response?.data?.error || "Failed to get initial Note content. Please try again."
            throw new Error(errorMessage)
        }
    } 
}