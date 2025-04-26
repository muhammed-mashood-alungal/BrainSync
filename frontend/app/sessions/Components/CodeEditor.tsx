import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  faGolang,
  faJava,
  faJs,
  faPython,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faC } from "@fortawesome/free-solid-svg-icons";
import { Lock } from "lucide-react";
import { useCodeEditor } from "@/Context/codeEditor.context";
import BaseModal from "@/Components/Modal/Modal";
import Input from "@/Components/Input/Input";
import { toast } from "react-toastify";
import { codeSnippetServices } from "@/services/client/codeSnippet";
import { useAuth } from "@/Context/auth.context";
import Link from "next/link";
function CodeEditor({ roomId }: { roomId: string }) {
  const {
    language,
    isError,
   // isLocked,
   // lockCode,
   // lockedBy,
    output,
   // setIsError,
    onCodeChange,
  //  unLockCode,
    //writer,
   // setOutput,
    value,
   // setValue,
    onMount,
    onSelect,
    runCode,
    onClearOutput,
  } = useCodeEditor();
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setSetTitleError] = useState("");
  const { user } = useAuth();
  type Language = "javascript" | "python" | "java" | "c" | "go";

 
  const isValidFileName = (name: string) => {
    const invalidChars = /[\\\/:*?"<>|]/;
    return !invalidChars.test(name.trim()) && name.trim().length > 0;
  };

  const saveNote = async () => {
    try {
      setTitle("");

      if (!isValidFileName(title)) {
        return setSetTitleError("Please Enter a valid Title");
      }
      await codeSnippetServices.saveCode({
        title,
        language,
        sourceCode: value,
        sessionId: roomId,
      });
      toast.success("Code Saved Successfully");
      setIsTitleModalOpen(false);
    } catch (error: unknown) {
      setSetTitleError((error as Error).message || "Something Went Wrong");
    }
  };

  const CODE_SNIPPETS: Record<Language, string> = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Javascript");\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Python")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    c: `\n#include <stdio.h>\n\nvoid greet(const char *name) {\n\tprintf("Hello, %s!\\n", name);\n}\n\nint main() {\n\tgreet("C");\n\treturn 0;\n}\n`,
    go: `\npackage main\n\nimport "fmt"\n\nfunc greet(name string) {\n\tfmt.Println("Hello, " + name + "!")\n}\n\nfunc main() {\n\tgreet("Golang")\n}\n`,
  };

  return (
    <>
      {user?.isPremiumMember ? (
        <>
          <div className={`z-10 flex  flex-col`}>
            <button
              className={`m-1 hover:cursor-pointer ${
                language == "javascript" && "text-cyan-400"
              } `}
              onClick={() => {
                onSelect("javascript");
              }}
            >
              <FontAwesomeIcon icon={faJs} size="xl" />
            </button>
            <button
              className={`m-1 hover:cursor-pointer ${
                language == "python" && "text-cyan-400"
              } `}
              onClick={() => {
                onSelect("python");
              }}
            >
              <FontAwesomeIcon icon={faPython} size="xl" />
            </button>
            <button
              className={`m-1 hover:cursor-pointer ${
                language == "go" && "text-cyan-400"
              } `}
              onClick={() => {
                onSelect("go");
              }}
            >
              <FontAwesomeIcon icon={faGolang} size="xl" />
            </button>
            <button
              className={`m-1 hover:cursor-pointer ${
                language == "c" && "text-cyan-400"
              } `}
              onClick={() => {
                onSelect("c");
              }}
            >
              <FontAwesomeIcon icon={faC} size="xl" />
            </button>
            <button
              className={`m-1 hover:cursor-pointer ${
                language == "java" && "text-cyan-400"
              } `}
              onClick={() => {
                onSelect("java");
              }}
            >
              <FontAwesomeIcon icon={faJava} size="xl" />
            </button>
          </div>

          <div className="flex w-full h-full">
            <div className="w-1/2 not-first:h-full">
              <Editor
                className="rounded-lg"
                height="100%"
                width={"100%"}
                defaultLanguage={language}
                onMount={onMount}
                defaultValue={CODE_SNIPPETS[language as Language]}
                theme="vs-dark"
                value={value}
                onChange={(value) => onCodeChange(value as string)}
                language={language}
              />
            </div>

            <div className="w-1/2 flex flex-col ">
              <div className="flex justify-between">
                <button
                  className="px-4 py-2 m-2 border-2 rounded-4xl border-cyan-400 text-cyan-400
            hover:cursor-pointer hover:text-cyan-600
            "
                  onClick={runCode}
                >
                  Run
                </button>
                <div>
                  <button
                    className="px-4 py-2 m-2 border-2 rounded-4xl border-gray-400 text-gray-400
            hover:cursor-pointer hover:text-gray-600
            "
                    onClick={onClearOutput}
                  >
                    Clear
                  </button>
                  <button
                    className="px-4 py-2 m-2 border-2 rounded-4xl border-cyan-400 text-cyan-400
            hover:cursor-pointer hover:text-cyan-600
            "
                    onClick={() => setIsTitleModalOpen(true)}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div
                className={` flex-1 overflow-auto p-2 rounded border ${
                  isError
                    ? "text-red-400 border-red-500"
                    : "text-white border-[#333]"
                }`}
              >
                {output && output.length > 0 ? (
                  output.map((line, i) => <p key={i}>{line}</p>)
                ) : (
                  <p className="text-gray-600">
                    Click &quot;Run Code&quot; to see the output here
                  </p>
                )}
              </div>
            </div>
          </div>

          <BaseModal
            isOpen={isTitleModalOpen}
            onClose={() => setIsTitleModalOpen(false)}
            title="Enter a Name For Your Code Snippet"
            onSubmit={saveNote}
            submitText="Save Code"
          >
            <Input
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Enter a title"
              type="text"
            />
            <span className="text-red-600 ml-1"> {titleError}</span>
          </BaseModal>
        </>
      ) : (
        <div className="flex flex-col items-center ">
          <Lock/>
          <div className="align-middle text-center">
          Please purchase a subscription to unlock the Code Editor. <br />
          Collaborate in real-time, write and share code snippets with your group—right inside the app.
          </div>
          <Link href="/premium-plans" className="flex-1">
            <button className=" bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-300">
              Explore Premium Plans
            </button>
          </Link>
        </div>
      )}
    </>
  );
}

export default CodeEditor;
