import { codeSnippetInstances } from "@/axios/instance.axios";
import { ICodeSnippetTypes } from "@/types/codeSnippetTypes";
import { AxiosError } from "axios";

export const codeSnippetServices = {
  saveCode: async (
    codeData: Partial<ICodeSnippetTypes>
  ): Promise<ICodeSnippetTypes | undefined> => {
    try {
      const response = await codeSnippetInstances.post("/save", {
        codeData: codeData,
      });
      return response.data.newCodeData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Saving Code failed. Please try again.";
      throw new Error(errorMessage);
    }
  },
  getMyCodes: async (
    searchQuery: string,
    skip: number,
    limit: number
  ): Promise<{ snippets: ICodeSnippetTypes[]; count: number }> => {
    try {
      const response = await codeSnippetInstances.get(
        `/user-code-snippets?searchQuery=${searchQuery}&skip=${skip}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Something Went Wrong While Saving Code");
    }
  },
};
