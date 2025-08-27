import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.username, formData.password);
      
      if (response.success) {
        authService.saveAuthData(response);
        navigate('/');
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 500}}>
          <div className="text-center mb-4">
            <i className="fas fa-graduation-cap fa-3x mb-3" style={{color: 'var(--bs-primary)'}}></i>
            <h1>Đăng nhập</h1>
            <p className="text-muted">Chào mừng bạn quay trở lại CourseWeb</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="form-floating mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="username" 
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="username"><i className="fas fa-user me-2"></i>Tên đăng nhập</label>
            </div>
            
            <div className="form-floating mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password"><i className="fas fa-lock me-2"></i>Mật khẩu</label>
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
                <span><i className="fas fa-sign-in-alt me-2"></i>Đăng nhập</span>
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-decoration-none text-muted">
              <i className="fas fa-key me-1"></i>Quên mật khẩu?
            </Link>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted mb-2">Chưa có tài khoản?</p>
            <Link to="/register" className="btn btn-outline-primary me-2">
              <i className="fas fa-user-plus me-1"></i>Đăng ký ngay
            </Link>
            <Link to="/" className="text-decoration-none">
              <i className="fas fa-arrow-left me-1"></i>Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


