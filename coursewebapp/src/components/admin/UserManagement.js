import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const roles = [
    { value: 'USER', label: 'Học viên', color: 'primary' },
    { value: 'TEACHER', label: 'Giáo viên', color: 'success' },
    { value: 'ADMIN', label: 'Quản trị viên', color: 'danger' }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const users = await userService.getAllUsers();
      setUsers(users || []);
    } catch (err) {
      console.error('Load users error:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setProcessing(true);
      const user = users.find(u => u.id === userId);
      const updatedUser = { ...user, role: newRole };
      
      const result = await userService.updateUser(userId, updatedUser);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setShowModal(false);
      
      showToast('Phân quyền người dùng thành công!', 'success');
    } catch (err) {
      console.error('Update user role error:', err);
      showToast('Có lỗi xảy ra khi cập nhật quyền người dùng: ' + err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      setProcessing(true);
      const result = await userService.deleteUser(userId);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      
      showToast('Xóa người dùng thành công!', 'success');
    } catch (err) {
      console.error('Delete user error:', err);
      showToast('Có lỗi xảy ra khi xóa người dùng: ' + err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleInfo = (role) => {
    return roles.find(r => r.value === role) || { value: role, label: role, color: 'secondary' };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-users-cog me-2 text-primary"></i>
          Quản lý người dùng ({filteredUsers.length})
        </h4>
        <button className="btn btn-outline-primary" onClick={loadUsers}>
          <i className="fas fa-sync-alt me-1"></i>
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo tên, email hoặc username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">
                Tổng: {users.length} người dùng
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users text-muted fa-3x mb-3"></i>
              <h5>Không tìm thấy người dùng</h5>
              <p className="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên người dùng</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const roleInfo = getRoleInfo(user.role);
                    return (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                              <i className="fas fa-user text-white"></i>
                            </div>
                            <div>
                              <div className="fw-medium">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>
                          <span className={`badge bg-${roleInfo.color}`}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openRoleModal(user)}
                              disabled={processing}
                            >
                              <i className="fas fa-user-cog"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={processing || user.role === 'ADMIN'}
                              title={user.role === 'ADMIN' ? 'Không thể xóa admin' : 'Xóa người dùng'}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {showModal && selectedUser && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-cog me-2"></i>
                  Phân quyền người dùng
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar-lg bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                      <i className="fas fa-user text-white fa-lg"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">{selectedUser.name}</h6>
                      <p className="text-muted mb-0">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Chọn vai trò mới:</label>
                  <div className="row g-2">
                    {roles.map(role => (
                      <div key={role.value} className="col-12">
                        <div 
                          className={`card cursor-pointer ${selectedUser.role === role.value ? 'border-' + role.color + ' bg-' + role.color + ' bg-opacity-10' : ''}`}
                          onClick={() => {
                            setSelectedUser({...selectedUser, role: role.value});
                          }}
                        >
                          <div className="card-body py-2">
                            <div className="d-flex align-items-center">
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  checked={selectedUser.role === role.value}
                                  readOnly
                                />
                              </div>
                              <div className="ms-2">
                                <span className={`badge bg-${role.color} me-2`}>{role.label}</span>
                                <small className="text-muted">
                                  {role.value === 'USER' && 'Có thể đăng ký và học các khóa học'}
                                  {role.value === 'TEACHER' && 'Có thể tạo và quản lý khóa học'}
                                  {role.value === 'ADMIN' && 'Có quyền quản trị toàn bộ hệ thống'}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => handleRoleChange(selectedUser.id, selectedUser.role)}
                  disabled={processing}
                >
                  <i className="fas fa-save me-1"></i>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .avatar-sm {
          width: 32px;
          height: 32px;
        }
        
        .avatar-lg {
          width: 48px;
          height: 48px;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .cursor-pointer:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <i className="fas fa-check-circle"></i>
              ) : (
                <i className="fas fa-exclamation-circle"></i>
              )}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button 
              className="toast-close"
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          min-width: 300px;
          max-width: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
        }

        .toast-success {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .toast-error {
          background: linear-gradient(135deg, #dc3545, #e74c3c);
          color: white;
        }

        .toast-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }

        .toast-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: inherit;
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 576px) {
          .toast-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
