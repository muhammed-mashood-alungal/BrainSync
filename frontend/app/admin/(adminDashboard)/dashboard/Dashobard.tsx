"use client";
import Button from "@/components/ui/button/Button";
import { AUTH_MESSAGES } from "@/constants/messages/auth.messages";
import { useAuth } from "@/context/auth.context";
import { AdminServices } from "@/services/client/admin.client";
import { AuthServices } from "@/services/client/auth.client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface statsType {
  totalUsers: number;
  totalGroups: number;
  totalSessions: number;
  totalStudyTime: number;
}
interface SessionTrend {
  date: string;
  sessions: number;
}

const AdminDashboard: React.FC = ({}) => {
  const [timeRange, setTimeRange] = useState<"7days" | "14days" | "30days">(
    "7days"
  );
  const [sessionTrends, setSessionTrends] = useState<SessionTrend[]>([]);
  const [stats, setStats] = useState<statsType>({
    totalUsers: 0,
    totalGroups: 0,
    totalSessions: 0,
    totalStudyTime: 0,
  });

  const { checkAuth, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user && !loading) {
      router.push("/admin/login");
    }
    if (user && user?.role != "admin") {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  const getFilteredTrends = () => {
    return sessionTrends?.filter((item: SessionTrend) => {
      const itemDate = new Date(item.date);
      const itemDayStart = new Date(
        itemDate.getFullYear(),
        itemDate.getMonth(),
        itemDate.getDate()
      );

      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const pastDate = new Date(todayStart);
      switch (timeRange) {
        case "7days":
          pastDate.setDate(todayStart.getDate() - 7);
          break;
        case "14days":
          pastDate.setDate(todayStart.getDate() - 14);
          break;
        case "30days":
          pastDate.setDate(todayStart.getDate() - 30);
          break;
        default:
          pastDate.setDate(todayStart.getDate() - 7);
      }

      return itemDayStart >= pastDate && itemDayStart <= todayStart;
    });
  };

  const filteredTrends = getFilteredTrends();

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const logout = async () => {
    try {
      await AuthServices.logout();
      checkAuth();
    } catch (err: unknown) {
      toast.error((err as Error).message || AUTH_MESSAGES.LOGOUT_FAILED);
    }
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-10">
          <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
          <Button onClick={logout} variant="admin-primary">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Users</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold text-[#8979FF]">
                {formatNumber(stats.totalUsers)}+
              </h3>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Sessions</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold text-[#8979FF]">
                {formatNumber(stats.totalSessions)}+
              </h3>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Groups</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-3xl font-bold text-[#8979FF]">
                {formatNumber(stats.totalGroups)}+
              </h3>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 font-medium">Total Study Hours</h2>
            </div>
            <div className="flex items-end">
              <h3 className="text-2xl font-bold text-[#8979FF]">
                {stats.totalStudyTime}
              </h3>
            </div>
          </div>
        </div>

        <div className="">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Session Trends</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setTimeRange("7days")}
                  variant="admin-primary"
                  className={`rounded-md text-sm ${
                    timeRange === "7days"
                      ? "bg-[#8979FF] text-gray-900 py-1"
                      : "bg-gray-700 text-gray-300 py-1"
                  }`}
                >
                  7 Days
                </Button>
                <Button
                  onClick={() => setTimeRange("14days")}
                  variant="admin-primary"
                  className={`px-3 py-1 rounded-md text-sm hover:cursor-pointer ${
                    timeRange === "14days"
                      ? "bg-[#8979FF] text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  14 Days
                </Button>
                <Button
                  onClick={() => setTimeRange("30days")}
                  variant="admin-primary"
                  className={`px-3 py-1 rounded-md text-sm hover:cursor-pointer ${
                    timeRange === "30days"
                      ? "bg-[#8979FF] text-gray-900"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  30 Days
                </Button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis
                    dataKey="date"
                    stroke="#8979FF"
                    tick={{ fill: "#8979FF" }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis stroke="#8979FF" tick={{ fill: "#8979FF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#8979FF",
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Sessions Created"
                    stroke="#8979FF"
                    strokeWidth={2}
                    dot={{ fill: "#8979FF", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
