import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, isAdmin = false, onDelete }) => {
  const handleDelete = () => {
    if (onDelete && course.id) {
      onDelete(course.id);
    }
  };

  return (
    <div className="course-card">
      <div className="position-relative">
        <img 
          src={course.image || '/placeholder-course.jpg'} 
          alt="Course Image" 
          className="course-image"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'contain',
            objectPosition: 'center',
            background: 'var(--light-color)',
            borderRadius: 'var(--border-radius)',
            transition: 'var(--transition)'
          }}
        />
        <div className="position-absolute top-0 end-0 m-3">
          <span className="course-price">{course.price} VNĐ</span>
        </div>
      </div>
      
      <div className="card-body p-3">
        <h5 className="card-title mb-2">
          <Link 
            to={`/courses/${course.id}`}
            className="text-decoration-none text-dark"
          >
            {course.title}
          </Link>
        </h5>
        
        <p className="card-text text-muted mb-3">
          {course.description}
        </p>
        
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center text-muted">
            <i className="fas fa-user me-1"></i>
            <small>{course.teacherId?.name || 'Giảng viên'}</small>
          </div>
          
          <div className="btn-group" role="group">
            <Link 
              to={`/courses/${course.id}`}
              className="btn btn-primary btn-sm btn-modern"
            >
              <i className="fas fa-eye me-1"></i>Xem chi tiết
            </Link>
            
            {/* Admin Actions */}
            {isAdmin && (
              <div className="btn-group" role="group">
                <Link 
                  to={`/admin/courses/${course.id}/edit`}
                  className="btn btn-warning btn-sm"
                >
                  <i className="fas fa-edit"></i>
                </Link>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
