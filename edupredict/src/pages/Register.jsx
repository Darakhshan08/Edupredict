import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { BookOpenIcon, GraduationCapIcon, UserIcon } from 'lucide-react';
import { register } from '../Api/auth';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    student_id: '',
    courses: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'student' && { student_id: formData.student_id }),
      ...(formData.role === 'teacher' && { courses: formData.courses }),
    }

    const res = await register(payload)

    if (res?.status === 201) {
      setSuccess('Account created successfully!')
      setFormData({
        name: '',
        email: '',
        password: '',
        role: '',
        student_id: '',
        courses: '',
      })
    } else {
      setError(res?.data?.error || res?.data?.message || 'Registration failed.')
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
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
      

      <div className="w-full md:w-3/5 px-6 md:px-16 py-12 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">I am a:</label>
              <div className="grid grid-cols-2 gap-4">
                {['student', 'teacher'].map((roleOption) => (
                  <div
                    key={roleOption}
                    className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-colors ${
                      formData.role === roleOption
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        role: roleOption,
                      })
                    }
                  >
                    <div className="text-3xl mb-2">
                      {roleOption === 'student' ? '👨‍🎓' : '👨‍🏫'}
                    </div>
                    <span className="font-medium capitalize">{roleOption}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Fields */}
            {formData.role === 'student' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Enter your student ID"
                  required
                />
              </div>
            )}
            {formData.role === 'teacher' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Courses You Teach</label>
                <input
                  type="text"
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Math, Science, History"
                  required
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-70"
            >
              Create Account
            </button>
          </form>

          {/* Link to login */}
          {/* <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Register