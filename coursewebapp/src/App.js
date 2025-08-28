import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCourses from './components/admin/AdminCourses';
import AdminCourseForm from './components/admin/AdminCourseForm';
import AdminStats from './components/admin/AdminStats';
import LearningList from './components/learning/LearningList';
import Lecture from './components/learning/Lecture';
import Exam from './components/learning/Exam';
import Forum from './components/learning/Forum';
import DashboardLayout from './components/learning/Dashboard';
import PostDetail from './components/learning/PostDetail';
import Notifications from './components/learning/Notifications';
import ErrorPage from './components/system/ErrorPage';
import ForgotPassword from './components/system/ForgotPassword';
import ResetPassword from './components/system/ResetPassword';
import PaymentResult from './components/system/PaymentResult';

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
              {/* Placeholder cho các trang khác */}
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/courses/new" element={<AdminCourseForm />} />
              <Route path="/admin/courses/:id/edit" element={<AdminCourseForm />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              {/* Learning */}
              <Route path="/learning" element={<LearningList />} />
              <Route path="/learning/course/:id" element={<DashboardLayout />}>
                <Route path="lectures" element={<Lecture />} />
                <Route path="exams" element={<Exam />} />
                <Route path="forum" element={<Forum />} />
                <Route index element={<Lecture />} />
              </Route>
              <Route path="/learning/exam/:id" element={<Exam />} />
              <Route path="/learning/forum" element={<Forum />} />
              <Route path="/learning/forum/:id" element={<PostDetail />} />
              <Route path="/learning/notifications" element={<Notifications />} />
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
