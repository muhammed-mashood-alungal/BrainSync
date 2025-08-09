"use client";
import Input from "@/components/ui/Input/Input";
import { subscriptionServices } from "@/services/client/subscription.client";
import React, { useEffect, useState } from "react";

function SubscriptionStats() {
  const [stats, setStats] = useState<any>({
    totalSubscriptions: 0,
    totalRevenue: 0,
    activeCount: 0,
    cancelledCount: 0,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchStats = async () => {
    try {
      const start = startDate ? new Date(startDate).toISOString() : undefined;
      const end = endDate ? new Date(endDate).toISOString() : undefined;

      const res = await subscriptionServices.getSubscriptionStats(start, end);
      setStats(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  return (
    <>
      <div className="flex justify-end m-2">
        <div className="m-2">
          <Input
            type="date"
            name="startDate"
            placeholder="Session Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
          />
        </div>
        <div className="m-2">
          <Input
            type="date"
            name="endDate"
            placeholder="Session Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
          />
        </div>
        <button
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md m-2 hover:cursor-pointer"
          onClick={fetchStats}
        >
          Filter
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 font-medium">Total Subscriptions</h2>
          </div>
          <div className="flex items-end">
            <h3 className="text-3xl font-bold text-cyan-500">
              {stats.totalSubscriptions}
            </h3>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 font-medium">Total Revenue</h2>
          </div>
          <div className="flex items-end">
            <h3 className="text-3xl font-bold text-cyan-500">
              {stats.totalRevenue}+
            </h3>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 font-medium">Acitve Count</h2>
          </div>
          <div className="flex items-end">
            <h3 className="text-3xl font-bold text-cyan-500">
              {stats.activeCount}
            </h3>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 font-medium">Cancelled Count</h2>
          </div>
          <div className="flex items-end">
            <h3 className="text-3xl font-bold text-cyan-500">
              {stats.cancelledCount}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default SubscriptionStats;
