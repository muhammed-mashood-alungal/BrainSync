import React from "react";
import QuickActions from "./DashboardComponents/QuickActions";
import ScheduledSessions from "./DashboardComponents/ScheduledSessions";
import SubjectBreakdown from "./DashboardComponents/SubjectBreakdown";
import {
  RecentNotes,
  RecentSnippets,
} from "./DashboardComponents/RecentResources";
import UserInNav from "@/components/layouts/navbar/UserInNav";

const Dashboard = () => {
  return (
    <div className=" min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard</h1>

          <div className="flex items-center w-full md:w-auto">
            <UserInNav />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Scheduled Sessions */}
        <ScheduledSessions />

        {/* Subject breakdown & recent resources */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          <SubjectBreakdown />
          <RecentNotes />
          <RecentSnippets />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
