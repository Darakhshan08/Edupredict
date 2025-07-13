import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];
const CustomLegend = ({
  items
}) => {
  return <div className="flex justify-center space-x-6 mt-4">
      {items.map((item, index) => <div key={index} className="flex items-center space-x-2">
          <div className="w-4 h-4" style={{
        backgroundColor: item.color
      }}></div>
          <span className="text-sm text-gray-700 font-medium">{item.name}</span>
        </div>)}
    </div>;
};
export const Overview = () => {
  const legendItems = [{
    name: "Actual",
    color: "#82ca9d"
  }, {
    name: "Predicted",
    color: "#8884d8"
  }];
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  // Mock API function
  const mockAttendanceTrendAnalysis = days => {
    const labels = [];
    const actual = [];
    const predicted = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (days - i - 1));
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      labels.push(formattedDate);
      // Generate random attendance percentages
      const actualValue = Math.floor(Math.random() * 30) + 70; // 70-100%
      actual.push(actualValue);
      // Predicted is close to actual but slightly different
      const predictedValue = Math.max(0, Math.min(100, actualValue + (Math.random() * 10 - 5)));
      predicted.push(predictedValue.toFixed(1));
    }
    return {
      labels,
      actual,
      predicted
    };
  };
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const response = mockAttendanceTrendAnalysis(days);
      setData(response);
    }, 500);
  }, [days]);
  const GraphDropdown = ({
    setOption
  }) => {
    return <select className="px-3 py-1 border rounded text-sm" onChange={e => setOption(Number(e.target.value))} value={days}>
        <option value="7">Last 7 days</option>
        <option value="14">Last 14 days</option>
        <option value="30">Last 30 days</option>
      </select>;
  };
  if (!data) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="space-y-6 p-6">
      <div>
        <div className="flex items-center justify-between px-5 mb-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Trend
          </h2>
          <GraphDropdown setOption={setDays} />
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="90%">
            <LineChart width={800} height={400} data={data.labels.map((label, index) => ({
            date: label,
            actual: data.actual[index],
            predicted: data.predicted[index]
          }))} margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 50
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke={COLORS[0]} name="Actual" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted" stroke={COLORS[1]} name="Predicted" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <CustomLegend items={legendItems} />
        </div>
      </div>
    </motion.div>;
};