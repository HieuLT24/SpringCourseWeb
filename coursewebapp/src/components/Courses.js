import React from 'react';
import { Link } from 'react-router-dom';

function Courses() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0"><i className="fas fa-book me-2"></i>Tất cả khóa học</h2>
          <div className="text-muted">
            <i className="fas fa-graduation-cap me-1"></i>
            <span>6</span> khóa học
          </div>
        </div>

        <div className="row">
          {[1,2,3,4,5,6].map((id) => (
            <div className="col-lg-4 col-md-6 mb-4" key={id}>
              <div className="border rounded-3 overflow-hidden bg-white h-100">
                <div className="position-relative">
                  <img src={`https://picsum.photos/seed/c${id}/800/400`} alt="Course" style={{width:'100%',height:200,objectFit:'cover',background:'#f8f9fa'}} />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-warning text-dark">{(id*120000).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
                <div className="p-3">
                  <h5 className="mb-2">
                    <Link to={`/courses/${id}`} className="text-decoration-none text-dark">Khoá học #{id}</Link>
                  </h5>
                  <p className="text-muted mb-3">Mô tả ngắn gọn về khoá học số {id}.</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      <small>Giảng viên A</small>
                    </div>
                    <div>
                      <Link to={`/courses/${id}`} className="btn btn-primary btn-sm">
                        <i className="fas fa-eye me-1"></i>Xem chi tiết
                      </Link>
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

export default Courses;


