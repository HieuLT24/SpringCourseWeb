import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';
import { authService } from '../../services/authService';

function Lecture() {
  const { id } = useParams();
  const courseId = parseInt(id);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // State cho thông báo
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [modalData, setModalData] = useState({
    content: '',
    video: null,
    attachment: null
  });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadData();
    checkCurrentUser();
  }, [courseId]);

  // Auto hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
  };

  const checkCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const dashboard = await learningService.getLearningDashboard(courseId);
      if (dashboard.success) {
        setCourse(dashboard.data.course);
      }
      const resLectures = await learningService.getLectures(courseId);
      if (resLectures.success) {
        setLectures(resLectures.data || []);
        if (resLectures.data && resLectures.data.length > 0) {
          setCurrentLecture(resLectures.data[0]);
        }
      }
    } catch (err) {
      console.error('Load lecture error:', err);
      setError('Không thể tải nội dung khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLecture = () => {
    setEditingLecture(null);
    setModalData({
      content: '',
      video: null,
      attachment: null
    });
    setShowModal(true);
  };

  const handleEditLecture = (lecture) => {
    setEditingLecture(lecture);
    setModalData({
      content: lecture.content || '',
      video: null,
      attachment: null
    });
    setShowModal(true);
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
      return;
    }

    try {
      const result = await learningService.deleteLecture(courseId, lectureId);
      if (result.success) {
        showNotification('success', result.message);
        loadData(); // Reload data
      } else {
        showNotification('danger', result.message);
      }
    } catch (error) {
      showNotification('danger', 'Có lỗi xảy ra khi xóa bài giảng');
    }
  };

  const handleModalSubmit = async () => {
    if (!modalData.content.trim()) {
      showNotification('warning', 'Vui lòng nhập tên bài giảng');
      return;
    }

    setModalLoading(true);
    try {
      let result;
      if (editingLecture) {
        // Update lecture
        result = await learningService.updateLecture(courseId, editingLecture.id, modalData);
      } else {
        // Create new lecture
        result = await learningService.createLecture(courseId, modalData);
      }

      if (result.success) {
        showNotification('success', result.message);
        setShowModal(false);
        loadData(); // Reload data
      } else {
        showNotification('danger', result.message);
      }
    } catch (error) {
      showNotification('danger', 'Có lỗi xảy ra khi lưu bài giảng');
    } finally {
      setModalLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setModalData(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };

  const isTeacher = currentUser && currentUser.role === 'TEACHER';

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-4">
            {currentLecture?.videoUrl && (
              <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <div className="ratio ratio-16x9 bg-dark rounded-3 mb-3">
                  <video 
                    src={currentLecture.videoUrl} 
                    controls 
                    className="w-100 h-100"
                    style={{objectFit: 'contain'}}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <h4 className="mb-2">{currentLecture.content}</h4>
                <p className="text-muted">{course?.title}</p>
              </div>
            )}

            {currentLecture?.attachmentUrl && (
              <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <h5 className="mb-3">
                  <i className="fas fa-file-alt me-2 text-primary"></i>
                  Tài liệu đính kèm
                </h5>
                <div className="ratio ratio-16x9 bg-light rounded-3 border">
                  <iframe 
                    src={currentLecture.attachmentUrl} 
                    className="w-100 h-100"
                    title="Tài liệu đính kèm"
                    style={{border: 'none'}}
                  >
                    <p>Trình duyệt của bạn không hỗ trợ iframe. 
                      <a href={currentLecture.attachmentUrl} target="_blank" rel="noopener noreferrer">
                        Click vào đây để xem tài liệu
                      </a>
                    </p>
                  </iframe>
                </div>
                <div className="mt-3">
                  <a 
                    href={currentLecture.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Mở tài liệu trong tab mới
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Cột phải - Danh sách bài học */}
          <div className="col-lg-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Danh sách bài học</h5>
                {isTeacher && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleAddLecture}
                    title="Thêm bài giảng mới"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                )}
              </div>
              <ul className="list-group list-group-flush">
                {lectures.map((lec, idx) => (
                  <li 
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      currentLecture?.id === lec.id ? 'active' : ''
                    }`} 
                    key={lec.id}
                    role="button"
                    onClick={() => setCurrentLecture(lec)}
                  >
                    <div className="flex-grow-1">
                      <strong>Bài {idx + 1}:</strong> {lec.content}
                    </div>
                    {isTeacher && (
                      <div className="btn-group btn-group-sm ms-2">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLecture(lec);
                          }}
                          title="Sửa bài giảng"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLecture(lec.id);
                          }}
                          title="Xóa bài giảng"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </li>
                ))}
                {lectures.length === 0 && (
                  <li className="list-group-item text-center text-muted">
                    <i className="fas fa-inbox fa-2x mb-2"></i>
                    <p className="mb-0">Chưa có bài giảng nào</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa Lecture */}
      {showModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingLecture ? 'Sửa bài giảng' : 'Thêm bài giảng mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Tên bài giảng *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={modalData.content}
                    onChange={(e) => setModalData(prev => ({...prev, content: e.target.value}))}
                    placeholder="Nhập tên bài giảng"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Video bài giảng</label>
                  <div className="drop-zone border rounded p-4 text-center" 
                       onDragOver={(e) => e.preventDefault()}
                       onDrop={(e) => {
                         e.preventDefault();
                         const files = e.dataTransfer.files;
                         if (files.length > 0) {
                           setModalData(prev => ({...prev, video: files[0]}));
                         }
                       }}>
                    <input
                      type="file"
                      className="form-control"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video')}
                      style={{display: 'none'}}
                      id="videoInput"
                    />
                    <label htmlFor="videoInput" className="btn btn-outline-primary mb-2">
                      <i className="fas fa-upload me-2"></i>
                      Chọn video hoặc kéo thả vào đây
                    </label>
                    {modalData.video && (
                      <div className="mt-2">
                        <i className="fas fa-video text-success me-2"></i>
                        {modalData.video.name}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">File đính kèm</label>
                  <div className="drop-zone border rounded p-4 text-center"
                       onDragOver={(e) => e.preventDefault()}
                       onDrop={(e) => {
                         e.preventDefault();
                         const files = e.dataTransfer.files;
                         if (files.length > 0) {
                           setModalData(prev => ({...prev, attachment: files[0]}));
                         }
                       }}>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, 'attachment')}
                      style={{display: 'none'}}
                      id="attachmentInput"
                    />
                    <label htmlFor="attachmentInput" className="btn btn-outline-secondary mb-2">
                      <i className="fas fa-upload me-2"></i>
                      Chọn file hoặc kéo thả vào đây
                    </label>
                    {modalData.attachment && (
                      <div className="mt-2">
                        <i className="fas fa-file text-success me-2"></i>
                        {modalData.attachment.name}
                      </div>
                    )}
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
                  onClick={handleModalSubmit}
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    editingLecture ? 'Cập nhật' : 'Thêm mới'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thông báo đẹp mắt */}
      {notification.show && (
        <div className="position-fixed top-0 end-0 p-3" style={{zIndex: 1050}}>
          <div className={`alert alert-${notification.type} alert-dismissible fade show shadow-lg`} role="alert" style={{minWidth: '300px'}}>
            <div className="d-flex align-items-center">
              {notification.type === 'success' && (
                <i className="fas fa-check-circle me-2 text-success"></i>
              )}
              {notification.type === 'danger' && (
                <i className="fas fa-exclamation-circle me-2 text-danger"></i>
              )}
              {notification.type === 'warning' && (
                <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
              )}
              {notification.type === 'info' && (
                <i className="fas fa-info-circle me-2 text-info"></i>
              )}
              <span className="flex-grow-1">{notification.message}</span>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lecture;


