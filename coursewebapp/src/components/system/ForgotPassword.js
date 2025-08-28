import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || 'Link khôi phục mật khẩu đã được gửi đến email của bạn!');
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau!');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 500}}>
          <div className="text-center mb-4">
            <i className="fas fa-key fa-3x mb-3" style={{color: 'var(--bs-primary)'}}></i>
            <h1>Quên mật khẩu</h1>
            <p className="text-muted">Nhập email của bạn để nhận link khôi phục mật khẩu</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                type="email" 
                className="form-control" 
                id="email" 
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email"><i className="fas fa-envelope me-2"></i>Email</label>
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
                <span><i className="fas fa-paper-plane me-2"></i>Gửi link khôi phục</span>
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

export default ForgotPassword;


