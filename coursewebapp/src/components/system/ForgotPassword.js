import React from 'react';

function ForgotPassword() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 500}}>
          <h3 className="mb-3">Quên mật khẩu</h3>
          <p className="text-muted">Nhập email để nhận hướng dẫn đặt lại mật khẩu.</p>
          <div className="form-floating mb-3">
            <input type="email" className="form-control" id="email" placeholder="Email" />
            <label htmlFor="email">Email</label>
          </div>
          <button className="btn btn-primary w-100">Gửi</button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;


