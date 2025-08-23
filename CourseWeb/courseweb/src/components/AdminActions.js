import React from 'react';
import { Link } from 'react-router-dom';

const AdminActions = () => {
  return (
    <div className="admin-actions text-white">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">
            <i className="fas fa-crown me-2"></i>Chế độ quản trị
          </h5>
          <p className="mb-0">Bạn đang truy cập với quyền quản trị viên</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-light btn-modern">
            <i className="fas fa-tachometer-alt me-1"></i>Dashboard
          </Link>
          <Link to="/admin/courses/new" className="btn btn-outline-light btn-modern">
            <i className="fas fa-plus me-1"></i>Thêm khóa học
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminActions;
