import React from 'react';
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