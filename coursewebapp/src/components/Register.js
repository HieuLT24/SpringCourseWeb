import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await userService.register(formData);
      
      if (response.success) {
        navigate('/login');
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng ký');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="mx-auto bg-white p-4 rounded-3 shadow" style={{maxWidth: 600}}>
          <div className="text-center mb-4">
            <h1>Đăng ký</h1>
            <p className="text-muted">Tạo tài khoản mới để bắt đầu học</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    placeholder="Họ tên"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name">Họ tên</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
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
                  <label htmlFor="username">Tên đăng nhập</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
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
                  <label htmlFor="password">Mật khẩu</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating">
                  <input 
                    type="password" 
                    className="form-control" 
                    id="confirmPassword" 
                    name="confirmPassword"
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary mt-3 w-100"
              disabled={loading}
            >
              {loading ? (
                <span><i className="fas fa-spinner fa-spin me-2"></i>Đang xử lý...</span>
              ) : (
                <span>Tạo tài khoản</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;


