import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSocket } from "./socket.context";
import { codeEditorServices } from "@/services/client/code.client";
import { codeSnippetServices } from "@/services/client/codeSnippet";
import { toast } from "react-hot-toast";
import { useAuth } from "./auth.context";
import { CODE_SNIPPETS } from "@/constants/codeEditor/codeSnippet.constants";
import { CODE_EDITOR_MESSAGES } from "@/constants/messages/codeEditor.messages";
import { COMMON_MESSAGES } from "@/constants/messages/common.messages";

export type Language = "javascript" | "python" | "java" | "c" | "go";

interface CodeEditorProvider {
  language: string;
  writer: string;
  output: string[];
  isLocked: boolean;
  lockedBy: string;
  lockCode: (lockedBy: string) => void;
  unLockCode: (userId: string) => void;
  isError: boolean;
  setIsError: (state: boolean) => void;
  setOutput: Dispatch<SetStateAction<string[]>>;
  value: string | undefined;
  onSelect: (language: Language) => void;
  runCode: () => void;
  onMount: (editor: any) => void;
  setValue: (value: string) => void;
  onCodeChange: (code: string, writer: string) => void;
  onClearOutput: () => void;
  saveNote: (title: string) => void;
}
const codeEditorContext = createContext<CodeEditorProvider | undefined>(
  undefined
);

export const CodeEditorProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();

  const editorRef = useRef<any>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const [writer, setWriter] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState("");
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();
  const [value, setValue] = useState<string | undefined>(
    CODE_SNIPPETS["javascript"]
  );

  useEffect(() => {
    if (!socket) return;
    socket?.on("change-language", (language: Language) => {
      setLanguage(language);
      setValue(CODE_SNIPPETS[language]);
    });

    socket.on("writing", (writer) => {
      setWriter(writer);
    });
    socket.on("source-code", (sourceCode, writer) => {
      setWriter(writer);
      setTimeout(() => {
        setWriter("");
      }, 1000);
      setValue(sourceCode);
    });

    socket.on("output", (output, isError) => {
      setOutput(output);
      setIsError(isError);
    });

    socket.on("code-locked", (lockedBy) => {
      setLockedBy(lockedBy);
      setIsLocked(true);
    });
    socket.on("code-unlocked", () => {
      setLockedBy("");
      setIsLocked(false);
    });
    console.log("scoket setted");
  }, [socket]);

  const lockCode = (lockedBy: string) => {
    setIsLocked(true);
    setLockedBy(lockedBy);
    socket?.emit("code-locked", { lockedBy });
  };
  const unLockCode = (unlockingUser: string) => {
    if (unlockingUser != lockedBy) return;
    setIsLocked(false);
    setLockedBy("");
    socket?.emit("code-unlocked");
  };

  const onCodeChange = (code: string, writer: string) => {
    console.log(code);
    if (isLocked && user?.id != lockedBy) {
      return;
    }
    setValue(code);
    socket?.emit("source-code", { code, writer: writer });
  };

  const runCode = async () => {
    if (isLocked && writer != lockedBy) {
      return;
    }
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      return;
    }
    const { run: result } = await codeEditorServices.runCode(
      language,
      sourceCode
    );
    const out = result?.output?.split("\n");
    setOutput(out);

    if (result.stderr) {
      socket?.emit("output", { output: out, isError: true });
      setIsError(true);
    } else {
      socket?.emit("output", { output: out, isError: false });
      setIsError(false);
    }
  };

  const onClearOutput = () => {
    if (isLocked && writer != lockedBy) {
      return;
    }
    setOutput([]);
    setIsError(false);
    socket?.emit("output", { output: [], isError: false });
  };

  const saveNote = async (title: string) => {
    try {
      const result = await codeSnippetServices.saveCode({
        title,
        language,
        sourceCode: value,
      });
      toast.success(CODE_EDITOR_MESSAGES.CODE_SAVED_SUCCESSFULLY);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED
      );
    }
  };

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };
  const onSelect = (language: Language) => {
    if (isLocked && user?.id != lockedBy) {
      return;
    }
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    socket?.emit("change-language", { language });
  };

  return (
    <codeEditorContext.Provider
      value={{
        saveNote,
        onClearOutput,
        onSelect,
        onMount,
        runCode,
        setOutput,
        lockCode,
        unLockCode,
        isLocked,
        language,
        output,
        onCodeChange,
        writer,
        lockedBy,
        isError,
        setIsError,
        value,
        setValue,
      }}
    >
      {children}
    </codeEditorContext.Provider>
  );
};

export const useCodeEditor = () => {
  const context = useContext(codeEditorContext);
  if (!context) {
    throw Error("Please Use the context after wrapping it!");
  }
  return context;
};
