"use client";
import React, { useCallback, useState } from "react";
import { FileDown, StopCircle } from "lucide-react";
import { ISessionTypes } from "@/types/sessionTypes";
import { IUserType } from "@/types/userTypes";
import { IGroupType } from "@/types/groupTypes";
import Confirm from "@/components/ui/modal/ConfirmModal";
import { SessionServices } from "@/services/client/session.client";
import GenericListing from "@/components/features/session/SessionListing/SessionListing";
import toast from "react-hot-toast";
import { SESSION_MESSAGES } from "@/constants/messages/session.messages";
import { getStatus, getStatusColor } from "@/utils/sessionStatus.util";
import BaseModal from "@/components/ui/modal/BaseModal";
import SessionDetailsModal from "@/components/features/session/SessionDetails";
import Button from "@/components/ui/button/Button";

interface Session extends ISessionTypes {
  _id: string;
  createdBy: IUserType;
}

const AdminSessionsListing: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<ISessionTypes | null>(null);

  const downloadReport = async (sessionId: string) => {
    const response = await SessionServices.downloadSessionReport(sessionId);
    if (!response) return;
    toast.success("PDF Downloaded Successfully");
  };

  const handleBaseModalClose = useCallback(() => {
    setIsDetailsOpen(false);
    setSessionData(null);
  }, []);

  const handleStopSession = async () => {
    try {
      await SessionServices.stopSession(selectedSession);
      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session._id === selectedSession
            ? { ...session, isStopped: true }
            : session
        )
      );
    } catch (error: unknown) {
      const errorMsg =
        (error as Error)?.message || SESSION_MESSAGES.SESSSION_STOPPING_FAILED;
      toast.error(errorMsg);
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
                  <Button
                    variant="other"
                    onClick={() => downloadReport(session._id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-600 text-white hover:bg-gray-700 transition-all shadow-md hover:cursor-pointer"
                  >
                    <FileDown size={18} />
                  </Button>
                  <div
                    className="absolute top-full mt-2 left-1/2 -translate-x-[60%] w-max bg-black text-white text-xs rounded px-2 py-1 
                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 hover:cursor-pointer"
                  >
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
            <Button
              variant="other"
              className="text-[#8979FF] hover:text-[#5a50a7] hover:cursor-pointer text-sm "
              onClick={() => {
                setIsDetailsOpen(true);
                setSessionData(session);
              }}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    );
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
        filterOptions={filterOptions}
        filterLabel="Subject"
        searchPlaceholder="Search sessions"
        showDateFilter={true}
        showCreateButton={false}
        loading={loading}
        setLoading={setLoading}
        limit={9}
        isAdmin={true}
      />

      <Confirm
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession("")}
        onConfirm={handleStopSession}
      />

      <BaseModal
        isOpen={isDetailsOpen}
        onClose={handleBaseModalClose}
        title="Session Details"
      >
        <SessionDetailsModal session={sessionData} isAdmin={true} />
      </BaseModal>
    </>
  );
};

export default AdminSessionsListing;
