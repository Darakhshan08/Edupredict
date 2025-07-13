import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Attendance from "./pages/Attendance";
import LMS from "./pages/LMS";
import Demographics from "./pages/Demographics";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AuthLayout from "./components/Custom/AuthLayout";
import Redirect from "./pages/Redirect";
import UserManagement from "./pages/UserManagement";
import Register from "./pages/Register";
import Dataset from "./pages/Dataset";
import Setting from "./pages/Setting";
import Feedback from "./pages/Feedback";
export function App() {
  // For demo purposes, we'll add state to toggle between user roles
  const [userRole, setUserRole] = useState("none");
  // Set up mock login functionality
  const handleLogin = (role) => {
    localStorage.setItem(role, "token");
    setUserRole(role);
  };
  // Set up mock logout functionality
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("teacher");
    localStorage.removeItem("student");
    setUserRole("none");
  };
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <AnimatePresence mode="wait">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/attendance"
                  element={
                    <AuthLayout token={"admin"}>
                      <Attendance />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/usermanagement"
                  element={
                    <AuthLayout token={"admin"}>
                      <UserManagement />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/dataset"
                  element={
                    <AuthLayout token={"admin"}>
                      <Dataset />
                    </AuthLayout>
                  }
                />

                <Route
                  path="/lms"
                  element={
                    <AuthLayout token={"admin"}>
                      <LMS />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/demographics"
                  element={
                    <AuthLayout token={"admin"}>
                      <Demographics />
                    </AuthLayout>
                  }
                />
                 <Route
                  path="/feedback"
                  element={
                    <AuthLayout token={"admin"}>
                      <Feedback/>
                    </AuthLayout>
                  }
                />
                <Route
                  path="/setting"
                  element={
                    <AuthLayout token={"admin"}>
                      <Setting />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/studentdashboard"
                  element={
                    <AuthLayout token={"student"}>
                      <StudentDashboard />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/teacherdashboard"
                  element={
                    <AuthLayout token={"teacher"}>
                      <TeacherDashboard />
                    </AuthLayout>
                  }
                />
                 <Route
                  path="/feedbacks"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Feedback/>
                    </AuthLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AuthLayout token={"teacher"}>
                      <Setting />
                    </AuthLayout>
                  }
                />
              </Routes>
            </Layout>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
