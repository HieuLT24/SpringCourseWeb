import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, [page]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await courseService.getAllCourses({ page });
      const items = coursesData.courses || [];
      setCourses(items);
      setHasMore(items.length === 12);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button onClick={loadCourses} className="btn btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0"><i className="fas fa-book me-2"></i>Tất cả khóa học</h2>
          <div className="text-muted">
            <i className="fas fa-graduation-cap me-1"></i>
            <span>{courses.length}</span> khóa học
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-book fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">Chưa có khóa học nào</h4>
            <p className="text-muted">Hãy quay lại sau để xem các khóa học mới!</p>
          </div>
        ) : (
          <div className="row">
            {courses.map((course) => (
              <div className="col-lg-4 col-md-6 mb-4" key={course.id}>
                <div className="border rounded-3 overflow-hidden bg-white h-100">
                  <div className="position-relative">
                    <img 
                      src={course.image || `https://picsum.photos/seed/c${course.id}/800/400`} 
                      alt={course.name} 
                      style={{width:'100%',height:200,objectFit:'cover',background:'#f8f9fa'}} 
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-warning text-dark">
                        {course.price?.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h5 className="mb-2">
                      <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                        {course.name}
                      </Link>
                    </h5>
                    <p className="text-muted mb-3">
                      {course.description || 'Mô tả ngắn gọn về khóa học.'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        <small>{course.instructor || 'Giảng viên'}</small>
                      </div>
                      <div>
                        <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                          <i className="fas fa-eye me-1"></i>Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
          <button className="btn btn-outline-secondary" disabled={page === 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <i className="fas fa-chevron-left me-1"></i>Trang trước
          </button>
          <span className="px-3">Trang {page}</span>
          <button className="btn btn-outline-primary" disabled={!hasMore || loading} onClick={() => setPage((p) => p + 1)}>
            Trang sau<i className="fas fa-chevron-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Courses;


