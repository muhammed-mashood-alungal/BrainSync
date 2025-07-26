"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UserServices } from "@/services/client/user.client";

function ProgressChart() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Monthly");
  const [graphData, setGraphData] = useState<
    { name: string; duration: number }[]
  >([]);
  const filterOptions = ["Weekly", "Monthly", "Yearly"];

  const handleFilterSelect = (option: string) => {
    setSelectedFilter(option);
    setFilterOpen(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} M`;
  };

  const fetchData = async () => {
    const result = await UserServices.getUserSessionGraph(selectedFilter);
    if (result) {
      setGraphData(
        result?.map((item) => ({
          ...item,
          name: selectedFilter == "Monthly" ? `Day ${item.name}` : item.name,
        }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Progress Overview</h2>
        <div className="relative">
          <button
            className="flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {selectedFilter}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-md shadow-lg z-10">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
                  onClick={() => handleFilterSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis
                stroke="#888"
                domain={[
                  0,
                  Math.max(
                    60,
                    Math.max(...graphData.map((item) => item.duration)) * 1.2
                  ),
                ]}
                tickFormatter={(v) =>
                  v < 60 ? `${v}s` : `${Math.floor(v / 60)}m`
                }
              />
              <Tooltip
                formatter={(value) => formatDuration(value as number)}
                contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#00D2D9"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default ProgressChart;
