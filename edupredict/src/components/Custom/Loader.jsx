import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
    </div>
  );
};
export default Loader;
