import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'rejected'
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadPendingCourses();
  }, []);

  const loadCourses = async (status = 'pending') => {
    try {
      setLoading(true);
      const result = await adminService.getAllCoursesForAdmin();
      if (result.success) {
        // Filter courses based on status
        const filteredCourses = (result.data || []).filter(course => course.status === status);
        setCourses(filteredCourses);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Load courses error:', err);
      setError('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingCourses = () => loadCourses('pending');
  const loadRejectedCourses = () => loadCourses('rejected');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'pending') {
      loadPendingCourses();
    } else {
      loadRejectedCourses();
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleApproveCourse = async (courseId, approve) => {
    try {
      setProcessing(true);
      
      // Find the course to update
      const courseToUpdate = courses.find(c => c.id === courseId);
      if (!courseToUpdate) {
        throw new Error('Không tìm thấy khóa học');
      }
      
      const updatedCourse = {
        ...courseToUpdate,
        status: approve ? 'active' : 'rejected'
      };
      
      const result = await adminService.updateCourse(courseId, updatedCourse);
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Reload current tab
      if (activeTab === 'pending') {
        await loadPendingCourses();
      } else {
        await loadRejectedCourses();
      }
      setShowModal(false);
      
      showToast(
        approve ? 'Khóa học đã được duyệt thành công!' : 'Khóa học đã bị từ chối!',
        'success'
      );
    } catch (err) {
      console.error('Approve course error:', err);
      showToast('Có lỗi xảy ra khi xử lý khóa học: ' + err.message, 'error');
    } finally {
      setProcessing(false);
    }
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
    <div className="pending-courses">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className={`fas ${activeTab === 'pending' ? 'fa-clock text-warning' : 'fa-times-circle text-danger'} me-2`}></i>
          {activeTab === 'pending' ? 'Khóa học chờ duyệt' : 'Khóa học bị từ chối'} 
          <span className="badge bg-secondary ms-2">{courses.length}</span>
        </h4>
        <button 
          className="btn btn-outline-primary" 
          onClick={activeTab === 'pending' ? loadPendingCourses : loadRejectedCourses}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-0">
          <ul className="nav nav-tabs nav-fill">
            <li className="nav-item">
              <button 
                className={`nav-link text-dark ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => handleTabChange('pending')}
              >
                <i className="fas fa-clock me-2"></i>
                Chờ duyệt
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link text-dark ${activeTab === 'rejected' ? 'active' : ''}`}
                onClick={() => handleTabChange('rejected')}
              >
                <i className="fas fa-times-circle me-2"></i>
                Bị từ chối
              </button>
            </li>
          </ul>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className={`fas ${activeTab === 'pending' ? 'fa-check-circle text-success' : 'fa-ban text-muted'} fa-3x mb-3`}></i>
            <h5>
              {activeTab === 'pending' 
                ? 'Không có khóa học nào chờ duyệt' 
                : 'Không có khóa học nào bị từ chối'
              }
            </h5>
            <p className="text-muted">
              {activeTab === 'pending' 
                ? 'Tất cả khóa học đã được xử lý' 
                : 'Chưa có khóa học nào bị từ chối'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map(course => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className={`card-header ${activeTab === 'pending' ? 'bg-warning bg-opacity-10 border-warning' : 'bg-danger bg-opacity-10 border-danger'}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className={`badge ${activeTab === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                      {activeTab === 'pending' ? 'Chờ duyệt' : 'Bị từ chối'}
                    </span>
                    <small className="text-muted">
                      {new Date(course.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </small>
                  </div>
                </div>
                
                <div className="card-body">
                  <h6 className="card-title">{course.title}</h6>
                  <p className="card-text text-muted small">
                    {course.description?.substring(0, 100)}
                    {course.description?.length > 100 && '...'}
                  </p>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Giáo viên:</span>
                      <span className="fw-medium">{course.teacherId?.name || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Danh mục:</span>
                      <span className="fw-medium">{course.categoryId?.name || 'N/A'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Giá:</span>
                      <span className="fw-bold text-success">
                        {course.price?.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-info btn-sm flex-fill"
                      onClick={() => handleViewDetails(course)}
                    >
                      <i className="fas fa-eye me-1"></i>
                      Xem chi tiết
                    </button>
                    {activeTab === 'pending' && (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleApproveCourse(course.id, true)}
                          disabled={processing}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleApproveCourse(course.id, false)}
                          disabled={processing}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Details Modal */}
      {showModal && selectedCourse && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-book me-2"></i>
                  Chi tiết khóa học
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <h6 className="fw-bold">{selectedCourse.title}</h6>
                    <p className="text-muted">{selectedCourse.description}</p>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="text-primary mb-3">Thông tin cơ bản</h6>
                      <div className="mb-2">
                        <strong>Giáo viên:</strong> {selectedCourse.teacherId?.name || 'N/A'}
                      </div>
                      <div className="mb-2">
                        <strong>Danh mục:</strong> {selectedCourse.categoryId?.name || 'N/A'}
                      </div>
                      <div className="mb-2">
                        <strong>Giá:</strong> 
                        <span className="text-success fw-bold ms-1">
                          {selectedCourse.price?.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                      <div>
                        <strong>Trạng thái:</strong>
                        <span className={`badge ${selectedCourse.status === 'pending' ? 'bg-warning' : 'bg-danger'} ms-1`}>
                          {selectedCourse.status === 'pending' ? 'Chờ duyệt' : 'Bị từ chối'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="text-primary mb-3">Hình ảnh khóa học</h6>
                      {selectedCourse.image ? (
                        <img 
                          src={selectedCourse.image} 
                          alt={selectedCourse.title}
                          className="img-fluid rounded"
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                          <i className="fas fa-image text-muted fa-3x"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
                {selectedCourse.status === 'pending' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => handleApproveCourse(selectedCourse.id, false)}
                      disabled={processing}
                    >
                      <i className="fas fa-times me-1"></i>
                      Từ chối
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => handleApproveCourse(selectedCourse.id, true)}
                      disabled={processing}
                    >
                      <i className="fas fa-check me-1"></i>
                      Duyệt khóa học
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default PendingCourses;
