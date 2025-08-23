import React from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const CoursesSection = ({ courses = [], isAdmin = false, onDeleteCourse }) => {
  if (courses.length === 0) {
    return (
      <section id="courses" className="mb-5">
        <div className="text-center py-5">
          <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">Chưa có khóa học nào</h4>
          <p className="text-muted">Hãy quay lại sau để khám phá các khóa học mới!</p>
          {isAdmin && (
            <Link to="/admin/courses/new" className="btn btn-primary btn-modern">
              <i className="fas fa-plus me-2"></i>Thêm khóa học đầu tiên
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-book me-2"></i>Khóa học nổi bật
        </h2>
        <div className="text-muted">
          <i className="fas fa-graduation-cap me-1"></i>
          {courses.length} khóa học
        </div>
      </div>
      
      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-lg-4 col-md-6 mb-4">
            <CourseCard 
              course={course} 
              isAdmin={isAdmin}
              onDelete={onDeleteCourse}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
