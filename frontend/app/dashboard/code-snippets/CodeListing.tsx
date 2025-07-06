"use client";
import Table from "@/components/ui/table/Table";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { codeSnippetServices } from "@/services/client/codeSnippet";
import { ICodeSnippetTypes } from "@/types/codeSnippetTypes";
import { ISessionTypes } from "@/types/sessionTypes";
import { Language } from "@/context/codeEditor.context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

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
    URL.revokeObjectURL(link.href);
  };

  async function fetchMyCodes(
    currentPage: number,
    limit: number,
    searchQuery: string
  ) {
    const { snippets, count } = await codeSnippetServices.getMyCodes(
      searchQuery,
      (currentPage - 1) * limit,
      limit
    );
    setTotalCount(count);
    setSnippets(snippets);
  }

  const columns = [
    {
      key: "name" as keyof ICodeSnippetTypes,
      label: "Name",
      render: (code: ICodeSnippetTypes) => (
        <div className="flex items-center gap-2">
          <div className="text-teal-500">
            <FontAwesomeIcon icon={faCode} />
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
    },
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
