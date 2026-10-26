"use client";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import Dropdown from "@/components/ui/dropdown/Dropdown";
import { UserServices } from "@/services/client/user.client";
import { ISubjectStudyTime } from "@/types/userTypes";
import { formatDuration } from "@/utils/time.util";

// Past this many subjects, the rest are folded into "Other"
const MAX_SUBJECTS = 5;

const filterOptions = [
  { value: "Weekly", label: "This week" },
  { value: "Monthly", label: "This month" },
  { value: "Yearly", label: "This year" },
  { value: "All", label: "All time" },
];

interface SubjectRow extends ISubjectStudyTime {
  isOther?: boolean;
}

const toRows = (subjects: ISubjectStudyTime[]): SubjectRow[] => {
  if (subjects.length <= MAX_SUBJECTS + 1) return subjects;

  const rest = subjects.slice(MAX_SUBJECTS);
  return [
    ...subjects.slice(0, MAX_SUBJECTS),
    {
      subject: `Other (${rest.length})`,
      duration: rest.reduce((sum, item) => sum + item.duration, 0),
      sessions: rest.reduce((sum, item) => sum + item.sessions, 0),
      isOther: true,
    },
  ];
};

function SubjectBreakdown() {
  const [selectedFilter, setSelectedFilter] = useState("Monthly");
  const [subjects, setSubjects] = useState<ISubjectStudyTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await UserServices.getTimeBySubject(selectedFilter);
      setSubjects(result ?? []);
      setLoading(false);
    };
    fetchData();
  }, [selectedFilter]);

  const rows = toRows(subjects);
  const total = subjects.reduce((sum, item) => sum + item.duration, 0);
  const max = Math.max(...rows.map((row) => row.duration), 1);

  return (
    <div className="bg-gray-800 rounded-lg p-5 flex flex-col">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Time by Subject</h2>
        <Dropdown
          value={selectedFilter}
          onChange={setSelectedFilter}
          options={filterOptions}
          size="sm"
          searchable={false}
          className="w-36"
        />
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-1/3 bg-gray-700 rounded mb-2" />
              <div className="h-2 bg-gray-700 rounded-full" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-gray-400">
          <BookOpen size={36} className="mb-3 text-gray-500" />
          <p className="text-sm">No study time recorded for this period.</p>
          <p className="text-xs text-gray-500 mt-1">
            Join a session to start tracking.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            Total{" "}
            <span className="text-white font-semibold">
              {formatDuration(total)}
            </span>{" "}
            across {subjects.length}{" "}
            {subjects.length === 1 ? "subject" : "subjects"}
          </p>

          <ul className="space-y-4">
            {rows.map((row) => {
              const share = Math.round((row.duration / total) * 100);
              const isHovered = hovered === row.subject;
              return (
                <li
                  key={row.subject}
                  className="relative"
                  onMouseEnter={() => setHovered(row.subject)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="flex justify-between items-baseline gap-3 text-sm mb-1.5">
                    <span
                      className={`truncate ${
                        row.isOther ? "text-gray-400" : "text-white"
                      }`}
                    >
                      {row.subject}
                    </span>
                    <span className="shrink-0 text-gray-400">
                      <span className="text-white">
                        {formatDuration(row.duration)}
                      </span>{" "}
                      · {share}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700/60 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        row.isOther ? "bg-gray-500" : "bg-[#00D2D9]"
                      } ${isHovered ? "opacity-100" : "opacity-90"}`}
                      style={{
                        width: `${Math.max((row.duration / max) * 100, 2)}%`,
                      }}
                    />
                  </div>

                  {isHovered && (
                    <div
                      role="tooltip"
                      className="absolute right-0 -top-2 -translate-y-full z-10 px-3 py-2 rounded-md bg-gray-900 border border-gray-700 shadow-lg text-xs whitespace-nowrap pointer-events-none"
                    >
                      <p className="font-semibold text-white">{row.subject}</p>
                      <p className="text-gray-400">
                        {formatDuration(row.duration)} across {row.sessions}{" "}
                        {row.sessions === 1 ? "session" : "sessions"}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default SubjectBreakdown;
