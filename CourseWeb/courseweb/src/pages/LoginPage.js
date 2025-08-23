import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data based on username
      let userData;
      if (formData.username === 'admin') {
        userData = {
          id: 1,
          username: 'admin',
          name: 'Quản trị viên',
          email: 'admin@courseweb.com',
          role: 'ADMIN'
        };
      } else {
        userData = {
          id: 2,
          username: formData.username,
          name: 'Người dùng',
          email: 'user@courseweb.com',
          role: 'USER'
        };
      }
      
      // Store token (mock)
      localStorage.setItem('token', 'mock-token-' + Date.now());
      
      onLogin(userData);
      navigate('/');
    } catch (error) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="content-wrapper">
        <div className="container">
          <div className="login-container" style={{
            maxWidth: '500px',
            margin: '4rem auto',
            padding: '2rem',
            background: 'white',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow)'
          }}>
            <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <i 
                className="fas fa-graduation-cap fa-3x mb-3" 
                style={{ color: 'var(--primary-color)' }}
              ></i>
              <h1 style={{
                background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700'
              }}>
                Đăng nhập
              </h1>
              <p className="text-muted">Chào mừng bạn quay trở lại CourseWeb</p>
            </div>
            
            {error && (
              <div className="alert alert-danger mb-4" style={{
                borderRadius: 'var(--border-radius)',
                border: 'none',
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                color: 'white'
              }}>
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Lỗi!</strong> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  id="username" 
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="username">
                  <i className="fas fa-user me-2"></i>Tên đăng nhập
                </label>
              </div>
              
              <div className="form-floating mb-4">
                <input 
                  type="password" 
                  className="form-control" 
                  id="password" 
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">
                  <i className="fas fa-lock me-2"></i>Mật khẩu
                </label>
              </div>
              
              <button 
                type="submit" 
                className="btn w-100"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '0.75rem 2rem',
                  fontWeight: '500',
                  color: 'white',
                  transition: 'var(--transition)'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>Đăng nhập
                  </>
                )}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-decoration-none">
                <i className="fas fa-arrow-left me-1"></i>Quay lại trang chủ
              </Link>
            </div>
            
            <div className="mt-3 text-center">
              <small className="text-muted">
                <strong>Thử nghiệm:</strong><br/>
                Admin: username = "admin", password = bất kỳ<br/>
                User: username = bất kỳ (khác "admin"), password = bất kỳ
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
