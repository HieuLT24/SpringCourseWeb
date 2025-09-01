import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';
import Lecture from './Lecture';
import Exam from './Exam';
import Forum from './Forum';

function DashboardLayout() {
  const { id } = useParams();
  const courseId = parseInt(id);
  const [course, setCourse] = useState(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lectures');
  const { currentUser } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseById(courseId);
        setCourse(res.course);
        setEnrollmentCount(res.enrollmentCount || 0);
      } catch (e) {
        console.error('Load course failed', e);
      } finally {
        setLoading(false);
      }
    };
    if (!isNaN(courseId)) load();
  }, [courseId]);

  // Kiểm tra xem user có phải là giáo viên của khóa học này không
  const isTeacher = currentUser && course && currentUser.id === course.teacherId?.id;

  // Hàm render nội dung dựa trên tab được chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'lectures':
        return <Lecture />;
      case 'exams':
        return <Exam courseId={courseId} isTeacher={isTeacher} />;
      case 'forum':
        return <Forum />;
      default:
        return <Lecture />;
    }
  };

  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <h5 className="mb-3"><i className="fas fa-layer-group me-2"></i>Điều hướng</h5>
              <nav className="nav flex-column">
                <button 
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'lectures' ? 'active fw-semibold' : ''}`}
                  onClick={() => setActiveTab('lectures')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-play-circle me-2"></i>Bài giảng
                </button>
                <button 
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'exams' ? 'active fw-semibold' : ''}`}
                  onClick={() => setActiveTab('exams')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-file-alt me-2"></i>Bài thi
                </button>
                <button 
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === 'forum' ? 'active fw-semibold' : ''}`}
                  onClick={() => setActiveTab('forum')}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-comments me-2"></i>Forum & Thông báo
                </button>
              </nav>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
              {loading ? (
                <div className="text-muted">Đang tải thông tin khóa học...</div>
              ) : course ? (
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                  <img
                    src={course.image || `https://picsum.photos/seed/db${course.id}/200/120`}
                    alt={course.title}
                    style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8, background: '#f8f9fa' }}
                  />
                  <div className="flex-grow-1">
                    <h4 className="mb-2">{course.title}</h4>
                    <p className="text-muted mb-2">{course.description || 'Chưa có mô tả.'}</p>
                    <div className="d-flex flex-wrap gap-3 small">
                      <span><i className="fas fa-user-tie me-1"></i>Giảng viên: {course.teacherId?.name || 'Đang cập nhật'}</span>
                      <span><i className="fas fa-users me-1"></i>Học viên: {enrollmentCount}</span>
                    </div>
                    {isTeacher && (
                      <div className="mt-2">
                        <span className="badge bg-primary">
                          <i className="fas fa-crown me-1"></i>Giảng viên của khóa học
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-danger">Không tìm thấy khóa học.</div>
              )}
            </div>
            
            {/* Hiển thị nội dung dựa trên tab được chọn */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;


