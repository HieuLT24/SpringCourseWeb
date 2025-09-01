import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser: user, logout, loading } = useAuth();

  // Kiểm tra quyền admin
  useEffect(() => {
    // Nếu AuthContext đang loading, chờ
    if (loading) {
      return;
    }
    
    if (!user) {
      // Chưa đăng nhập
      navigate('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      // Không phải admin
      alert('Bạn không có quyền truy cập trang quản trị!');
      navigate('/');
      return;
    }
    
    // Nếu là admin, cho phép hiển thị
    setIsCheckingAuth(false);
  }, [user, loading, navigate]);

  // Hiển thị loading khi đang kiểm tra auth
  if (loading || isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang kiểm tra quyền truy cập...</span>
          </div>
          <p className="mt-3">
            {loading ? 'Đang tải thông tin người dùng...' : 'Đang kiểm tra quyền truy cập...'}
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Trang tổng quan',
      key: 'dashboard'
    },
    {
      path: '/admin/stats',
      icon: 'fas fa-chart-line',
      label: 'Thống kê chi tiết',
      key: 'stats'
    },
    {
      path: '/admin/pending-courses',
      icon: 'fas fa-clock',
      label: 'Duyệt khóa học đang chờ',
      key: 'pending-courses'
    },
    {
      path: '/admin/user-management',
      icon: 'fas fa-users-cog',
      label: 'Phân quyền người dùng',
      key: 'user-management'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
            {!sidebarCollapsed && <span className="logo-text">CourseWeb Admin</span>}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map(item => (
              <li key={item.key} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
                <Link to={item.path} className="nav-link">
                  <i className={item.icon}></i>
                  {!sidebarCollapsed && <span className="nav-text">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">Quản trị viên</div>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
            <i className="fas fa-sign-out-alt"></i>
            {!sidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="admin-header">
          <div className="header-content">
            <h1 className="page-title">
              {menuItems.find(item => isActive(item.path))?.label || 'Quản trị hệ thống'}
            </h1>
            <div className="header-actions">
              <span className="welcome-text">Xin chào, {user?.name}</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          height: 100vh;
          background-color: #f8f9fa;
        }

        .admin-sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: fixed;
          height: 100vh;
          z-index: 1000;
          box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .admin-sidebar.collapsed {
          width: 70px;
        }

        .sidebar-header {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .logo i {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }

        .logo-text {
          white-space: nowrap;
        }

        .collapse-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .collapse-btn:hover {
          background-color: rgba(255,255,255,0.1);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin-bottom: 0.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .nav-link:hover {
          color: white;
          background-color: rgba(255,255,255,0.1);
          border-left-color: rgba(255,255,255,0.3);
        }

        .nav-item.active .nav-link {
          color: white;
          background-color: rgba(255,255,255,0.15);
          border-left-color: white;
        }

        .nav-link i {
          width: 20px;
          text-align: center;
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }

        .nav-text {
          white-space: nowrap;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background-color: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-role {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .logout-btn {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logout-btn:hover {
          background-color: rgba(255,255,255,0.2);
        }

        .logout-btn i {
          margin-right: 0.5rem;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
        }

        .admin-main.sidebar-collapsed {
          margin-left: 70px;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e9ecef;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .page-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }

        .welcome-text {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          
          .admin-sidebar.show {
            transform: translateX(0);
          }
          
          .admin-main {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
