import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import axios from "axios";

function Quiz() {
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/quiz-summary")
      .then((res) => {
        const formatted = res.data.map((item) => ({
          name: item.course_id,
          total: item.quizzes_completed,
          maxScore: 20,
          score: item.quizzes_completed,
        }));
        setQuizData(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch quiz data:", err);
      });
  }, []);

  return (
    <div className="flex w-full min-h-screen justify-center items-center p-4">
      <div className="w-full max-w-7xl bg-white rounded-xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col gap-8">
          {/* Chart Section */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
                  Quiz Performance
                </h1>
                <p className="text-sm md:text-base text-gray-500">
                  Total quizzes
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md bg-white text-gray-700 w-full sm:w-auto">
                  <DownloadIcon size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="h-[300px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quizData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eaeaea"
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 45]}
                    ticks={[0, 10, 20, 30, 40, 50]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border shadow p-2 rounded text-sm text-gray-700">
                            <p className="font-semibold">
                              Course: {payload[0].payload.name}
                            </p>
                            <p>Total quizzes: {payload[0].payload.total}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="score"
                    fill="#a78bfa"
                    radius={[4, 4, 0, 0]}
                    barSize={100}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Quiz Breakdown
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              Total quizzes
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-medium border-b-2 border-gray-200">
                      Courses
                    </th>
                    <th className="py-3 px-4 text-right text-gray-600 font-medium border-b-2 border-gray-200">
                      Total Quizzes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-800 font-medium">
                        {item.name}
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-700">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
