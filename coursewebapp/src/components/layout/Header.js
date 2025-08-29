import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const { isAuthenticated, currentUser, checkAuthStatus, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-indigo) 100%)', boxShadow: '0 0.5rem 1rem rgba(0,0,0,.15)'}}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="fas fa-graduation-cap me-2 fs-4"></i>
          <span>CourseWeb</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link fw-500" to="/">
                <i className="fas fa-home me-1"></i>Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-500" to="/courses">
                <i className="fas fa-book me-1"></i>Khóa học
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle fw-500" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="fas fa-user me-1"></i>
                    {currentUser?.name || currentUser?.username || 'Tài khoản'}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/learning">
                        <i className="fas fa-graduation-cap me-2"></i>Khóa học của tôi
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/course-history">
                        <i className="fas fa-history me-2"></i>Lịch sử khóa học
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fas fa-user-cog me-2"></i>Hồ sơ
                      </Link>
                    </li>
                    {currentUser?.role === 'ADMIN' && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          <i className="fas fa-cog me-2"></i>Quản trị
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-500" to="/register">
                    <i className="fas fa-user-plus me-1"></i>Đăng ký
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-500 btn btn-outline-light btn-sm px-3 ms-2" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i>Đăng nhập
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;


