import { pistonInstances } from "@/axios/createInstance";
import axios from "axios";

interface Runtime {
  language: string;
  version: string;
  aliases: string[];
}

export const codeEditorServices = {
  fetchSpecificRuntimes: async (language : string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_PISTON_API}/runtimes`
      );
      const allRuntimes = response.data;
      const langRunTime = allRuntimes.find((runtime : any )=> runtime.language === language);
      return langRunTime ? langRunTime.version : null;
    } catch (error) {
      console.error("Error fetching runtimes:", error);
      return [];
    }
  },
  runCode: async (
    language: string,
    sourceCode: string
  ): Promise<{ run: any }> => {
    try {
      const version =await codeEditorServices.fetchSpecificRuntimes(language)
      console.log(language, sourceCode , version);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PISTON_API}/execute`,
        {
          language: language,
          version: version,
          files: [
            {
              content: sourceCode,
            },
          ],
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw Error("Something Went Wrong Please Try Again");
    }
  },
};
