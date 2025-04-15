// "use client";
// import { UserServices } from "@/services/client/user.client";
// import { useEditor } from "@tiptap/react";
// import { ChevronDown } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// function ProgressChart() {
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("Monthly");
//   const [graphData, setGraphData] = useState<
//     { name: string; duration: string }[]
//   >([]);
//   const filterOptions = ["Daily", "Weekly", "Monthly", "Yearly"];

//   const handleFilterSelect = (option: string) => {
//     setSelectedFilter(option);
//     setFilterOpen(false);
//   };

//   const formatLabels = (rawData: any, selectedFilter: string) => {
//     if (selectedFilter === "Daily") {
//       return graphData.map((item: any) => ({
//         ...item,
//         name: new Date(item.name).toLocaleDateString(), // e.g., 4/14/2025
//       }));
//     }
//     if (selectedFilter === "Weekly") {
//       return graphData.map((item: any) => ({
//         ...item,
//         name: `Week ${item.name.split("-")[1]}`,
//       }));
//     }
//     if (selectedFilter === "Monthly") {
//       return graphData.map((item: any) => ({
//         ...item,
//         name: new Date(item.name + "-01").toLocaleString("default", {
//           month: "short",
//           year: "numeric",
//         }),
//       }));
//     }
//     if (selectedFilter === "Yearly") {
//       return graphData.map((item: any) => ({
//         ...item,
//         name: item.name,
//       }));
//     }
//     return rawData;
//   };

// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       const result = await UserServices.getUserStats(selectedFilter);
// //       console.log("result");
// //       console.log(result);
// //       setGraphData(result);
// //     };
// //     fetchStats();
// //   }, [selectedFilter]);

// useEffect(() => {
//     const fetchStats = async () => {
//       const result = await UserServices.getUserStats(selectedFilter);
//       console.log(result);

//       const parsed = result.map((item: any) => {
//         const [mins, secs] = item.duration.replace(" M", "").split(":");
//         return {
//           ...item,
//           duration: parseInt(mins) * 60 + parseInt(secs), // convert to seconds
//         };
//       });

//       setGraphData(formatLabels(parsed, selectedFilter));
//     };

//     fetchStats();
//   }, [selectedFilter]);

//   return (
//     <>
//       <section className="mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Progress Overview</h2>

//           {/* Filter Dropdown */}
//           <div className="relative">
//             <button
//               className="flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition"
//               onClick={() => setFilterOpen(!filterOpen)}
//             >
//               {selectedFilter}
//               <ChevronDown className="ml-2 h-4 w-4" />
//             </button>

//             {filterOpen && (
//               <div className="absolute right-0 mt-2 w-36 bg-gray-800 rounded-md shadow-lg z-10">
//                 {filterOptions.map((option) => (
//                   <button
//                     key={option}
//                     className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
//                     onClick={() => handleFilterSelect(option)}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-gray-800 rounded-lg p-6">
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               {/* <LineChart
//                 data={graphData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis dataKey="name" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#333",
//                     borderColor: "#555",
//                   }}
//                   labelStyle={{ color: "#fff" }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="2022"
//                   stroke="#7547F7"
//                   activeDot={{ r: 8 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="2023"
//                   stroke="#FF6B6B"
//                   activeDot={{ r: 8 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="2024"
//                   stroke="#00D2D9"
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart> */}
//               <LineChart
//                 data={graphData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//                 <XAxis dataKey="name" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#333",
//                     borderColor: "#555",
//                   }}
//                   labelStyle={{ color: "#fff" }}
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="duration" // 👈 use 'duration'
//                   stroke="#00D2D9"
//                   activeDot={{ r: 8 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default ProgressChart;
'use client'
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

// Mock data similar to what's coming from your backend
// const mockData = [
//   { name: '1', duration: 0 },
//   { name: '2', duration: 0 },
//   { name: '3', duration: 0 },
//   { name: '4', duration: 0 },
//   { name: '5', duration: 0 },
//   { name: '10', duration: 120 },
//   { name: '15', duration: 300 },
//   { name: '20', duration: 180 },
//   { name: '25', duration: 420 },
//   { name: '30', duration: 250 },
// ];

function ProgressChart() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Monthly");
  const [graphData, setGraphData] = useState<{name : string , duration : number}[]>([]);
  const filterOptions = ["Weekly", "Monthly", "Yearly"];

  const handleFilterSelect = (option : string) => {
    setSelectedFilter(option);
    setFilterOpen(false);
  };

  const formatDuration = (seconds : number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")} M`;
  };

  useEffect(() => {
    const fetchData =async () => {
    
    const result =await UserServices.getUserStats(selectedFilter)
    console.log(result)
      if(result){
        setGraphData(
            result?.map(item => ({
              ...item,
              name: selectedFilter == "Monthly" ? `Day ${item.name}` : item.name,
            }))
          );
      }
    };

    fetchData();
  }, [selectedFilter]);

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Progress Overview</h2>

        {/* Filter Dropdown */}
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
                domain={[0, Math.max(60, Math.max(...graphData.map(item => item.duration)) * 1.2)]}
                // Change the tick formatter to show seconds for small values
                tickFormatter={(v) => v < 60 ? `${v}s` : `${Math.floor(v / 60)}m`}
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