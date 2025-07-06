"use client";
import Table from "@/components/ui/table/Table";
import { INoteTypes } from "@/types/note.types";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { noteServices } from "@/services/client/note.client";
import { Download } from "lucide-react";
function NoteListing() {
  const [notes, setNotes] = useState<INoteTypes[]>([]);
  const limit = 8;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchMyNotes(1, limit, "");
  }, []);

  async function fetchMyNotes(
    currentPage: number,
    limit: number,
    searchQuery: string
  ) {
    const { notes, count } = await noteServices.myNotes(
      searchQuery,
      (currentPage - 1) * limit,
      limit
    );
    setTotalCount(count);
    setNotes(notes);
  }

  const downloadPdf = (pdfFileId: string) => {
    noteServices.getNotePdf(pdfFileId);
  };

  const columns = [
    {
      key: "name" as keyof INoteTypes,
      label: "Name",
      render: (note: INoteTypes) => (
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
          <span>{note.noteName}</span>
        </div>
      ),
    },
    {
      key: "updatedAt" as keyof INoteTypes,
      label: "Date Edited",
      render: (note: INoteTypes) => {
        const date = new Date(note.updatedAt as Date);
        return format(new Date(date), "MMM d 'at' h:mma");
      },
    },
    {
      key: "sessionId" as keyof INoteTypes,
      label: "Session",
      render: (note: INoteTypes) => note.sessionId.sessionName,
    },
    {
      key: "userId" as keyof INoteTypes,
      label: "Subject",
      render: (note: INoteTypes) => note.sessionId.subject,
    },
  ];

  // Actions for each row (optional)
  const actions = (note: INoteTypes) => (
    <div className="flex space-x-2 justify-center">
      <button
        className="text-cyan-500 hover:text-cyan-700 flex"
        onClick={() => downloadPdf(note.pdfFileId)}
      >
        <Download className="mr-2" /> Download
      </button>
    </div>
  );

  return (
    <>
      <Table
        data={notes}
        columns={columns}
        actions={actions}
        onPageChange={(
          page: number,
          limit: number,
          searchQuery: string | undefined
        ) => fetchMyNotes(page, limit, searchQuery as string)}
        totalCount={totalCount}
      />
    </>
  );
}

export default NoteListing;
