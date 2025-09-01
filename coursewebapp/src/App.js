import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import Login from './components/Login';
import Register from './components/Register';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminStats from './components/admin/AdminStats';
import PendingCourses from './components/admin/PendingCourses';
import UserManagement from './components/admin/UserManagement';
import LearningList from './components/learning/LearningList';
import Lecture from './components/learning/Lecture';
import Exam from './components/learning/Exam';
import Forum from './components/learning/Forum';
import DashboardLayout from './components/learning/Dashboard';
import ErrorPage from './components/system/ErrorPage';
import ForgotPassword from './components/system/ForgotPassword';
import ResetPassword from './components/system/ResetPassword';
import PaymentResult from './components/system/PaymentResult';
import Profile from './components/Profile';
import CourseHistory from './components/CourseHistory';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/course-history" element={<CourseHistory />} />
              {/* Placeholder cho các trang khác */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              {/* Admin */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="pending-courses" element={<PendingCourses />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="stats" element={<AdminStats />} />
              </Route>
              {/* Learning */}
              <Route path="/learning" element={<LearningList />} />
              <Route path="/learning/course/:id" element={<DashboardLayout />}>
                <Route path="lectures" element={<Lecture />} />
                <Route path="exams" element={<Exam />} />
                <Route path="forum" element={<Forum />} />
                <Route path="forum/post/:postId" element={<Forum />} />
                <Route index element={<Lecture />} />
              </Route>
              <Route path="/learning/exam/:id" element={<Exam />} />
              <Route path="/learning/forum" element={<Forum />} />
              {/* System */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/payment/result" element={<PaymentResult />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
