"use client";
import React, { useState } from "react";
import { FileDown, StopCircle } from "lucide-react";
import { ISessionTypes } from "@/types/sessionTypes";
import { IUserType } from "@/types/userTypes";
import { IGroupType } from "@/types/groupTypes";
import Confirm from "@/components/ui/modal/ConfirmModal";
import { SessionServices } from "@/services/client/session.client";
import GenericListing from "@/components/features/session/SessionListing/SessionListing";
import toast from "react-hot-toast";

interface Session extends ISessionTypes {
  _id: string;
  createdBy: IUserType;
}

const AdminSessionsListing: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "text-green-500";
      case "Scheduled":
        return "text-yellow-500";
      case "Ended":
      default:
        return "text-gray-400";
    }
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

  const handleStopSession = async () => {
    try {
      await SessionServices.stopSession(selectedSession);
      // Update the sessions list after stopping a session
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === selectedSession
            ? { ...session, isStopped: true }
            : session
        )
      );
    } catch (error) {
      console.error("Error stopping session:", error);
    } finally {
      setSelectedSession("");
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
    const { sessions, count } = await SessionServices.getAllSessions(
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
        style={{ borderLeftColor: "#8979FF" }}
      >
        <div className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold mb-1">{session.sessionName}</h3>
              <p className="text-gray-400 text-sm mb-4">{session.subject}</p>
            </div>
            {session.isStopped && (
              <p className="text-red-500">Admin Blocked </p>
            )}
            <p>
              {getStatus(session.startTime, session.endTime) === "Live" && (
                <StopCircle
                  color="red"
                  onClick={() => setSelectedSession(session._id)}
                  className="hover:cursor-pointer"
                />
              )}
            </p>
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
          </div>

          <div className="grid grid-cols-2 text-sm">
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
            <button className="text-[#8979FF] hover:text-[#5a50a7] hover:cursor-pointer text-sm">
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filterOptions = [
    { value: "Mathematics", label: "Math" },
    { value: "Physics", label: "Physics" },
    { value: "History", label: "History" },
    // Add more subjects as needed
  ];

  return (
    <>
      <GenericListing
        items={sessions}
        setItems={setSessions}
        renderCard={renderSessionCard}
        fetchData={fetchFilteredSessions}
        filterOptions={filterOptions}
        filterLabel="Subject"
        searchPlaceholder="Search sessions"
        showDateFilter={true}
        showCreateButton={false}
        loading={loading}
        setLoading={setLoading}
        limit={9}
      />

      <Confirm
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession("")}
        onConfirm={handleStopSession}
      />
    </>
  );
};

export default AdminSessionsListing;
