import { sessionInstances } from "@/axios/createInstance";
import { ISessionTypes, Session } from "@/types/sessionTypes";
import { IUserType } from "@/types/userTypes";
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
      const response = await sessionInstances.get(`/validate/${sessionCode}`);
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
  async getFilteredSessions(subject: string, date: string): Promise<Session[]> {
    try {
      const response = await sessionInstances.get(
        `/my-sessions/?subject=${subject}&date=${date}`
      );
      return response.data?.sessions;
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
      const errorMessage = err.response?.data?.error || "Adding Time Spend failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
