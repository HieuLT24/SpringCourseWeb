import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Link khôi phục không hợp lệ!');
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const pwd = formData.password || '';
    if (pwd.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự!';
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    if (!(hasLetter && hasDigit)) return 'Mật khẩu phải gồm cả chữ và số!';
    if (formData.password !== formData.confirmPassword) return 'Mật khẩu xác nhận không khớp!';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authService.resetPassword(token, formData.password, formData.confirmPassword);
      setMessage(response.message || 'Mật khẩu đã được đặt lại thành công!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Có lỗi xảy ra khi đặt lại mật khẩu!');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="content-wrapper py-5">
        <div className="container">
          <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 500}}>
            <div className="text-center">
              <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
              <h3>Link không hợp lệ</h3>
              <p className="text-muted">Link khôi phục mật khẩu không hợp lệ hoặc đã hết hạn.</p>
              <Link to="/forgot-password" className="btn btn-primary">
                Yêu cầu link mới
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 500}}>
          <div className="text-center mb-4">
            <i className="fas fa-lock fa-3x mb-3" style={{color: 'var(--bs-primary)'}}></i>
            <h1>Đặt lại mật khẩu</h1>
            <p className="text-muted">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                name="password"
                placeholder="Mật khẩu mới"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <label htmlFor="password"><i className="fas fa-lock me-2"></i>Mật khẩu mới</label>
            </div>
            
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="confirmPassword" 
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
              <label htmlFor="confirmPassword"><i className="fas fa-lock me-2"></i>Xác nhận mật khẩu</label>
            </div>
            
            <button 
              type="submit" 
              className="btn w-100 text-white" 
              style={{background: 'linear-gradient(135deg, var(--bs-primary), var(--bs-indigo))', borderRadius: 25, padding: '.75rem 2rem'}}
              disabled={loading}
            >
              {loading ? (
                <span><i className="fas fa-spinner fa-spin me-2"></i>Đang xử lý...</span>
              ) : (
                <span><i className="fas fa-save me-2"></i>Đặt lại mật khẩu</span>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="text-decoration-none">
              <i className="fas fa-arrow-left me-1"></i>Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;


