"use client";
import React, { useEffect, useState } from "react";
import { ISessionTypes, Session } from "@/types/sessionTypes";
import { useAuth } from "@/Context/auth.context";
import { IGroupType } from "@/types/groupTypes";
import { useRouter } from "next/navigation";
import BaseModal from "@/Components/Modal/Modal";
import SessionDetailsModal from "./SessionDetails";
import { SessionServices } from "@/services/client/session.client";
import CreateSession from "./CreateSession";
import GenericListing from "@/Components/SessionListing/SessionListing";
import { FileDown } from "lucide-react";
import toast from "react-hot-toast";

const SessionsListing: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [iscreatOpen, setCreateOpen] = useState(false);
  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const limit = 9;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#create") {
      setCreateOpen(true);
    }
  }, []);

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

  const downloadReport = async (sessionId: string) => {
    try {
      const response = await SessionServices.downloadSessionReport(sessionId);
      if (!response) return;
      toast.success("PDF Downloaded Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFilteredSessions = async (
    searchQuery: string,
    filterSubject: string,
    startDate: string | null,
    endDate: string | null,
    sort: boolean,
    skip: number,
    limit: number
  ) => {
    const { sessions, count } = await SessionServices.getFilteredSessions(
      searchQuery,
      filterSubject,
      startDate,
      endDate,
      Number(sort),
      skip,
      limit
    );
    return { items: sessions, count };
  };

  const renderSessionCard = (session: Session) => {
    return (
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
              {getStatus(session.startTime, session.endTime) === "Ended" &&
                !session.isStopped && (
                  <div className="relative group">
                    <button
                      onClick={() => downloadReport(session._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-600 text-white hover:bg-gray-700 transition-all shadow-md"
                    >
                      <FileDown size={18} />
                    </button>
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-[60%] w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      Session Report
                    </div>
                  </div>
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
              <span>{new Date(session.startTime).toLocaleTimeString()}</span>
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
              <span>{session.createdBy?.username}</span>
            </div>
            <div>
              <span className="text-gray-400">Group:</span>
            </div>
            <div>
              <span>{(session.groupId as IGroupType)?.name}</span>
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
              getStatus(session.startTime as Date, session.endTime as Date) ==
                "Scheduled" && (
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
    );
  };

  const handleCreateClick = () => {
    router.push("/dashboard/sessions#create");
    setCreateOpen(true);
  };

  const filterOptions = [
    { value: "Mathematics", label: "Math" },
    { value: "Physics", label: "Physics" },
    { value: "History", label: "History" },
  ];

  return (
    <>
      <GenericListing
        items={sessions}
        setItems={setSessions}
        renderCard={renderSessionCard}
        fetchData={fetchFilteredSessions}
        onCreateClick={handleCreateClick}
        createButtonText="Schedule a Session"
        filterOptions={filterOptions}
        filterLabel="Subject"
        searchPlaceholder="Search sessions"
        showDateFilter={true}
        loading={loading}
        setLoading={setLoading}
        limit={limit}
      />

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
            router.push("/dashboard/sessions");
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
