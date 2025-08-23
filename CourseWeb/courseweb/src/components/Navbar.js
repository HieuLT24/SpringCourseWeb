import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, categories, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark sticky-top" 
      style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
        boxShadow: 'var(--shadow)'
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="fas fa-graduation-cap me-2 fs-4"></i>
          <span>CourseWeb</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link fw-medium ${isActive('/') ? 'active' : ''}`} 
                to="/"
              >
                <i className="fas fa-home me-1"></i>Trang chủ
              </Link>
            </li>
            
            {categories && categories.length > 0 && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle fw-medium" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-list me-1"></i>Danh mục
                </a>
                <ul className="dropdown-menu border-0 shadow">
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link 
                        className="dropdown-item" 
                        to={`/?cateId=${category.id}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {/* Admin Menu */}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle fw-medium text-warning" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-cog me-1"></i>Quản trị
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
                  <li>
                    <Link className="dropdown-item" to="/admin">
                      <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/courses">
                      <i className="fas fa-book me-2"></i>Quản lý khóa học
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/admin/stats">
                      <i className="fas fa-chart-bar me-2"></i>Thống kê
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            
            {/* User Menu */}
            {user ? (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link fw-medium" 
                  onClick={onLogout}
                  style={{ border: 'none', background: 'none', color: 'inherit' }}
                >
                  <i className="fas fa-sign-out-alt me-1"></i>Đăng xuất
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className="nav-link fw-medium btn btn-outline-light btn-sm px-3 ms-2" 
                  to="/login"
                >
                  <i className="fas fa-sign-in-alt me-1"></i>Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
