"use client";
import { useAuth } from "@/Context/auth.context";
import { AdminServices } from "@/services/client/admin.client";
import { AuthServices } from "@/services/client/auth.client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AdminDashboardProps {
  //   stats: {
  //     totalUsers: number;
  //     totalSessions: number;
  //     totalGroups: number;
  //     totalStudyHours: number;
  //   };
  //   sessionTrends: Array<{
  //     date: string;
  //     sessions: number;
  //   }>;
  userDistribution: {
    free: number;
    paid: number;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userDistribution,
}) => {
  const [timeRange, setTimeRange] = useState<"7days" | "14days" | "30days">(
    "7days"
  );
  const [sessionTrends, setSessionTrends] = useState<any>([]);
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalGroups: 0,
    totalSessions: 0,
    totalStudyTime: 0,
  });
  
  const { checkAuth , user} = useAuth()
  const router = useRouter()

  useEffect(()=>{
     if(!user ||  user.role != 'admin'){
      router.push('/login')
     }
  },[user])
  useEffect(() => {
    async function fetchDashboard() {
      let days = 0;
      if (timeRange == "7days") {
        days = 7;
      } else if (timeRange == "14days") {
        days = 14;
      } else if (timeRange == "30days") {
        days = 30;
      }
      const result = await AdminServices.getDashboardData(days);
      setStats({
        totalUsers: result.totalUsers,
        totalGroups: result.totalGroups,
        totalSessions: result.totalSessions,
        totalStudyTime: result.totalStudyTime,
      });
      setSessionTrends(result?.sessionCreationTrend);
    }
    fetchDashboard();
  }, [timeRange]);
  // Filter session trends data based on selected time range
  const getFilteredTrends = () => {
    const today = new Date();
    const pastDate = new Date();

    switch (timeRange) {
      case "7days":
        pastDate.setDate(today.getDate() - 7);
        break;
      case "14days":
        pastDate.setDate(today.getDate() - 14);
        break;
      case "30days":
        pastDate.setDate(today.getDate() - 30);
        break;
      default:
        pastDate.setDate(today.getDate() - 7);
    }

    return sessionTrends?.filter(
      (item: any) => new Date(item.date) >= pastDate
    );
  };


  const filteredTrends = getFilteredTrends();

  // Colors for charts
  const COLORS = ["#06b6d4", "#4b5563"]; // cyan-500, gray-600

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format hours
  const formatHours = (hours: number): string => {
    if (hours < 1000) return `${hours}h`;
    return `${(hours / 1000).toFixed(1)}k h`;
  };

  // Calculate user distribution for pie chart
  const pieData = [
    { name: "Paid Users", value: userDistribution.paid },
    { name: "Free Users", value: userDistribution.free },
  ];


   const logout = async () => {
      try {
          await AuthServices.logout()
          checkAuth()
          router.push('/login')
      } catch (err) {
          toast.error("Logout Failed")
      }
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <button onClick={logout} className="text-[#00D2D9] hover:underline">
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Users</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold">
                {formatNumber(stats.totalUsers)}
              </h3>
              <span className="text-green-400 ml-2 text-sm">+12%</span>
            </div>
          </div>

          {/* Total Sessions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Sessions</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold">
                {formatNumber(stats.totalSessions)}
              </h3>
              <span className="text-green-400 ml-2 text-sm">+8%</span>
            </div>
          </div>

          {/* Total Groups */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Groups</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold">
                {formatNumber(stats.totalGroups)}
              </h3>
              <span className="text-green-400 ml-2 text-sm">+15%</span>
            </div>
          </div>

          {/* Total Study Hours */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Study Hours</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold">
                {stats.totalStudyTime}
                {/* {formatHours(stats.totalStudyHours)} */}
              </h3>
              <span className="text-green-400 ml-2 text-sm">+23%</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="">
          {/* Sessions Trend Line Chart */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Session Trends</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange("7days")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === "7days"
                      ? "bg-cyan-500 text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setTimeRange("14days")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === "14days"
                      ? "bg-cyan-500 text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  14 Days
                </button>
                <button
                  onClick={() => setTimeRange("30days")}
                  className={`px-3 py-1 rounded-md text-sm ${
                    timeRange === "30days"
                      ? "bg-cyan-500 text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fill: "#9ca3af" }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Sessions Created"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: "#06b6d4", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Pie Chart */}
          {/* <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6">User Distribution</h2>
            <div className="h-80 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="70%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      borderColor: '#374151',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Paid Users: {formatNumber(userDistribution.paid)}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                  <span className="text-sm text-gray-300">Free Users: {formatNumber(userDistribution.free)}</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
