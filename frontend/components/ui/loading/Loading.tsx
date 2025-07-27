import React from "react";

const SimpleStudyLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="flex items-center justify-center space-x-2">
        <div
          className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-4 h-4 rounded-full bg-indigo-500 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  );
};

export default SimpleStudyLoading;
