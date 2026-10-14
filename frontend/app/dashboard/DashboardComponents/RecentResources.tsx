"use client";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Download, FileText } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { noteServices } from "@/services/client/note.client";
import { codeSnippetServices } from "@/services/client/codeSnippet";
import { INoteTypes } from "@/types/note.types";
import { ICodeSnippetTypes } from "@/types/codeSnippetTypes";
import { ISessionTypes } from "@/types/sessionTypes";
import { downloadCodeSnippet } from "@/utils/download.util";

const RECENT_LIMIT = 5;

interface RecentItem {
  key: string;
  title: string;
  subtitle: string;
  date?: Date;
  onDownload: () => void;
}

const timeAgo = (date?: Date) =>
  date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : "";

function RecentCard({
  title,
  viewAllHref,
  icon,
  items,
  loading,
  emptyMessage,
}: {
  title: string;
  viewAllHref: string;
  icon: ReactNode;
  items: RecentItem[];
  loading: boolean;
  emptyMessage: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-5 flex flex-col">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link
          href={viewAllHref}
          className="flex items-center text-sm text-[#00D2D9] hover:text-cyan-300 transition-colors"
        >
          View all
          <ChevronRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gray-700 rounded-md" />
              <div className="flex-1">
                <div className="h-3 w-2/3 bg-gray-700 rounded mb-2" />
                <div className="h-2 w-1/3 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-400">
          <div className="mb-3 text-gray-500 text-3xl">{icon}</div>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="-mx-2">
          {items.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={item.onDownload}
                aria-label={`Download ${item.title}`}
                title="Download"
                className="group w-full flex items-center gap-3 px-2 py-2 rounded-md text-left hover:bg-gray-700/50 hover:cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#00D2D9]"
              >
                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-md bg-gray-900 text-[#00D2D9]">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {item.subtitle}
                    {item.date && ` · ${timeAgo(item.date)}`}
                  </p>
                </div>
                <span className="shrink-0 p-2 rounded-md text-gray-400 group-hover:text-[#00D2D9] group-hover:bg-gray-800 transition-colors">
                  <Download size={16} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RecentNotes() {
  const [notes, setNotes] = useState<INoteTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { notes } = await noteServices.myNotes("", 0, RECENT_LIMIT);
        setNotes(notes ?? []);
      } catch {
        setNotes([]);
      }
      setLoading(false);
    };
    fetchNotes();
  }, []);

  return (
    <RecentCard
      title="Recent Notes"
      viewAllHref="/dashboard/notes"
      icon={<FileText size={18} />}
      loading={loading}
      emptyMessage="Notes you save in sessions will show up here."
      items={notes.map((note) => ({
        key: note.pdfFileId,
        title: note.noteName || "Untitled note",
        subtitle: note.sessionId?.sessionName ?? "",
        date: note.updatedAt ?? note.createdAt,
        onDownload: () => noteServices.getNotePdf(note.pdfFileId),
      }))}
    />
  );
}

export function RecentSnippets() {
  const [snippets, setSnippets] = useState<ICodeSnippetTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const { snippets } = await codeSnippetServices.getMyCodes(
          "",
          0,
          RECENT_LIMIT
        );
        setSnippets(snippets ?? []);
      } catch {
        setSnippets([]);
      }
      setLoading(false);
    };
    fetchSnippets();
  }, []);

  return (
    <RecentCard
      title="Recent Code Snippets"
      viewAllHref="/dashboard/code-snippets"
      icon={<FontAwesomeIcon icon={faCode} />}
      loading={loading}
      emptyMessage="Code you save from the session editor will show up here."
      items={snippets.map((snippet, index) => ({
        key: `${snippet.title}-${index}`,
        title: snippet.title || "Untitled snippet",
        subtitle: [
          snippet.language,
          (snippet.sessionId as ISessionTypes)?.sessionName,
        ]
          .filter(Boolean)
          .join(" · "),
        date: snippet.createdAt,
        onDownload: () => downloadCodeSnippet(snippet),
      }))}
    />
  );
}
