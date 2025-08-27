import React from 'react';
import { useParams, Link } from 'react-router-dom';

function CourseDetail() {
  const { id } = useParams();

  const price = Number(id) * 150000;

  return (
    <div className="main-wrapper">
      <section className="py-5" style={{background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-indigo) 100%)', color: 'white'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img src={`https://picsum.photos/seed/d${id}/800/450`} alt="Course" className="img-fluid rounded-3 shadow" />
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bold mb-3">Khoá học #{id}</h1>
              <div className="badge bg-danger fs-6 mb-3">{price.toLocaleString('vi-VN')} VNĐ</div>
              <div className="mt-3">
                <button className="btn btn-success btn-lg me-2">🎓 Đăng ký khóa học ngay</button>
                <Link to="/login" className="btn btn-outline-light btn-lg">🔐 Đăng nhập để đăng ký</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                <h2 className="mb-3">Về khóa học này</h2>
                <p className="lead">Mô tả khoá học sẽ hiển thị ở đây. Đây là phiên bản React từ course-detail.html.</p>
                <h4 className="mt-4 mb-3">Bạn sẽ học được gì?</h4>
                <ul className="list-unstyled">
                  <li className="py-2 border-bottom">Kiến thức nền tảng vững chắc</li>
                  <li className="py-2 border-bottom">Thực hành với các dự án thực tế</li>
                  <li className="py-2 border-bottom">Hướng dẫn từ giảng viên giàu kinh nghiệm</li>
                  <li className="py-2 border-bottom">Chứng chỉ hoàn thành khóa học</li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white p-4 rounded-3 shadow-sm">
                <h3 className="mb-3">Thông tin khóa học</h3>
                <ul className="list-unstyled">
                  <li className="py-2 border-bottom"><strong>Giảng viên:</strong> Giảng viên A</li>
                  <li className="py-2 border-bottom"><strong>Danh mục:</strong> Lập trình</li>
                  <li className="py-2 border-bottom"><strong>Trạng thái:</strong> Mở</li>
                  <li className="py-2 border-bottom"><strong>Giá:</strong> {price.toLocaleString('vi-VN')} VNĐ</li>
                </ul>
                <div className="mt-3 text-center">
                  <button className="btn btn-success w-100 mb-2">🎯 Học khóa học ngay</button>
                  <button className="btn btn-primary w-100">🎓 Đăng ký ngay</button>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/" className="text-decoration-none">← Quay lại trang chủ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;


