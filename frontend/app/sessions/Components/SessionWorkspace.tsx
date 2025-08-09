"use client";
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  LogOut,
  Flag,
  Crown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import VideoConference from "./VideoConference";
import {
  useVideoCall,
} from "@/context/videoConference.context";
import { toast } from "react-hot-toast";
import { ISessionTypes } from "@/types/sessionTypes";
import WhiteBoard from "./WhiteBoard";
import ChatComponent from "./Chat";
import NoteEditor from "./NoteEditor";
import BaseModal from "@/components/ui/modal/BaseModal";
import { useAuth } from "@/context/auth.context";
import { reportService } from "@/services/client/report.client";
import Button from "@/components/ui/button/Button";
import CodeEditor from "./CodeEditor";
import { IGroupType } from "@/types/groupTypes";
import { SESSION_MESSAGES } from "@/constants/messages/session.messages";
import { COMMON_MESSAGES } from "@/constants/messages/common.messages";
import { commonReportReasons } from "@/constants/session/session.reportMessages";

const SessionWorkspace: React.FC<{
  roomId: string;
  session: ISessionTypes;
}> = ({ roomId, session }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("video");
  const [isVisible, setIsVisible] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [confirmationOn, setConfirmationOn] = useState(false);
  const { leaveRoom, peers } = useVideoCall();
  const { user } = useAuth();
  const joinTimeRef = useRef(0);

  useEffect(() => {
    joinTimeRef.current = Date.now();
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const { duration, log } = getTimeSpent();

      leaveRoom(duration, log);
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = event.clientY;
      const threshold = 100;

      if (windowHeight - mouseY <= threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getTimeSpent = () => {
    const leaveTime = new Date();
    const joinTime = new Date(joinTimeRef.current);

    const duration = leaveTime.getTime() - joinTime.getTime();

    return {
      duration: duration,
      log: { joinTime: joinTime, leaveTime: leaveTime, duration: duration },
    };
  };

  const handleLeave = () => {
    const { duration, log } = getTimeSpent();
    leaveRoom(duration, log);
    router.push("/dashboard/sessions");
  };

  const handleReport = async () => {
    try {
      setIsReporting(false);
      if (!reportReason) {
        return toast.error(SESSION_MESSAGES.PROVIDE_SESSION_REPORTING_REASON);
      }

      const data = {
        reason: reportReason,
        sessionCode: roomId,
        type: "Session",
        reportedby: user?.id,
      };
      await reportService.reportSession(data);
      toast.success(SESSION_MESSAGES.SESSION_REPORTED);
      setConfirmationOn(true);
    } catch (error : unknown) {
      const errorMsg = (error as Error)?.message || COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED;
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      {/* Header */}
      <div className="p-5 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-2xl font-bold text-cyan-400 mb-1 sm:mb-0">
          Brain Sync
        </div>
        <div className="text-center">
          <div className="text-xl">
            {session.sessionName || "Session Name"} (
            {session.subject || "Session Subject"})
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="bg-gray-800 rounded-full px-4 py-1 flex items-center border border-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 text-cyan-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {peers.length + 1} /
              {(session?.groupId as IGroupType)?.members?.length || "5 Members"}
            </span>
          </div>
          <div
            className="flex text-gray-300 hover:text-gray-500"
            onClick={() => setIsReporting(true)}
          >
            <Flag /> Report
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar w-full">
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-t-lg flex items-center whitespace-nowrap text-xs sm:text-sm  hover:cursor-pointer ${
              activeTab === "video"
                ? "bg-cyan-900 text-cyan-400"
                : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("video")}
          >
            <Video className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="sm:text-sm  md:text-md">Video Call</span>
          </button>
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-t-lg flex items-center whitespace-nowrap text-xs sm:text-sm hover:cursor-pointer ${
              activeTab === "whiteboard"
                ? "bg-cyan-900 text-cyan-400"
                : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("whiteboard")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 sm:mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sm:text-sm   md:text-md">WhiteBoard</span>
          </button>
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-t-lg flex items-center whitespace-nowrap text-xs sm:text-sm hover:cursor-pointer ${
              activeTab === "code" ? "bg-cyan-900 text-cyan-400" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("code")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 sm:mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sm:text-sm  md:text-md flex">
              Code Editor{" "}
              {!user?.isPremiumMember && (
                <Crown color="yellow" className="ml-2" size={16} />
              )}
            </span>
          </button>
          <button
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-t-lg flex items-center  text-xs sm:text-md hover:cursor-pointer ${
              activeTab === "notes"
                ? "bg-cyan-900 text-cyan-400"
                : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("notes")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 sm:mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sm:text-sm  md:text-md">Notes</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 pb-4 flex flex-col md:flex-row gap-4 h-[calc(100vh-150px)]">
        <div className="flex-grow relative">
          <div
            className={`${activeTab === "video" ? "block" : "hidden"} h-full`}
          >
            <VideoConference
              isAudioEnabled={micEnabled}
              isVideoEnabled={videoEnabled}
            />
            <ChatComponent />
          </div>
          <div
            className={`${
              activeTab === "whiteboard" ? "block" : "hidden"
            } h-full`}
          >
            <WhiteBoard />
          </div>
          {/* Other tabs */}

          <div
            className={`${
              activeTab === "code" ? "block" : "hidden"
            } h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500`}
          >
            <CodeEditor roomId={roomId} />
          </div>
          <div
            className={`${
              activeTab === "notes" ? "block" : "hidden"
            } h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500`}
          >
            <NoteEditor roomId={roomId} />
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex justify-center bg-transparent transition-all duration-300 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex gap-2 bg-[#15166b0f] p-2 px-12 rounded-4xl border border-cyan-500 backdrop-blur-md mb-5">
          <button
            onClick={() => setActiveTab("video")}
            className={`p-4 rounded-full hover:cursor-pointer ${
              activeTab === "video" ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            <Video className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveTab("whiteboard")}
            className={`p-4 rounded-full hover:cursor-pointer ${
              activeTab === "whiteboard" ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 000 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`p-4 rounded-full hover:cursor-pointer ${
              activeTab === "code" ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`p-4 rounded-full hover:cursor-pointer ${
              activeTab === "notes" ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span className="w-0.5 bg-cyan-500 ml-2 mr-2 rounded-2xl"></span>
          <button
            onClick={() => setVideoEnabled(!videoEnabled)}
            className={`p-4 rounded-full hover:cursor-pointer ${
              videoEnabled ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            {videoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={`p-4 rounded-full hover:cursor-pointer ${
              micEnabled ? "bg-cyan-500" : "bg-gray-700"
            }`}
          >
            {micEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </button>
          <button className="p-4 rounded-full bg-red-500 hover:cursor-pointer">
            <LogOut className="h-6 w-6" onClick={handleLeave} />
          </button>
        </div>
      </div>
      <BaseModal
        isOpen={isReporting}
        onClose={() => setIsReporting(false)}
        title="Report Session"
        onSubmit={handleReport}
        submitText="Report"
      >
        <label htmlFor="reason" className="text-md mb-2">
          Select Reason for Reporting
        </label>
        <select
          name=""
          id="reason"
          onChange={(e) => setReportReason(e.target.value)}
          className="w-full py-3 px-4 rounded-md border-gray-700 border mt-3 bg-gray-800 
           text-white placeholder-gray-400 focus:outline-none  focus:ring-cyan-500 appearance-none
           hover:cursor-pointer"
        >
          <option value="" disabled selected>
            Select a Reason
          </option>
          {commonReportReasons.map((reason, idx) => {
            return (
              <option key={idx} value={reason}>
                {reason}
              </option>
            );
          })}
        </select>
      </BaseModal>
      <BaseModal
        isOpen={confirmationOn}
        onClose={() => setConfirmationOn(false)}
        title="Do You want to leave Session?"
      >
        <div className="w-full flex justify-end">
          <Button
            onClick={() => setConfirmationOn(false)}
            className="hover:text-cyan-100"
          >
            {" "}
            Stay Here
          </Button>
          <Button
            onClick={() => handleLeave()}
            className="bg-red-600 hover:bg-red-400"
          >
            {" "}
            Leave{" "}
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default SessionWorkspace;
