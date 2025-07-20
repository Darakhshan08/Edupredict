import React, { useState, useEffect } from 'react';
import { LineChartIcon, DownloadIcon, ChevronDownIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function Dropout_risk() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [studentRes] = await Promise.all([
            axios.get("http://localhost:3001/dropout_risk_percentage")
          ]);
          setStudentData(studentRes.data);
        } catch (err) {
          console.error("API Error:", err);
        }
      };
  
      fetchData();
    }, []);
  
    
   
  




  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
    className="bg-white rounded-lg p-6 shadow-lg"
  >
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Dropout Risk Student</h2>
      <p className="text-gray-600">Individual student dropout risk predictions.</p>
    </div>

    <div className="flex justify-between mb-6 relative">
      <div className="flex-grow" />
      <div className="flex gap-4">
       

      

        <button className="bg-white border border-gray-200 px-4 py-2 rounded-md flex items-center gap-2 text-gray-700">
          <DownloadIcon size={16} />
          <span>Download</span>
        </button>
      </div>
    </div>

    {/* Table Section */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Student Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Attendance</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Avg.Grade</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Risk Level</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Dropout Risk</th>
            
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {studentData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((student, index) => {
                const maxRisk = Object.entries(student.estimated_dropout_risk_percentage).reduce(
                  (a, b) => (a[1] > b[1] ? a : b)
                )[0];

                const riskColor = {
                  Low: "bg-green-200 text-green-800",
                  Medium: "bg-orange-200 text-orange-800",
                  High: "bg-red-200 text-red-800"
                };

                const percentage = student.estimated_dropout_risk_percentage[maxRisk].toFixed(2) + "%";
                const attendance = student.attendance.toFixed(2) + "%";
                const grade = student.average_score.toFixed(2) + "%";

                return (
                  <motion.tr
                    key={student.student_id + index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-3 px-4 text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-gray-800">{student.Course}</td>
                    <td className="py-3 px-4 text-gray-800">{attendance}</td>
                    <td className="py-3 px-4 text-gray-800">{grade}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full ${riskColor[maxRisk]}`}>
                        {maxRisk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">{percentage}</td>
                    
                  </motion.tr>
                );
              })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-center mt-6 gap-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700">Page {currentPage}</span>
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            prev < Math.ceil(studentData.length / itemsPerPage) ? prev + 1 : prev
          )
        }
        disabled={currentPage === Math.ceil(studentData.length / itemsPerPage)}
        className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </motion.div>
  )
}

export default Dropout_risk