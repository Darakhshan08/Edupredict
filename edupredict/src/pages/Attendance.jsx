import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UsersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  BarChart2Icon
} from "lucide-react";
import { Overview } from '../components/Tabs/Overview';
import { Courses } from '../components/Tabs/Courses';
import { Student } from '../components/Tabs/Student';
const Attendance = () => {
  const [activeTab, setActiveTab] = useState('attendance');

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
   // Mock student data for the Student tab
   const studentData = [{
    student_id: "S001",
    avg_attendance: 92,
    present_count: 46,
    late_count: 3,
    absent_count: 1
  }, {
    student_id: "S002",
    avg_attendance: 78,
    present_count: 39,
    late_count: 6,
    absent_count: 5
  }, {
    student_id: "S003",
    avg_attendance: 85,
    present_count: 42,
    late_count: 5,
    absent_count: 3
  }, {
    student_id: "S004",
    avg_attendance: 63,
    present_count: 31,
    late_count: 8,
    absent_count: 11
  }];







  return <motion.div variants={containerVariants} initial="hidden" animate="visible" className="px-2">
      <motion.div className="mb-6" variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Attendance Management
        </h1>
        <p className="text-gray-600">
          Track and monitor student attendance records
        </p>
      </motion.div>
      <motion.div
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }}
>
  <motion.div
    className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center gap-3 mb-2">
      <UsersIcon size={28} className="text-green-600" />
      <div className="text-sm text-gray-600">Total Students</div>
    </div>
    <div className="text-3xl font-extrabold text-green-600">248</div>
  </motion.div>

  <motion.div
    className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center gap-3 mb-2">
      <CheckCircle2Icon size={28} className="text-blue-600" />
      <div className="text-sm text-gray-600">Present Today</div>
    </div>
    <div className="text-3xl font-extrabold text-blue-600">215</div>
  </motion.div>

  <motion.div
    className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500 hover:shadow-lg transition-all duration-300"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center gap-3 mb-2">
      <XCircleIcon size={28} className="text-red-600" />
      <div className="text-sm text-gray-600">Absent Today</div>
    </div>
    <div className="text-3xl font-extrabold text-red-600">33</div>
  </motion.div>

  <motion.div
    className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300"
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
  >
    <div className="flex items-center gap-3 mb-2">
      <BarChart2Icon size={28} className="text-yellow-600" />
      <div className="text-sm text-gray-600">Attendance Rate</div>
    </div>
    <div className="text-3xl font-extrabold text-yellow-600">87%</div>
  </motion.div>
</motion.div>
     {/* Tab Navigation */}
     <motion.div
  className="mb-6 bg-white rounded-lg shadow p-2 flex flex-wrap sm:flex-nowrap sm:overflow-x-auto gap-2"
  variants={itemVariants}
  initial="hidden"
  animate="visible"
>
  <TabButton
    active={activeTab === 'attendance'}
    onClick={() => setActiveTab('attendance')}
    label="Attendance"
  />
  <TabButton
    active={activeTab === 'overview'}
    onClick={() => setActiveTab('overview')}
    label="Overview"
  />
  <TabButton
    active={activeTab === 'courses'}
    onClick={() => setActiveTab('courses')}
    label="Courses"
  />
  <TabButton
    active={activeTab === 'students'}
    onClick={() => setActiveTab('students')}
    label="Students"
  />
</motion.div>

      {/* Tab Content */}
      <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden" variants={itemVariants} key={activeTab} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }}>
        {activeTab === 'attendance' && <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">
                Today's Attendance
              </h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <select className="px-3 py-1 border rounded text-sm w-full sm:w-auto">
                  <option>All Classes</option>
                  <option>Class 1</option>
                  <option>Class 2</option>
                  <option>Class 3</option>
                </select>
                <motion.button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm w-full sm:w-auto" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  Export
                </motion.button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map(i => <motion.tr key={i} className="hover:bg-gray-50" initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: i * 0.05
              }} whileHover={{
                backgroundColor: 'rgba(249, 250, 251, 0.8)'
              }}>
                      <td className="px-4 py-3 whitespace-nowrap" data-label="Student">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium mr-3">
                            {String.fromCharCode(64 + i)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Student {i}
                            </div>
                            <div className="text-xs text-gray-500">ID: S00{i}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" data-label="Class">
                        <div className="text-sm text-gray-900">
                          Class {Math.floor(Math.random() * 5) + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" data-label="Status">
                        {Math.random() > 0.3 ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Present
                          </span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Absent
                          </span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500" data-label="Time">
                        9:0{i} AM
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm" data-label="Actions">
                        <motion.button className="text-indigo-600 hover:text-indigo-900 mr-3" whileHover={{
                    scale: 1.1
                  }} whileTap={{
                    scale: 0.9
                  }}>
                          Edit
                        </motion.button>
                        <motion.button className="text-gray-600 hover:text-gray-900" whileHover={{
                    scale: 1.1
                  }} whileTap={{
                    scale: 0.9
                  }}>
                          Notes
                        </motion.button>
                      </td>
                    </motion.tr>)}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t">
              <div className="flex-1 flex justify-between sm:hidden mb-3 w-full">
                <motion.button className="px-4 py-2 border rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  Previous
                </motion.button>
                <motion.button className="ml-3 px-4 py-2 border border-indigo-500 rounded text-sm font-medium text-indigo-700 bg-white hover:bg-gray-50" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  Next
                </motion.button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">5</span> of{' '}
                    <span className="font-medium">20</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <motion.button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" whileHover={{
                  backgroundColor: 'rgba(249, 250, 251, 0.8)'
                }} whileTap={{
                  scale: 0.97
                }}>
                      Previous
                    </motion.button>
                    <motion.button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" whileHover={{
                  backgroundColor: 'rgba(249, 250, 251, 0.8)'
                }} whileTap={{
                  scale: 0.97
                }}>
                      1
                    </motion.button>
                    <motion.button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-gray-50" whileHover={{
                  backgroundColor: 'rgba(238, 242, 255, 0.8)'
                }} whileTap={{
                  scale: 0.97
                }}>
                      2
                    </motion.button>
                    <motion.button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" whileHover={{
                  backgroundColor: 'rgba(249, 250, 251, 0.8)'
                }} whileTap={{
                  scale: 0.97
                }}>
                      3
                    </motion.button>
                    <motion.button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" whileHover={{
                  backgroundColor: 'rgba(249, 250, 251, 0.8)'
                }} whileTap={{
                  scale: 0.97
                }}>
                      Next
                    </motion.button>
                  </nav>
                </div>
              </div>
            </div>
          </>}
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'courses' && <Courses />}
        {activeTab === 'students' && <Student data={studentData} />}
      </motion.div>
    </motion.div>;
};

const TabButton = ({ active, onClick, label }) => (
  <motion.button
    onClick={onClick}
    className={` flex-1 py-2 px-4 text-sm font-medium rounded-md text-center
    transition-colors duration-200
      ${
        active 
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
  >
    {label}
    </motion.button>
);






// Tab Button Component
// const TabButton = ({ active, onClick, label }) => (
//   <motion.button
//   onClick={onClick}
//   className={`
//     flex-1 py-2 px-4 text-sm font-medium rounded-md text-center
//     transition-colors duration-200
//     ${active ? 'bg-indigo-400 text-black' : 'text-gray-700'}
//   `}
//   whileHover={
//     !active
//       ? { backgroundColor: '#e0e7ff' } // bg-indigo-100
//       : {}
//   }
//   whileTap={{ scale: 0.97 }}
// >
//   {label}
// </motion.button>
// );

export default Attendance;