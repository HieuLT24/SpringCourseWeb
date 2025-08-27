import React from 'react';

function ErrorPage() {
  return (
    <div className="content-wrapper py-5">
      <div className="container text-center">
        <i className="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
        <h2 className="mb-3">Đã có lỗi xảy ra</h2>
        <p className="text-muted mb-4">Vui lòng thử lại hoặc quay lại trang chủ.</p>
        <a href="/" className="btn btn-primary">Về trang chủ</a>
      </div>
    </div>
  );
}

export default ErrorPage;


