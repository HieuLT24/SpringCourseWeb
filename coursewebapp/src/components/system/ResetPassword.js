import React from 'react';

function ResetPassword() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 500}}>
          <h3 className="mb-3">Đặt lại mật khẩu</h3>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="password" placeholder="Mật khẩu mới" />
            <label htmlFor="password">Mật khẩu mới</label>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className="form-control" id="confirm" placeholder="Xác nhận mật khẩu" />
            <label htmlFor="confirm">Xác nhận mật khẩu</label>
          </div>
          <button className="btn btn-primary w-100">Cập nhật</button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;


