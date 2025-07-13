import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenIcon, GraduationCapIcon, UserIcon } from 'lucide-react';
import {
  create_credentials,
  login,
} from "../Api/auth";
import { Navigate, useNavigate } from "react-router-dom";
const Login = () => {
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    createWebUsers();
  }, []);

  const createWebUsers = async () => {
    const response = await create_credentials();
    if (response?.status === 200) {
      console.log(response.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    if (!email || !password) {
      setMsg("Enter required fields");
      setLoading(false);
      return;
    }

    // 🧠 Determine role
    let role = "admin";
    if (isStudent) role = "student";
    else if (isTeacher) role = "teacher";

    const data = { email, password, role };
    const response = await login(data);

    if (response?.status === 200) {
      const { token, student, courses } = response.data;

      // Store token and user info in localStorage
      if (role === "student") {
        localStorage.setItem("student", JSON.stringify({ token, student }));
      } else if (role === "teacher") {
        localStorage.setItem("teacher", JSON.stringify({ token, courses }));
      } else if (role === "admin") {
        localStorage.setItem("admin", token);
      }

      navigate("/");
    } else {
      setMsg("Invalid credentials");
    }

    setLoading(false);
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const selectAccountType = (type) => {
    if (type === "student") {
      setIsStudent(true);
      setIsTeacher(false);
    } else if (type === "teacher") {
      setIsTeacher(true);
      setIsStudent(false);
    } else {
      setIsTeacher(false);
      setIsStudent(false);
    }
  };
  

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center"
        >
          <BookOpenIcon size={40} className="text-white" />
          <span className="text-white text-3xl font-bold ml-2">EduPredict</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white"
        >
          <h2 className="text-4xl font-bold mb-6">Unlock the power of AI in education</h2>
          <p className="text-xl opacity-80">
            Access your analytics dashboard to transform the way you teach and learn.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <GraduationCapIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Personalized learning experiences</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <UserIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Student progress tracking</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <BookOpenIcon size={18} className="text-white" />
              </div>
              <p className="text-white/90">Data-driven teaching insights</p>
            </div>
          </div>
        </motion.div>

        <div className="text-white/60 text-sm">© 2025 EduPredict. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="w-full max-w-md">
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="lg:hidden flex items-center justify-center mb-4">
              <BookOpenIcon size={32} className="text-blue-600" />
              <span className="text-2xl font-bold ml-2 text-blue-600">EduPredict</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to continue to your dashboard</p>
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Select Account Type:</span>
                {isStudent == true || isTeacher == true ? (
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:text-blue-800"
                    onClick={() => selectAccountType('admin')}
                  >
                    Clear Selection
                  </button>
                ) : (
                  <></>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Teacher */}
                <motion.button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    isTeacher &&
                       'border-blue-600 bg-blue-50 text-blue-700'
                      
                  }`}
                  onClick={() => {
                    setIsStudent(false);
                    setIsTeacher(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isTeacher ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <UserIcon size={30} className={isTeacher && 'text-blue-600'} />
                  </div>
                  <span className={`font-medium ${isTeacher && 'text-blue-700'}`}>Teacher</span>
                </motion.button>

                {/* Student */}
                <motion.button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    isStudent &&
                       'border-blue-600 bg-blue-50 text-blue-700'
                      
                  }`}
                  onClick={() => {
                    setIsTeacher(false);
                    setIsStudent(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isStudent ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <GraduationCapIcon size={30} className={isStudent && 'text-blue-600'} />
                  </div>
                  <span className={`font-medium ${isStudent && 'text-blue-700'}`}>Student</span>
                </motion.button>
              </div>

              {!isStudent && !isTeacher && (
                <p className="text-center text-sm text-gray-500 mt-2">No selection will default to Admin login</p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <motion.input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                whileFocus={{ scale: 1.01 }}
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a> */}
              </div>
              <motion.input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                whileFocus={{ scale: 1.01 }}
                required
              />
            </motion.div>

            {/* Error Message */}
            {msg && (
              <motion.div
                className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {msg}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                 {loading ? "logging" : "Login to your account"}

                {/* {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )} */}
              </motion.button>
            </motion.div>

            {/* Register Link */}
            {/* <motion.div className="text-center text-sm text-gray-600" variants={itemVariants}>
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Create one now
              </a>
            </motion.div> */}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
export default Login;