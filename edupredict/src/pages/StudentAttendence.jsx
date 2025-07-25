import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DownloadIcon, ChevronDownIcon } from "lucide-react";
import { attendance_course_performance } from "../Api/internal";
import Loader from "../components/Custom/Loader";

function StudentAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchdata = async () => {
    setLoading(true);
    const response = await attendance_course_performance();
    if (response.status === 200) {
      setData(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  if (loading || !data) return <Loader />;

  const chartData = data.course_ids.map((course, index) => ({
    name: course,
    present: data.metrics.present_count[index],
    absent: data.metrics.absent_count[index],
  }));

  const attendanceData = data.course_ids.map((course, index) => {
    const present = data.metrics.present_count[index];
    const absent = data.metrics.absent_count[index];
    const percentage =
      present + absent > 0
        ? ((present / (present + absent)) * 100).toFixed(1) + "%"
        : "0%";

    return {
      name: course,
      completed: "Ongoing",
      present,
      absent,
      percentage,
    };
  });

  return (
    <div className="w-full min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        {/* Performance Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Attendance Performance
              </h2>
              <p className="text-gray-600">
              Overview of total attendance by course
              </p>
            </div>
            {/* <div className="flex gap-2 relative">
              <button className="flex items-center px-4 py-2 bg-[#f7f9e6] text-gray-700 rounded-md border border-gray-200">
                <DownloadIcon className="mr-2 h-4 w-4" />
                <span>Download</span>
              </button>
            </div> */}
          </div>
          <div className="h-[200px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 700]}
                  ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="present" fill="#4F75FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#00D7FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            Attendance Breakdown
          </h2>
          <p className="text-gray-600 mb-6">
            Detailed attendance for each course
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Course
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Present
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium border border-gray-300">
                    Absent
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-gray-800 border border-gray-300">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-gray-800 border border-gray-300">
                      {item.present}
                    </td>
                    <td className="py-3 px-4 text-gray-800 border border-gray-300">
                      {item.absent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;
