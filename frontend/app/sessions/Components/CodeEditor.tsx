import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  faGolang,
  faJava,
  faJs,
  faPython,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faC } from "@fortawesome/free-solid-svg-icons";
import { Langar } from "next/font/google";
import { Code } from "lucide-react";
import { pistonInstances } from "@/axios/createInstance";
import { codeEditorServices } from "@/services/client/code.client";
import { useCodeEditor } from "@/Context/codeEditor.context";
function CodeEditor() {
  
  const {
    language,
    isError,
    isLocked,
    lockCode,
    lockedBy,
    output,
    setIsError,
    onCodeChange,
    unLockCode,
    writer,
    setOutput,
    value,
    setValue,
    onMount,
    onSelect,
    runCode,
    onClearOutput
  } = useCodeEditor();
  // const [language, setLanguage] = useState<Language>("javascript");
  // const [output, setOutput] = useState([]);
  //  const [isError, setIsError] = useState(false);
  type Language = "javascript" | "python" | "java" | "c" | "go";

  const langauges = ["javascript", "python", "java", "c", "go"];
  const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    python: "3.10.0",
    java: "15.0.2",
    c: "10.2.0",
    go: "1.16.2",
  };

  const CODE_SNIPPETS: Record<Language, string> = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Javascript");\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Python")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    c: `\n#include <stdio.h>\n\nvoid greet(const char *name) {\n\tprintf("Hello, %s!\\n", name);\n}\n\nint main() {\n\tgreet("C");\n\treturn 0;\n}\n`,
    go: `\npackage main\n\nimport "fmt"\n\nfunc greet(name string) {\n\tfmt.Println("Hello, " + name + "!")\n}\n\nfunc main() {\n\tgreet("Golang")\n}\n`,
  };

//   const [value, setValue] = useState<string | undefined>(
//     CODE_SNIPPETS["javascript"]
//   );

 
  return (
    <>
      <div className=" z-10 flex  flex-col">
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
                onClick={runCode}
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
                Click "Run Code" to see the output here
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
