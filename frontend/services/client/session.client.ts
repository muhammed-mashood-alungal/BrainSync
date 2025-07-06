import { sessionInstances } from "@/axios/instance.axios";
import { ISessionTypes, Session } from "@/types/sessionTypes";

import { AxiosError } from "axios";

export const SessionServices = {
  async createSession(formData: Partial<ISessionTypes>): Promise<Session> {
    try {
      const response = await sessionInstances.post("/create", formData);
      return response.data?.newSession;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async validateSession(
    sessionCode: string
  ): Promise<{ status: boolean; message: string }> {
    try {
      console.log("This is fething");
      const response = await sessionInstances.get(`/validate/${sessionCode}`);
      console.log(response.data.result);
      return response.data.result;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async updateSession(
    formData: Partial<ISessionTypes>,
    sessionId: string
  ): Promise<Session> {
    try {
      const response = await sessionInstances.put(
        `/update/${sessionId}`,
        formData
      );
      return response.data?.updatedSession;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async getFilteredSessions(
    searchQuery: string,
    subject: string,
    startDate: string | null,
    endDate: string | null,
    sort: number,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; count: number }> {
    try {
      const response = await sessionInstances.get(
        `/my-sessions/?searchQuery=${searchQuery}&subject=${subject}&startDate=${startDate}&endDate=${endDate}&sort=${sort}&skip=${skip}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async getAllSessions(
    searchQuery: string,
    subject: string,
    startDate: string | null,
    endDate: string | null,
    sort: number,
    skip: number,
    limit: number
  ): Promise<{ sessions: Session[]; count: number }> {
    try {
      const response = await sessionInstances.get(
        `/?searchQuery=${searchQuery}&subject=${subject}&startDate=${startDate}&endDate=${endDate}&sort=${sort}&skip=${skip}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Group Creation failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async stopSession(sessionId: string): Promise<Session[]> {
    try {
      const response = await sessionInstances.post(
        `/stop-session/${sessionId}`
      );
      return response.data?.sessions;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Stop Session failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async addSessionTimeSpendByUser(
    sessionCode: string,
    duration: number,
    log: { joinTime: Date; leaveTime: Date; duration: number }
  ): Promise<void> {
    try {
      const response = await sessionInstances.put(
        `/add-session-activity/${sessionCode}`,
        { duration, log }
      );
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Adding Time Spend failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  async downloadSessionReport(sessionId: string): Promise<boolean> {
    try {
      const response = await sessionInstances.get(`/${sessionId}/report`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${sessionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
