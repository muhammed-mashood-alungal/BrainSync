"use client";
import Table from "@/Components/Table/Table";
import { INoteTypes } from "@/types/note.types";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { noteServices } from "@/services/client/note.client";
import { Download } from "lucide-react";
import { codeEditorServices } from "@/services/client/code.client";
import { codeSnippetServices } from "@/services/client/codeSnippet";
import { ICodeSnippetTypes } from "@/types/codeSnippetTypes";
import { ISessionTypes } from "@/types/sessionTypes";
import { Language } from "@/Context/codeEditor.context";
function CodeSnippetListing() {
  const [snippets, setSnippets] = useState<ICodeSnippetTypes[]>([]);
  const limit = 8;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMyCodes(1, limit, "");
  }, []);

  const downloadSnippet = (snippet: {
    sourceCode: string;
    title: string;
    language: string;
  }) => {
    console.log('downloading')
    // Set extension based on language
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      c: "c",
      go: "go",
    };
  
    const extension = extensions[snippet.language as Language] || "txt";
    const filename = `${snippet.title || "code-snippet"}.${extension}`;
    const blob = new Blob([snippet.sourceCode], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    console.log('asdfasdfasdfasdfasdfasdf')
    URL.revokeObjectURL(link.href);
  };
  

  async function fetchMyCodes(
    currentPage: number,
    limit: number,
    searchQuery: string
  ) {
    console.log('fetchign')
    const { snippets, count } = await codeSnippetServices.getMyCodes(
      searchQuery,
      (currentPage - 1) * limit,
      limit
    );
    console.log('fetched')
    console.log(snippets , count)
    setTotalCount(count);
    setSnippets(snippets);
  }

//   const downloadPdf = (pdfFileId: string) => {
//     noteServices.getNotePdf(pdfFileId);
//   };

  const columns = [
    {
      key: "name" as keyof ICodeSnippetTypes,
      label: "Name",
      render: (code: ICodeSnippetTypes) => (
        <div className="flex items-center gap-2">
          <div className="text-teal-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-5 h-5"
            >
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
            </svg>
          </div>
          <span>{code.title}</span>
        </div>
      ),
    },
    {
      key: "sessionId" as keyof ICodeSnippetTypes,
      label: "Session",
      render: (code: ICodeSnippetTypes) =>
        (code?.sessionId as ISessionTypes)?.sessionName,
    },
    {
      key: "createdAt" as keyof ICodeSnippetTypes,
      label: "Saved On",
      render: (code: ICodeSnippetTypes) => {
        const date = new Date(code.createdAt as Date);
        return format(new Date(date), "MMM d 'at' h:mma");
      },
    }
  ];

  // Actions for each row (optional)
  const actions = (code: ICodeSnippetTypes) => (
    <div className="flex space-x-2 justify-center">
      <button
        className="text-cyan-500 hover:text-cyan-700 flex"
        onClick={() => downloadSnippet(code)}
      >
        <Download className="mr-2" /> download
      </button>
    </div>
  );

  return (
    <>
      <Table
        data={snippets}
        columns={columns}
        actions={actions}
        onPageChange={(
          page: number,
          limit: number,
          searchQuery: string | undefined
        ) => fetchMyCodes(page, limit, searchQuery as string)}
        totalCount={totalCount}
      />
    </>
  );
}

export default CodeSnippetListing;
