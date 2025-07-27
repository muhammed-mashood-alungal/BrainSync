import React from "react";

const InPageLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center m-2">
      <div className="flex items-center justify-center space-x-2">
        <div
          className="w-2 h-4 rounded-full bg-cyan-500 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-2 h-4 rounded-full bg-cyan-500 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-4 rounded-full bg-cyan-500 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default InPageLoading;
