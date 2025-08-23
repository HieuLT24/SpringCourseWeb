import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="fas fa-graduation-cap me-2"></i>CourseWeb
            </h5>
            <p className="text-muted">
              Nền tảng học trực tuyến hàng đầu, cung cấp các khóa học chất lượng cao 
              từ những chuyên gia hàng đầu.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Khóa học</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Lập trình</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Thiết kế</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Marketing</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Kinh doanh</a></li>
            </ul>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted text-decoration-none">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Liên hệ</a></li>
              <li><a href="#" className="text-muted text-decoration-none">FAQ</a></li>
              <li><a href="#" className="text-muted text-decoration-none">Chính sách</a></li>
            </ul>
          </div>
          
          <div className="col-lg-4 mb-4">
            <h6 className="fw-bold mb-3">Đăng ký nhận tin</h6>
            <p className="text-muted">
              Nhận thông tin về các khóa học mới và ưu đãi đặc biệt.
            </p>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Email của bạn"
              />
              <button className="btn btn-primary" type="button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              &copy; 2025 CourseWeb. Tất cả quyền được bảo lưu.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">Được phát triển bởi Duc Hieu</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
