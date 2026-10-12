"use client";
import { useState, useEffect } from "react";
import Dropdown from "@/components/ui/dropdown/Dropdown";
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
  const [selectedFilter, setSelectedFilter] = useState("Monthly");
  const [graphData, setGraphData] = useState<
    { name: string; duration: number }[]
  >([]);
  const filterOptions = ["Weekly", "Monthly", "Yearly"];

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
        <Dropdown
          value={selectedFilter}
          onChange={setSelectedFilter}
          options={filterOptions.map((option) => ({
            value: option,
            label: option,
          }))}
          size="sm"
          searchable={false}
          className="w-36"
        />
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
