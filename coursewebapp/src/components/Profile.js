import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';

function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState({ name: '', email: '', username: '' });

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const me = await userService.getCurrentUser();
        setUser({ name: me.name || '', email: me.email || '', username: me.username || '' });
      } catch (e) {
        setError('Không thể tải hồ sơ người dùng');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateProfile = () => {
    if (!user.name || user.name.trim().length < 2) return 'Họ tên phải từ 2 ký tự';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) return 'Email không hợp lệ';
    return '';
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const v = validateProfile();
    if (v) { setError(v); return; }
    try {
      const resp = await userService.updateProfile({ name: user.name, email: user.email });
      if (resp.success) {
        setSuccess(resp.message || 'Cập nhật thành công');
      } else {
        setError(resp.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật hồ sơ');
    }
  };

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const validatePwd = () => {
    if (!pwdForm.oldPassword) return 'Vui lòng nhập mật khẩu hiện tại';
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 6) return 'Mật khẩu mới phải ít nhất 6 ký tự';
    const hasLetter = /[A-Za-z]/.test(pwdForm.newPassword);
    const hasDigit = /\d/.test(pwdForm.newPassword);
    if (!(hasLetter && hasDigit)) return 'Mật khẩu mới phải gồm cả chữ và số';
    if (pwdForm.newPassword !== pwdForm.confirmPassword) return 'Xác nhận mật khẩu không khớp';
    return '';
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');
    const v = validatePwd();
    if (v) { setPwdError(v); return; }
    setPwdLoading(true);
    try {
      const resp = await userService.changePassword(pwdForm.oldPassword, pwdForm.newPassword, pwdForm.confirmPassword);
      if (resp.success) {
        setPwdSuccess(resp.message || 'Đổi mật khẩu thành công');
        setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwdError(resp.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      setPwdError('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="bg-white p-4 rounded-3 shadow-sm h-100">
              <h3 className="mb-3"><i className="fas fa-user me-2"></i>Hồ sơ cá nhân</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={submitProfile} noValidate>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="name" name="name" placeholder="Họ tên" value={user.name} onChange={handleChange} required minLength={2} />
                  <label htmlFor="name">Họ tên</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="username" name="username" placeholder="Tên đăng nhập" value={user.username} disabled readOnly />
                  <label htmlFor="username">Tên đăng nhập</label>
                </div>
                <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
              </form>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="bg-white p-4 rounded-3 shadow-sm h-100">
              <h3 className="mb-3"><i className="fas fa-key me-2"></i>Đổi mật khẩu</h3>
              {pwdError && <div className="alert alert-danger">{pwdError}</div>}
              {pwdSuccess && <div className="alert alert-success">{pwdSuccess}</div>}
              <form onSubmit={submitPassword} noValidate>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="oldPassword" name="oldPassword" placeholder="Mật khẩu hiện tại" value={pwdForm.oldPassword} onChange={handlePwdChange} required />
                  <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="newPassword" name="newPassword" placeholder="Mật khẩu mới" value={pwdForm.newPassword} onChange={handlePwdChange} required minLength={6} />
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Xác nhận mật khẩu" value={pwdForm.confirmPassword} onChange={handlePwdChange} required minLength={6} />
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                </div>
                <button type="submit" className="btn btn-outline-primary" disabled={pwdLoading}>
                  {pwdLoading ? (<span><i className="fas fa-spinner fa-spin me-2"></i>Đang đổi...</span>) : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
