import { noteInstances } from "@/axios/instance.axios";
import { INoteTypes } from "@/types/note.types";
import { AxiosError } from "axios";

export const noteServices = {
  writeNote: async (
    roomId: string,
    userId: string,
    content: string
  ): Promise<boolean> => {
    try {
      const response = await noteInstances.post(`/write/${roomId}/${userId}`, {
        content,
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  saveNote: async (
    roomId: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await noteInstances.post(`/save/${roomId}`);
      let status = response?.data?.status;
      return {
        success: status,
        message: status ? "Note Saved To Resources" : "",
      };
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      return { success: false, message: errorMessage };
    }
  },
  getInitialContent: async (roomId: string): Promise<string> => {
    try {
      const response = await noteInstances.get(`/initial-content/${roomId}`);
      return response?.data?.content;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error ||
        "Failed to get initial Note content. Please try again.";
      throw new Error(errorMessage);
    }
  },
  myNotes: async (searchQuery: string, skip: number, limit: number) => {
    try {
      const response = await noteInstances.get(
        `/my-notes?searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`
      );
      return response?.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getNotePdf: async (pdfFileId: string): Promise<void> => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/pdf/${pdfFileId}`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `note-${pdfFileId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Note Saving failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
};
