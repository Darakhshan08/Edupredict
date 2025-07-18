import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineAppstore, AiOutlineHome } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { TbReportAnalytics } from 'react-icons/tb';
import { GrPieChart } from 'react-icons/gr';
import { MdMenu } from 'react-icons/md';
import { RiLoginBoxLine, RiLogoutBoxFill } from 'react-icons/ri';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Award, Book, CalendarClock, ChartColumnBig, CloudUpload, LayoutDashboard, LogOut, MessageSquare, NotepadText, Settings, Users, UserX } from 'lucide-react';
import { Student } from './Tabs/Student';
import Attendance from './../pages/Attendance';

const Sidebar = () => {
  const isTabletMid = window.innerWidth <= 768;
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef(null);
  const {
    pathname
  } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const admin_token = localStorage.getItem("admin");
  const teacher_token = localStorage.getItem("teacher");
  const student_token = localStorage.getItem("student");
  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    }
  }, [pathname]);
  const Nav_animation = isTabletMid ? {
    open: {
      x: 0,
      width: '16rem',
      transition: {
        damping: 40
      }
    },
    closed: {
      x: -250,
      width: 0,
      transition: {
        damping: 40,
        delay: 0.15
      }
    }
  } : {
    open: {
      width: '16rem',
      transition: {
        damping: 40
      }
    },
    closed: {
      width: '4rem',
      transition: {
        damping: 40
      }
    }
  };
  // Animation variants for menu items
  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  return (
  <>
  <div className="bg-white shadow-md z-10">
      <div onClick={() => setOpen(false)} className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${open ? 'block' : 'hidden'} `}></div>
      <motion.div ref={sidebarRef} variants={Nav_animation} initial={{
      x: isTabletMid ? -250 : 0
    }} animate={open ? 'open' : 'closed'} className="bg-white text-gray z-[999] max-w-[16rem] w-[16rem] 
            overflow-hidden md:relative fixed
         h-screen shadow-xl">
        <div className="gradient-bg flex items-center gap-2.5 font-medium py-4 border-slate-300 mx-3 rounded-b-xl mb-4">
          <motion.div className="flex items-center justify-center bg-white rounded-full p-1 ml-3 w-10 h-10" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <img src="https://via.placeholder.com/35?text=EP" width={35} alt="Logo" className="rounded-full" />
          </motion.div>
          <AnimatePresence>
            {open && <motion.span initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="text-xl font-bold whitespace-pre text-white">
                EduPredict
              </motion.span>}
          </AnimatePresence>
        </div>
        <div className="flex flex-col h-full">
          <motion.ul className="whitespace-pre px-2.5 text-[0.9rem] py-2 flex flex-col gap-2 font-medium overflow-x-hidden md:h-[68%] h-[70%]" variants={containerVariants} initial="hidden" animate="show">
          {!admin_token && !teacher_token && !student_token && (
            <>
        <motion.li variants={itemVariants}>
          <NavLink to="/login" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <RiLoginBoxLine size={23} className="min-w-max" />
            {open && <span>Login</span>}
          </NavLink>
        </motion.li>
        <motion.li variants={itemVariants}>
          <NavLink to="/register" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
            <RiLoginBoxLine size={23} className="min-w-max" />
            {open && <span>Register</span>}
          </NavLink>
        </motion.li>
        </>
      )}
       {/* Admin-specific links */}
       {admin_token && (
        <>
          <motion.li variants={itemVariants}>
            <NavLink to="/attendance" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <LayoutDashboard size={26} className="min-w-max" />
              Dashboard
            </NavLink>
          </motion.li>
          <motion.li variants={itemVariants}>
            <NavLink to="/usermanagement" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <Users size={26} className="min-w-max" />
              User Management
            </NavLink>
          </motion.li>

          <motion.li variants={itemVariants}>
            <NavLink to="/dataset" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <CloudUpload size={26} className="min-w-max" />
              Datasets
            </NavLink>
          </motion.li>

          <motion.li variants={itemVariants}>
            <NavLink to="/lms" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <TbReportAnalytics size={26} className="min-w-max" />
              {open && <span>LMS</span>}
            </NavLink>
          </motion.li>

          <motion.li variants={itemVariants}>
            <NavLink to="/demographics" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <GrPieChart size={26} className="min-w-max" />
              {open && <span>Demographics</span>}
            </NavLink>
          </motion.li>
          <motion.li variants={itemVariants}>
            <NavLink to="/feedback" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <MessageSquare size={26} className="min-w-max" />
              Feedback
            </NavLink>
          </motion.li>
          <motion.li variants={itemVariants}>
            <NavLink to="/setting" className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
              <Settings size={26} className="min-w-max" />
              Settings
            </NavLink>
          </motion.li>
        </>
      )}
    
           
           
            {student_token && <>
                <motion.li variants={itemVariants} className="mt-2">
                  <AnimatePresence>
                    {open && <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }} className="text-xs font-semibold text-gray-400 px-2 mb-1 uppercase">
                        Student Portal
                      </motion.div>}
                  </AnimatePresence>
                </motion.li>
                
                <motion.li variants={itemVariants}>
                  <NavLink to="/studentdashboard" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <LayoutDashboard size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Dashboard
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink to="/courses" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <Book  size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Courses
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>
                
              <motion.li variants={itemVariants}>
                  <NavLink to="/studentattendance" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <UserX size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                        Student Attendance

                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>


                <motion.li variants={itemVariants}>
                  <NavLink to="/studentquiz" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <NotepadText size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Quiz
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink to="/assignment" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <Award size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                        Assignment
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink to="/feedbacks" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <MessageSquare size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                       Feedback
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink to="/settings" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <Settings size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                        Settings
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

              </>}





            {teacher_token && <>
                <motion.li variants={itemVariants} className="mt-2">
                  <AnimatePresence>
                    {open && <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} exit={{
                  opacity: 0
                }} className="text-xs font-semibold text-gray-400 px-2 mb-1 uppercase">
                        Teacher Portal
                      </motion.div>}
                  </AnimatePresence>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <NavLink to="/teacherdashboard" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <LayoutDashboard size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Dashboard
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink to="/dropoutrisk" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <UserX size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                        Dropout Risk

                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>
              
                <motion.li variants={itemVariants}>
                  <NavLink to="/attendances" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <CalendarClock size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                        Attendence

                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>

                <motion.li variants={itemVariants}>
                  <NavLink to="/demand" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <ChartColumnBig size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                         Course Demand

                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <NavLink to="/feedbackteac" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <MessageSquare   size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Feedback
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>
                    <motion.li variants={itemVariants}>
                  <NavLink to="/settings" className={({
                isActive
              }) => `flex items-center gap-3.5 p-2.5 rounded-lg transition-all duration-200 ${isActive ? 'sidebar-link-active font-bold' : 'hover:bg-gray-100'}`}>
                    <Settings   size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Settings
                        </motion.span>}
                    </AnimatePresence>
                  </NavLink>
                </motion.li>


              </>}
            {(admin_token || student_token || teacher_token) && <>
                <motion.li variants={itemVariants} className="mt-auto mb-3">
                  <div className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200" onClick={() => {
                if (admin_token) localStorage.removeItem('admin');
                if (student_token) localStorage.removeItem('student');
                if (teacher_token) localStorage.removeItem('teacher');
                navigate('/');
                window.location.reload();
              }}>
                    <LogOut size={26} className="min-w-max" />
                    <AnimatePresence>
                      {open && <motion.span initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} exit={{
                    opacity: 0
                  }}>
                          Logout
                        </motion.span>}
                    </AnimatePresence>
                  </div>
                </motion.li>
              </>}
          </motion.ul>
        </div>
        <motion.div onClick={() => {
        setOpen(!open);
      }} animate={open ? {
        x: 0,
        y: 0,
        rotate: 0
      } : {
        x: -10,
        y: -200,
        rotate: 180
      }} transition={{
        duration: 0
      }} className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer">
          <motion.div whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }}>
            <IoIosArrowBack size={25} className="text-indigo-600" />
          </motion.div>
        </motion.div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <motion.div whileHover={{
        scale: 1.1
      }} whileTap={{
        scale: 0.9
      }}>
          <MdMenu size={25} className="text-indigo-600" />
        </motion.div>
      </div>
    </div>
    </>
  )
};
export default Sidebar;