"use client";
import EmptyList from "@/Components/EmptyList/EmptyList";
import { SessionServices } from "@/services/client/session.client";
import { IGroupType } from "@/types/groupTypes";
import { Session } from "@/types/sessionTypes";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function ScheduledSessions() {
  const [todaysSessions, setTodaysSessions] = useState<Session[]>([]);
  useEffect(() => {
    const  fetchSesssion =async ()=>{
        const sessions =await SessionServices.getFilteredSessions("", "Today");
        setTodaysSessions(sessions)
    }
    fetchSesssion()
  }, []);

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
  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Scheduled Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Data Structure Revision Session */}
          {todaysSessions.length > 0 ? todaysSessions.map((session)=>{
            return <div className="bg-gray-800 rounded-lg overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500"></div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">
                {session.sessionName}
              </h3>
              <p></p>
              <p className="text-sm text-gray-400">Starting Time  {new Date(session.startTime).toLocaleTimeString()} </p>
              <p className="text-sm text-gray-400">Starting Time  {new Date(session.endTime).toLocaleTimeString()} </p>
              <p className="text-sm text-gray-400 mb-3">{(session.groupId as IGroupType).members.length} Participants</p>
              <div className="flex justify-between items-center">
              <span
                    className={getStatusColor(
                      getStatus(session.startTime, session.endTime) as string
                    )}
                  >
                    {getStatus(session.startTime, session.endTime)}
                  </span>
                {/* <button className="text-cyan-400 text-sm hover:underline">
                  Details
                </button> */}
                {
                     getStatus(session.startTime , session.endTime) == "Live" &&
                     !session.isStopped && (
                        <Link href={`/sessions/${session.code}`}>
                        <button className="bg-cyan-500 hover:bg-cyan-600 px-4 py-1 rounded-full text-sm transition">
                          Join
                        </button>
                        </Link>
                     )
                }
               
               
              </div>
            </div>
          </div>
          }) : <EmptyList/>}
        </div>
      </section>
    </>
  );
}

export default ScheduledSessions;
