import React from 'react';
import { Search, Plus, LogIn, Users, Edit } from 'lucide-react';
import Link from 'next/link';
import QuickActions from './DashboardComponents/QuickActions';
import ScheduledSessions from './DashboardComponents/ScheduledSessions';
import ProgressChart from './DashboardComponents/ProgressChart';
import UserInNav from '@/Components/UserInNav/UserInNav';

const Dashboard = () => {
  return (
    <div className=" min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard</h1>
          
          <div className="flex items-center w-full md:w-auto">
            <UserInNav/>
            {/* <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <input
                type="text"
                placeholder="Search sessions"
                className="bg-gray-800 rounded-full w-full py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            </div>
            <div className="ml-3">
              <img src="/api/placeholder/40/40" alt="User avatar" className="h-10 w-10 rounded-full" />
            </div> */}
          </div>
        </div>

        {/* Quick Actions */}
          <QuickActions/>



        {/* Scheduled Sessions */}
        <ScheduledSessions/>

        {/* Progress Chart*/}
        <ProgressChart/>
       
      </div>
    </div>
  );
};

export default Dashboard;