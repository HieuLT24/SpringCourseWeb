import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">
              Học trực tuyến <br />
              <span className="text-warning">dễ dàng hơn</span>
            </h1>
            <p className="lead mb-4">
              Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. 
              Học mọi lúc, mọi nơi với CourseWeb.
            </p>
            <div className="d-flex gap-3">
              <a href="#courses" className="btn btn-light btn-lg btn-modern">
                <i className="fas fa-play me-2"></i>Bắt đầu học
              </a>
              <a href="#" className="btn btn-outline-light btn-lg btn-modern">
                <i className="fas fa-info-circle me-2"></i>Tìm hiểu thêm
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <i className="fas fa-graduation-cap" style={{fontSize: '15rem', opacity: 0.1}}></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
