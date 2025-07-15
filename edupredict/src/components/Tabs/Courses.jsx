import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { attendance_course_performance } from "../../Api/internal";
import Loader from "../Custom/Loader";
const COLORS = ["#4F46E5", "#5db095", "#F59E0B", "#EF4444"];
export const Courses = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchdata = async () => {
    setLoading(true);
    const response = await attendance_course_performance();
    if (response.status == 200) {
      setData(response.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchdata();
  }, []);
  if (loading) {
    return <Loader />;
  }

  const chartData = data?.course_ids
    ?.map((course, index) => {
      const present = data?.metrics?.presence_rate?.[index];
      const late = data?.metrics?.late_rate?.[index];
      const absent = data?.metrics?.absence_rate?.[index];

      if (
        course !== null &&
        present !== undefined &&
        late !== undefined &&
        absent !== undefined
      ) {
        return {
          course: course.trim(),
          present,
          late,
          absent,
        };
      }
      return null;
    })
    .filter(Boolean); // 🔥 clean array for chart

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      className="space-y-6 p-6"
    >
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Course Performance
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {data?.course_ids && data.course_ids.length > 0 ? (
              <BarChart width={600} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#00C49F" />
                <Bar dataKey="late" fill="#FFBB28" />
                <Bar dataKey="absent" fill="#FF8042" />
              </BarChart>
            ) : (
              <p>📉 No data available for chart.</p>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};
