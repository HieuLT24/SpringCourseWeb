import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { enrollmentService } from '../services/enrollmentService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';

function CourseDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const status = sp.get('payment');
    if (status === 'success') {
      setShowSuccess(true);
      setIsEnrolled(true);
      const newUrl = location.pathname;
      navigate(newUrl, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(parseInt(id));
      setCourse(courseData.course);
      setIsEnrolled(courseData.isEnrolled);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    try {
      setEnrolling(true);
      const payRes = await paymentService.processPayment({
        courseId: parseInt(id),
        paymentMethod
      });

      if (payRes.success && payRes.data?.paymentUrl) {
        // Có thể dùng successUrl để cấu hình return URL trên cổng nếu hỗ trợ
        window.location.href = payRes.data.paymentUrl;
        return;
      }

      alert(payRes.message || 'Không tạo được thanh toán');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Có lỗi xảy ra khi đăng ký khóa học!');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <h2>Không tìm thấy khóa học</h2>
          <Link to="/" className="btn btn-primary">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="main-wrapper">
      <section className="py-5" style={{background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-indigo) 100%)', color: 'white'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img 
                src={course.image || `https://picsum.photos/seed/d${id}/800/450`} 
                alt={course.title} 
                className="img-fluid rounded-3 shadow" 
              />
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold mb-3" style={{fontSize: '2rem', lineHeight: 1.2}}>{course.title}</h2>
              <div className="badge bg-danger fs-6 mb-3">
                {course.price?.toLocaleString('vi-VN')} VNĐ
              </div>
              <div className="mt-3">
                {isEnrolled ? (
                  <Link to={`/learning/course/${course.id}`} className="btn btn-success btn-lg me-2">
                    🎓 Tiếp tục học
                  </Link>
                ) : (
                  <>
                    <button 
                      className="btn btn-success btn-lg me-2"
                      onClick={() => setShowPayment(true)}
                    >
                      🎓 Đăng ký khóa học ngay
                    </button>
                    {!isAuthenticated && (
                      <Link to="/login" className="btn btn-outline-light btn-lg">
                        🔐 Đăng nhập để đăng ký
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                <h2 className="mb-3">Về khóa học này</h2>
                <p className="lead">{course.description || 'Mô tả khoá học sẽ hiển thị ở đây.'}</p>
                <h4 className="mt-4 mb-3">Bạn sẽ học được gì?</h4>
                <ul className="list-unstyled">
                  <li className="py-2 border-bottom">Kiến thức nền tảng vững chắc</li>
                  <li className="py-2 border-bottom">Thực hành với các dự án thực tế</li>
                  <li className="py-2 border-bottom">Hướng dẫn từ giảng viên giàu kinh nghiệm</li>
                  <li className="py-2 border-bottom">Chứng chỉ hoàn thành khóa học</li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-white p-4 rounded-3 shadow-sm">
                <h3 className="mb-3">Thông tin khóa học</h3>
                <ul className="list-unstyled">
                  <li className="py-2 border-bottom">
                    <strong>Giảng viên:</strong> {course.instructor || 'Giảng viên A'}
                  </li>
                  <li className="py-2 border-bottom">
                    <strong>Danh mục:</strong> {course.category?.name || 'Lập trình'}
                  </li>
                  <li className="py-2 border-bottom">
                    <strong>Trạng thái:</strong> {course.status || 'Mở'}
                  </li>
                  <li className="py-2 border-bottom">
                    <strong>Giá:</strong> {course.price?.toLocaleString('vi-VN')} VNĐ
                  </li>
                </ul>
                <div className="mt-3 text-center">
                  {isEnrolled ? (
                    <Link to={`/learning/course/${course.id}`} className="btn btn-success w-100 mb-2">
                      🎯 Học khóa học ngay
                    </Link>
                  ) : (
                    <button 
                      className="btn btn-success btn-lg me-2"
                      onClick={() => setShowPayment(true)}
                    >
                      🎯 Đăng ký khóa học ngay
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Link to="/" className="text-decoration-none">← Quay lại trang chủ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Payment Method Modal */}
    {showPayment && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,.5)'}}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="fas fa-credit-card me-2"></i>Chọn phương thức thanh toán</h5>
              <button type="button" className="btn-close" onClick={() => setShowPayment(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="list-group">
                <label className={`list-group-item d-flex align-items-center ${paymentMethod==='VNPAY'?'active':''}`} style={{cursor:'pointer'}}>
                  <input type="radio" name="method" className="form-check-input me-3" checked={paymentMethod==='VNPAY'} onChange={()=>setPaymentMethod('VNPAY')} />
                  <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="VNPay" style={{height:24}} className="me-2" />
                  <span>Thanh toán qua VNPay</span>
                </label>
                <label className={`list-group-item d-flex align-items-center ${paymentMethod==='MOMO'?'active':''}`} style={{cursor:'pointer'}}>
                  <input type="radio" name="method" className="form-check-input me-3" checked={paymentMethod==='MOMO'} onChange={()=>setPaymentMethod('MOMO')} />
                  <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" style={{height:24}} className="me-2" />
                  <span>Thanh toán qua MoMo</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPayment(false)}>Hủy</button>
              <button type="button" className="btn btn-primary" disabled={enrolling} onClick={async ()=>{ await handleEnroll(); }}>
                {enrolling ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Success Modal */}
    {showSuccess && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{background:'rgba(0,0,0,.5)'}}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title text-success"><i className="fas fa-check-circle me-2"></i>Đăng ký thành công</h5>
              <button type="button" className="btn-close" onClick={() => setShowSuccess(false)} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <i className="fas fa-graduation-cap text-success" style={{fontSize: 64}}></i>
              <p className="mt-3 mb-0">Bạn đã đăng ký khóa học thành công. Hãy bắt đầu học ngay!</p>
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <Link to={`/learning/course/${id}`} className="btn btn-success">Bắt đầu học</Link>
              <button className="btn btn-outline-secondary" onClick={() => setShowSuccess(false)}>Đóng</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default CourseDetail;


