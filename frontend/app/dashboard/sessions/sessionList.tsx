"use client";
import React, { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import CreateSession from "./CreateSession";
import { ISessionTypes, Session } from "@/types/sessionTypes";
import { useAuth } from "@/Context/auth.context";
import { IGroupType } from "@/types/groupTypes";
import { useRouter } from "next/navigation";
import BaseModal from "@/Components/Modal/Modal";
import SessionDetailsModal from "./SessionDetails";
import { SessionServices } from "@/services/client/session.client";

const SessionsListing: React.FC<{ initialSessions: Session[] }> = ({
  initialSessions,
}) => {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [currentPage, setCurrentPage] = useState(1);
  const [iscreatOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionTypes | null>(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#create") {
      setCreateOpen(true);
    }
  }, []);

  const sessionsPerPage = 9;
  const totalPages = Math.ceil(sessions?.length / sessionsPerPage);

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions?.slice(
    indexOfFirstSession,
    indexOfLastSession
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "text-green-500";
      case "Scheduled":
        return "text-yellow-500";
      case "Ended":
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  const goToRoom = (sessionCode: string) => {
    router.push(`/sessions/${sessionCode}`);
  };

  const getStatus = (start: Date | string, end: Date | string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date();

    if (startDate > currentDate) {
      return "Scheduled";
    }
    if (startDate < currentDate && endDate > currentDate) {
      return "Live";
    }
    if (endDate < currentDate) {
      return "Ended";
    }
  };

  const filteredSessions = async (subject: string, date: string) => {
    const sessions = await SessionServices.getFilteredSessions(subject, date);
    setSessions(sessions);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      setSessions((prev) => {
        return prev.filter((s) => {
          return s.sessionName.includes(searchQuery);
        });
      });
    } else {
      filteredSessions("", "");
    }
  }, [searchQuery]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-grow min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions"
            className="w-full bg-gray-900 text-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Subject Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 w-full sm:w-auto appearance-none pr-8"
              onChange={(e) => {
                setFilterSubject(e.target.value);
                filteredSessions(e.target.value as string, filterDate);
              }}
              value={filterSubject}
            >
              <option value="Subject">Subject</option>
              <option value="Mathematics">Math</option>
              <option value="Physics">Physics</option>
              <option value="History">History</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          {/* Date Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              className="bg-gray-900 text-gray-300 rounded-md px-4 py-2 w-full sm:w-auto appearance-none pr-8"
              onChange={(e) => {
                setFilterDate(e.target.value);
                filteredSessions(filterSubject, e.target.value);
              }}
              value={filterDate}
            >
              <option value="Date">Date</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => {
                router.push("/dashboard/sessions#create")
                setCreateOpen(true)
            }}
            className="bg-[#00D2D9] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 w-full sm:w-auto"
          >
            Schedule a Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSessions?.map((session) => (
          <div
            key={session._id}
            className="rounded-lg overflow-hidden bg-zinc-900 border-l-4"
            style={{ borderLeftColor: "#00D2D9" }}
          >
            <div className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold mb-1">{session.sessionName}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Subject : {session.subject}
                  </p>
                </div>
                <div>
                  {getStatus(session.startTime, session.endTime) == "Live" &&
                    !session.isStopped && (
                      <button
                        className="bg-cyan-500 w-max px-4 py-1 rounded-4xl hover:cursor-pointer
                                        hover:bg-cyan-700 transition duration-300 ease-in-out"
                        onClick={() => goToRoom(session.code)}
                      >
                        Join
                      </button>
                    )}
                  {session.isStopped && (
                    <p className="text-red-500">Admin Blocked </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 text-sm">
                <div>
                  <span className="text-gray-400">Date :</span>
                </div>
                <div>
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Start Time:</span>
                </div>
                <div>
                  <span>
                    {new Date(session.startTime).toLocaleTimeString()}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400">End Time:</span>
                </div>
                <div>
                  <span>{new Date(session.endTime).toLocaleTimeString()}</span>
                </div>

                <div>
                  <span className="text-gray-400">Host:</span>
                </div>
                <div>
                  <span>{session.createdBy.username}</span>
                </div>
                <div>
                  <span className="text-gray-400">Group:</span>
                </div>
                <div>
                  <span>{(session.groupId as IGroupType).name}</span>
                </div>

                <div>
                  <span className="text-gray-400">Status:</span>
                </div>
                <div>
                  <span
                    className={getStatusColor(
                      getStatus(session.startTime, session.endTime) as string
                    )}
                  >
                    {getStatus(session.startTime, session.endTime)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="text-cyan-400 hover:text-cyan-300 text-md m-2 hover:cursor-pointer"
                  onClick={() => {
                    setIsDetailsOpen(true);
                    setSessionData(session);
                  }}
                >
                  Details
                </button>

                {session?.createdBy?._id == user?.id &&
                  new Date(session.endTime) > new Date() &&
                  getStatus(
                    session.startTime as Date,
                    session.endTime as Date
                  ) == "Scheduled" && (
                    <button
                      className="text-[#abcdff] hover:text-white text-md m-2 hover:cursor-pointer"
                      onClick={() => {
                        setUpdateOpen(true);
                        setSessionData(session);
                      }}
                    >
                      Edit
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === index + 1
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <BaseModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSessionData(null);
        }}
        title="Session Details"
      >
        <SessionDetailsModal session={sessionData} />
      </BaseModal>

      {iscreatOpen && (
        <CreateSession
          onClose={(newSession?: Session) => {
            setCreateOpen(false);
            router.push("/dashboard/sessions")
            if (newSession) {
              setSessions((prev) => {
                return [...prev, newSession];
              });
            }
          }}
          type={"create"}
          data={null}
        />
      )}
      {isUpdateOpen && (
        <CreateSession
          onClose={(newSession?: Session) => {
            if (newSession) {
              setSessions((prev) => {
                return prev.map((s) => {
                  return s._id == sessionData?._id ? newSession : s;
                });
              });
            }
            setUpdateOpen(false);
            setSessionData(null);
          }}
          type={"update"}
          data={sessionData}
        />
      )}
    </>
  );
};

export default SessionsListing;
