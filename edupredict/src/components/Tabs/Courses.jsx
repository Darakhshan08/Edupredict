import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, Legend, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
const COLORS = ["#4F46E5", "#5db095", "#F59E0B", "#EF4444"];
export const Courses = () => {
  const [data, setData] = useState(null);
  // Mock API function
  const mockCoursePerformance = () => {
    const courses = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History'];
    const courseData = {
      course_ids: courses,
      metrics: {
        presence_rate: [],
        late_rate: [],
        absence_rate: []
      }
    };
    courses.forEach(() => {
      // Generate random percentages that add up to 100%
      const present = Math.floor(Math.random() * 60) + 40; // 40-100%
      const remaining = 100 - present;
      const late = Math.floor(Math.random() * remaining);
      const absent = remaining - late;
      courseData.metrics.presence_rate.push(present);
      courseData.metrics.late_rate.push(late);
      courseData.metrics.absence_rate.push(absent);
    });
    return courseData;
  };
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const response = mockCoursePerformance();
      setData(response);
    }, 500);
  }, []);
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Course Performance
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.course_ids.map((course, index) => ({
            course,
            present: data.metrics.presence_rate[index],
            late: data.metrics.late_rate[index],
            absent: data.metrics.absence_rate[index]
          }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" name="Present" fill={COLORS[1]} />
              <Bar dataKey="late" name="Late" fill={COLORS[2]} />
              <Bar dataKey="absent" name="Absent" fill={COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>;
};