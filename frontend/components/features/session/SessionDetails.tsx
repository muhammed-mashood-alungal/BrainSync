import React from "react";
import {
  Clock,
  Calendar,
  BookOpen,
  Tag,
  Info,
  Group,
  UserCheck2,
} from "lucide-react";
import { ISessionTypes } from "@/types/sessionTypes";
import { IGroupType } from "@/types/groupTypes";
import { IUserType } from "@/types/userTypes";
import { formatDate, formatTime } from "@/utils/time.util";
import { getStatus } from "@/utils/sessionStatus.util";
import LinkCopyButton from "@/components/ui/button/LinkCopyButton";

interface SessionDetailsModalProps {
  session: ISessionTypes | null;
  isAdmin?: boolean;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  isAdmin,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            isAdmin ? "text-[#8979FF]" : "text-[#00D2D9]"
          }`}
        >
          {session?.sessionName}
        </h2>
        {getStatus(session?.startTime as Date, session?.endTime as Date) ==
          "Live" && (
          <div className="flex items-center space-x-3">
            <div className={isAdmin ? "text-[#8979FF]" : "text-[#00D2D9]"}>
              <LinkCopyButton link={session?.sessionLink as string} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <BookOpen
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span className="font-medium">Subject: {session?.subject}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span className="font-medium">{formatDate(session?.date)}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Clock
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span className="font-medium">
            {formatTime(session?.startTime as Date)} -{" "}
            {formatTime(session?.endTime as Date)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Tag
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span className="font-medium">Session Code: {session?.code}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Group
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span className="font-medium">
            Group: {(session?.groupId as IGroupType).name}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <UserCheck2
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span className="font-medium">
            Created By: {(session?.createdBy as IUserType).username}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Info
            className={
              isAdmin ? "text-[#8979FF] w-5 h-5" : "text-[#00D2D9] w-5 h-5"
            }
          />
          <span
            className={`font-medium ${
              `${getStatus(
                session?.startTime as Date,
                session?.endTime as Date
              )}` === "Live"
                ? "text-green-500"
                : `${getStatus(
                    session?.startTime as Date,
                    session?.endTime as Date
                  )}` === "Scheduled"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            Status:{" "}
            {getStatus(session?.startTime as Date, session?.endTime as Date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal;
