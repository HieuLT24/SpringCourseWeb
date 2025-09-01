import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang kiểm tra quyền truy cập...</span>
          </div>
          <p className="mt-3">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole && currentUser.role !== requiredRole) {
    alert(`Bạn không có quyền truy cập trang này! Yêu cầu quyền: ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  // Cho phép truy cập
  return children;
};

export default ProtectedRoute;
