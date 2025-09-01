import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learningService } from '../../services/learningService';
import { authService } from '../../services/authService';

function LearningList() {
  const [myCourses, setMyCourses] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState({ activeCourses: [], pendingCourses: [] });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        
        if (user && user.role === 'TEACHER') {
          const teacherData = await learningService.getTeacherCourses();
          if (teacherData.success) {
            setTeacherCourses({
              activeCourses: teacherData.activeCourses || [],
              pendingCourses: teacherData.pendingCourses || []
            });
          }
        } else {
          const data = await learningService.getMyCourses();
          setMyCourses(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser && currentUser.role === 'TEACHER') {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center mb-5 fw-bold text-primary">
                <i className="fas fa-chalkboard-teacher me-3"></i>
                Khóa Học Của Tôi
              </h1>
            </div>
          </div>

          {/* Khóa học đã active */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success text-white">
                  <h3 className="mb-0">
                    <i className="fas fa-check-circle me-2"></i>
                    Khóa Học Đã Duyệt ({teacherCourses.activeCourses.length})
                  </h3>
                </div>
                <div className="card-body">
                  {teacherCourses.activeCourses.length > 0 ? (
                    <div className="row g-4">
                      {teacherCourses.activeCourses.map(course => (
                        <div className="col-lg-4 col-md-6" key={course.id}>
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="position-relative">
                              <img 
                                src={course.image || 'https://via.placeholder.com/300x200?text=Khóa+Học'} 
                                className="card-img-top" 
                                alt={course.title}
                                style={{height: '200px', objectFit: 'cover'}}
                              />
                              <span className="badge bg-success position-absolute top-0 end-0 m-2">
                                Đã Duyệt
                              </span>
                            </div>
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title fw-bold">{course.title}</h5>
                              <p className="card-text text-muted flex-grow-1">
                                {course.description?.length > 100 
                                  ? course.description.substring(0, 100) + '...' 
                                  : course.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-primary fs-6">
                                  {course.price?.toLocaleString('vi-VN')} VNĐ
                                </span>
                                <Link 
                                  to={`/learning/course/${course.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  <i className="fas fa-play me-1"></i>
                                  Quản Lý
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Chưa có khóa học nào được duyệt</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Khóa học đang pending */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-warning text-dark">
                  <h3 className="mb-0">
                    <i className="fas fa-clock me-2"></i>
                    Khóa Học Đang Chờ Duyệt ({teacherCourses.pendingCourses.length})
                  </h3>
                </div>
                <div className="card-body">
                  {teacherCourses.pendingCourses.length > 0 ? (
                    <div className="row g-4">
                      {teacherCourses.pendingCourses.map(course => (
                        <div className="col-lg-4 col-md-6" key={course.id}>
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="position-relative">
                              <img 
                                src={course.image || 'https://via.placeholder.com/300x200?text=Khóa+Học'} 
                                className="card-img-top" 
                                alt={course.title}
                                style={{height: '200px', objectFit: 'cover'}}
                              />
                              <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                                Chờ Duyệt
                              </span>
                            </div>
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title fw-bold">{course.title}</h5>
                              <p className="card-text text-muted flex-grow-1">
                                {course.description?.length > 100 
                                  ? course.description.substring(0, 100) + '...' 
                                  : course.description}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-primary fs-6">
                                  {course.price?.toLocaleString('vi-VN')} VNĐ
                                </span>
                                <span className="text-muted">
                                  <i className="fas fa-info-circle me-1"></i>
                                  Đang chờ admin duyệt
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Không có khóa học nào đang chờ duyệt</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nút tạo khóa học mới */}
          <div className="row mt-5">
            <div className="col-12 text-center">
              <Link 
                to="/courses/create" 
                className="btn btn-primary btn-lg fw-bold shadow"
                style={{borderRadius: '10px', padding: '12px 24px'}}
              >
                <i className="fas fa-plus me-2"></i>
                Tạo Khóa Học Mới
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render cho STUDENT hoặc USER thường
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center mb-5 fw-bold text-primary">
              <i className="fas fa-graduation-cap me-3"></i>
              Khóa Học Của Tôi
            </h1>
          </div>
        </div>

        {myCourses.length > 0 ? (
          <div className="row g-4">
            {myCourses.map(course => (
              <div className="col-lg-3 col-md-4 col-sm-6" key={course.id}>
                <div 
                  className="card h-100 border-0 shadow-sm"
                  style={{
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div className="position-relative overflow-hidden" style={{borderRadius: '15px 15px 0 0'}}>
                    <img 
                      src={course.image || 'https://via.placeholder.com/300x200?text=Khóa+Học'} 
                      className="card-img-top" 
                      alt={course.title}
                      style={{height: '200px', objectFit: 'cover'}}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{course.title}</h5>
                    <p className="card-text text-muted flex-grow-1">
                      {course.description?.length > 100 
                        ? course.description.substring(0, 100) + '...' 
                        : course.description}
                    </p>
                    <div className="mt-auto">
                      <Link 
                        to={`/learning/course/${course.id}`}
                        className="btn btn-primary w-100"
                        style={{borderRadius: '10px'}}
                      >
                        <i className="fas fa-play me-2"></i>
                        Tiếp Tục Học
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-graduation-cap fa-4x text-muted mb-4"></i>
            <h3 className="text-muted mb-3">Bạn chưa đăng ký khóa học nào</h3>
            <p className="text-muted mb-4">Hãy khám phá và đăng ký các khóa học thú vị!</p>
            
            {(!currentUser || currentUser.role !== 'TEACHER') && (
              <div className="mt-4">
                <Link 
                  to="/courses" 
                  className="btn btn-primary btn-lg fw-bold shadow"
                  style={{borderRadius: '10px', padding: '12px 24px'}}
                >
                  <i className="fas fa-search me-2"></i>
                  Khám Phá Khóa Học
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningList;


