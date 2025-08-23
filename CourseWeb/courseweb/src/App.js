import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import SearchCard from './components/SearchCard';
import AdminActions from './components/AdminActions';
import CoursesSection from './components/CoursesSection';
import './styles/main.css';

// Mock data cho demo
const mockCourses = [
  {
    id: 1,
    title: 'Lập trình Web với ReactJS',
    description: 'Học lập trình web hiện đại với ReactJS, từ cơ bản đến nâng cao',
    price: '1,200,000',
    image: 'https://via.placeholder.com/400x200/667eea/ffffff?text=ReactJS',
    teacherId: { name: 'Nguyễn Văn A' }
  },
  {
    id: 2,
    title: 'Thiết kế UI/UX cơ bản',
    description: 'Khóa học thiết kế giao diện người dùng và trải nghiệm người dùng',
    price: '800,000',
    image: 'https://via.placeholder.com/400x200/764ba2/ffffff?text=UI/UX',
    teacherId: { name: 'Trần Thị B' }
  },
  {
    id: 3,
    title: 'Marketing Digital',
    description: 'Chiến lược marketing số hiệu quả cho doanh nghiệp',
    price: '1,500,000',
    image: 'https://via.placeholder.com/400x200/f093fb/ffffff?text=Marketing',
    teacherId: { name: 'Lê Văn C' }
  }
];

const mockCategories = [
  { id: 1, name: 'Lập trình' },
  { id: 2, name: 'Thiết kế' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Kinh doanh' }
];

function App() {
  const [courses, setCourses] = useState(mockCourses);
  const [categories, setCategories] = useState(mockCategories);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Demo admin mode

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData);
    // Implement search logic here
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  return (
    <Router>
      <div className="main-wrapper">
        <Navbar 
          categories={categories}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
        />
        
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <div className="container">
                  <SearchCard onSearch={handleSearch} />
                  
                  {isAdmin && <AdminActions />}
                  
                  <CoursesSection 
                    courses={courses}
                    isAdmin={isAdmin}
                    onDeleteCourse={handleDeleteCourse}
                  />
                </div>
              </>
            } />
            
            {/* Add more routes here */}
            <Route path="/courses/:id" element={<div>Course Detail Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/admin/courses" element={<div>Admin Courses</div>} />
            <Route path="/admin/courses/new" element={<div>New Course</div>} />
            <Route path="/admin/stats" element={<div>Admin Stats</div>} />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
