import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { teacher_analysis } from '../Api/internal';
import Loader from '../components/Custom/Loader';
import TeacherTop from '../components/Tabs/TeacherTop';

const TeacherDashboard = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await teacher_analysis();
      if (res.status == 200) {
        setCourseData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading || courseData == null) {
    return <Loader />;
  }
 



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
  const classes = ['Mathematics 101', 'Mathematics 202', 'Advanced Calculus'];
  const activities = ['John D. submitted assignment', 'Sarah M. requested help', 'Quiz results are ready', 'New announcement posted'];
  return <motion.div className="p-4" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="mb-6" variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600">
          Track and Analyze your Student and Course records
        </p>
      </motion.div>

 <TeacherTop  data={courseData.summary_metrics} />




      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
            Your Classes
          </h2>
          <ul className="divide-y space-y-1">
            {classes.map((course, i) => <motion.li key={i} className="py-3 flex justify-between items-center" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: i * 0.1
          }} whileHover={{
            x: 5,
            transition: {
              duration: 0.2
            }
          }}>
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}>
                    {course.charAt(0)}
                  </div>
                  <span className="font-medium ml-2">{course}</span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <motion.button className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-colors duration-200" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                    Attendance
                  </motion.button>
                  <motion.button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors duration-200" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                    Materials
                  </motion.button>
                </div>
              </motion.li>)}
          </ul>
          <motion.div className="mt-4 pt-4 border-t" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }}>
            <motion.button className="w-full px-4 py-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors duration-200 text-sm font-medium" whileHover={{
            scale: 1.01
          }} whileTap={{
            scale: 0.99
          }}>
              Add New Class
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            Recent Activity
          </h2>
          <ul className="divide-y space-y-1">
            {activities.map((activity, i) => <motion.li key={i} className="py-3 flex justify-between items-center" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: i * 0.1
          }} whileHover={{
            x: 5,
            transition: {
              duration: 0.2
            }
          }}>
                <div className="flex items-start">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-red-500' : i === 2 ? 'bg-blue-500' : 'bg-yellow-500'} mr-2`}></div>
                  <div>
                    <span className="font-medium">{activity}</span>
                    <div className="text-xs text-gray-500">
                      {new Date(Date.now() - i * 3600000).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                    </div>
                  </div>
                </div>
                <motion.button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  View
                </motion.button>
              </motion.li>)}
          </ul>
          <motion.div className="mt-4 pt-4 border-t" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }}>
            <motion.button className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium" whileHover={{
            scale: 1.01
          }} whileTap={{
            scale: 0.99
          }}>
              View All Activity
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 lg:col-span-2" variants={itemVariants}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[{
            title: 'Take Attendance',
            icon: '📋',
            color: 'bg-blue-50 border-blue-100 text-blue-800'
          }, {
            title: 'Grade Assignments',
            icon: '✏️',
            color: 'bg-emerald-50 border-emerald-100 text-emerald-800'
          }, {
            title: 'Create Quiz',
            icon: '📝',
            color: 'bg-amber-50 border-amber-100 text-amber-800'
          }, {
            title: 'Send Message',
            icon: '💬',
            color: 'bg-purple-50 border-purple-100 text-purple-800'
          }].map((action, i) => <motion.div key={i} className={`p-4 ${action.color} rounded-lg border text-center cursor-pointer`} whileHover={{
            y: -5,
            scale: 1.03,
            transition: {
              duration: 0.2
            }
          }} whileTap={{
            scale: 0.97
          }}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-medium text-sm">{action.title}</div>
              </motion.div>)}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>;
};
export default TeacherDashboard;