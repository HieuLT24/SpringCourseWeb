import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const CourseDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCourse = {
        id: parseInt(id),
        title: 'Lập trình React từ cơ bản đến nâng cao',
        description: 'Khóa học React.js toàn diện giúp bạn từ người mới bắt đầu trở thành developer React chuyên nghiệp. Học cách xây dựng ứng dụng web hiện đại với React, Redux, và các công nghệ liên quan. Khóa học bao gồm các dự án thực tế và hướng dẫn từng bước chi tiết.',
        price: 999000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
        categoryId: { id: 1, name: 'Lập trình' },
        teacherId: { 
          id: 1, 
          name: 'Nguyễn Văn A'
        }
      };
      
      setCourse(mockCourse);
    } catch (error) {
      console.error('Error fetching course detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn đăng ký khóa học này?')) {
      setEnrolling(true);
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('Đăng ký khóa học thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
      } finally {
        setEnrolling(false);
      }
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải thông tin khóa học...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="content-wrapper">
        <div className="container">
          <div className="text-center py-5">
            <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">Không tìm thấy khóa học</h4>
            <Link to="/" className="btn btn-primary btn-modern">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="course-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img 
                src={course.image} 
                alt={course.title} 
                className="course-image-detail"
              />
            </div>
            <div className="col-md-6">
              <h1 className="display-4 font-weight-bold mb-4">
                {course.title}
              </h1>
              <div 
                className="price-tag"
                style={{
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: 'var(--border-radius-lg)',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  margin: '1rem 0',
                  boxShadow: '0 5px 15px rgba(238, 90, 36, 0.4)'
                }}
              >
                {formatPrice(course.price)}
              </div>
              <div className="mt-4">
                {user ? (
                  <button 
                    className="btn enroll-btn"
                    onClick={handleEnrollCourse}
                    disabled={enrolling}
                    style={{
                      background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                      border: 'none',
                      padding: '1rem 3rem',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      transition: 'var(--transition)',
                      boxShadow: '0 5px 15px rgba(46, 213, 115, 0.4)'
                    }}
                  >
                    {enrolling ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang đăng ký...
                      </>
                    ) : (
                      <>
                        🎓 Đăng ký khóa học ngay
                      </>
                    )}
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="btn enroll-btn"
                    style={{
                      background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                      border: 'none',
                      padding: '1rem 3rem',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: 'var(--border-radius-lg)',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'var(--transition)',
                      boxShadow: '0 5px 15px rgba(46, 213, 115, 0.4)'
                    }}
                  >
                    🔐 Đăng nhập để đăng ký
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details */}
      <div className="content-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="course-info" style={{
                background: 'white',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                boxShadow: 'var(--shadow)',
                marginBottom: '2rem'
              }}>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: 'var(--dark-color)'
                }}>
                  Về khóa học này
                </h2>
                <div style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#555',
                  marginBottom: '2rem'
                }}>
                  {course.description}
                </div>
                
                <h3 className="mt-4 mb-3">Bạn sẽ học được gì?</h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  {[
                    'Kiến thức nền tảng vững chắc',
                    'Thực hành với các dự án thực tế',
                    'Hướng dẫn từ giảng viên giàu kinh nghiệm',
                    'Chứng chỉ hoàn thành khóa học',
                    'Hỗ trợ học tập 24/7'
                  ].map((item, index) => (
                    <li key={index} style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      <span style={{
                        color: '#2ed573',
                        fontWeight: 'bold',
                        marginRight: '1rem'
                      }}>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="course-info" style={{
                background: 'white',
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                boxShadow: 'var(--shadow)',
                marginBottom: '2rem'
              }}>
                <h3>Thông tin khóa học</h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  <li style={{
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <strong>Giảng viên:</strong> {course.teacherId.name}
                  </li>
                  <li style={{
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <strong>Danh mục:</strong> {course.categoryId.name}
                  </li>
                  <li style={{
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <strong>Trạng thái:</strong> {course.status}
                  </li>
                  <li style={{
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <strong>Giá:</strong> {formatPrice(course.price)}
                  </li>
                </ul>
                
                <div className="mt-4 text-center">
                  {user ? (
                    <button 
                      className="btn w-100"
                      onClick={handleEnrollCourse}
                      disabled={enrolling}
                      style={{
                        background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                        border: 'none',
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: 'var(--border-radius-lg)',
                        color: 'white',
                        transition: 'var(--transition)',
                        boxShadow: '0 5px 15px rgba(46, 213, 115, 0.4)'
                      }}
                    >
                      {enrolling ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Đang đăng ký...
                        </>
                      ) : (
                        <>
                          🎓 Đăng ký ngay
                        </>
                      )}
                    </button>
                  ) : (
                    <Link 
                      to="/login" 
                      className="btn w-100"
                      style={{
                        background: 'linear-gradient(45deg, #2ed573, #1e90ff)',
                        border: 'none',
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: 'var(--border-radius-lg)',
                        color: 'white',
                        textDecoration: 'none',
                        display: 'inline-block',
                        transition: 'var(--transition)',
                        boxShadow: '0 5px 15px rgba(46, 213, 115, 0.4)'
                      }}
                    >
                      🔐 Đăng nhập để đăng ký
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Back to home */}
          <div className="row mt-4">
            <div className="col-12">
              <Link 
                to="/" 
                style={{
                  color: 'var(--primary-color)',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'var(--transition)'
                }}
              >
                ← Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailPage;
