import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { courseService } from '../../services/courseService';

function DashboardLayout() {
  const { id } = useParams();
  const courseId = parseInt(id);
  const [course, setCourse] = useState(null);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <h5 className="mb-3"><i className="fas fa-layer-group me-2"></i>Điều hướng</h5>
              <nav className="nav flex-column">
                <NavLink className={({isActive}) => `nav-link ${isActive?'active fw-semibold':''}`} to={`/learning/course/${courseId}/lectures`}>
                  <i className="fas fa-play-circle me-2"></i>Bài giảng
                </NavLink>
                <NavLink className={({isActive}) => `nav-link ${isActive?'active fw-semibold':''}`} to={`/learning/course/${courseId}/exams`}>
                  <i className="fas fa-file-alt me-2"></i>Bài thi
                </NavLink>
                <NavLink className={({isActive}) => `nav-link ${isActive?'active fw-semibold':''}`} to={`/learning/course/${courseId}/forum`}>
                  <i className="fas fa-comments me-2"></i>Forum & Thông báo
                </NavLink>
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
                  </div>
                </div>
              ) : (
                <div className="text-danger">Không tìm thấy khóa học.</div>
              )}
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;


