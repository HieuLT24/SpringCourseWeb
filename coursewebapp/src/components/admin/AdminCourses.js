import React from 'react';
import { Link } from 'react-router-dom';

function AdminCourses() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0"><i className="fas fa-book me-2"></i>Quản lý khóa học</h1>
          <Link to="/admin/courses/new" className="btn btn-primary"><i className="fas fa-plus me-2"></i>Thêm khóa học</Link>
        </div>
        <div className="row">
          {[1,2,3,4].map(id => (
            <div className="col-md-3 mb-4" key={id}>
              <div className="card h-100 shadow-sm">
                <img src={`https://picsum.photos/seed/a${id}/800/400`} className="card-img-top" alt="Course" />
                <div className="card-body">
                  <h5 className="card-title">Khoá học #{id}</h5>
                  <div className="d-flex justify-content-between">
                    <Link to={`/courses/${id}`} className="btn btn-outline-primary btn-sm">Xem</Link>
                    <div className="btn-group">
                      <Link to={`/admin/courses/${id}/edit`} className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></Link>
                      <button className="btn btn-danger btn-sm"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminCourses;


