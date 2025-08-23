import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import SearchCard from '../components/SearchCard';

const HomePage = ({ user, categories, isAdmin }) => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    kw: '',
    fromPrice: '',
    toPrice: '',
    cateId: ''
  });

  useEffect(() => {
    // Mock data - thay thế bằng API call thật
    const mockCourses = [
      {
        id: 1,
        title: 'Lập trình React từ cơ bản đến nâng cao',
        description: 'Học React.js từ những khái niệm cơ bản nhất đến các kỹ thuật nâng cao, xây dựng ứng dụng web hiện đại.',
        price: 999000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        categoryId: { id: 1, name: 'Lập trình' },
        teacherId: { id: 1, name: 'Nguyễn Văn A' }
      },
      {
        id: 2,
        title: 'Thiết kế UI/UX với Figma',
        description: 'Khóa học thiết kế giao diện người dùng chuyên nghiệp với Figma, từ wireframe đến prototype.',
        price: 799000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400',
        categoryId: { id: 2, name: 'Thiết kế' },
        teacherId: { id: 2, name: 'Trần Thị B' }
      },
      {
        id: 3,
        title: 'Digital Marketing toàn diện',
        description: 'Học cách xây dựng chiến lược marketing online hiệu quả, từ SEO đến Social Media Marketing.',
        price: 1299000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        categoryId: { id: 3, name: 'Marketing' },
        teacherId: { id: 3, name: 'Lê Văn C' }
      },
      {
        id: 4,
        title: 'Khởi nghiệp thành công',
        description: 'Hướng dẫn từ A-Z để xây dựng một startup thành công, từ ý tưởng đến thực hiện.',
        price: 1599000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        categoryId: { id: 4, name: 'Kinh doanh' },
        teacherId: { id: 4, name: 'Phạm Thị D' }
      },
      {
        id: 5,
        title: 'Python cho người mới bắt đầu',
        description: 'Học Python từ cơ bản với các dự án thực tế, phù hợp cho người chưa có kinh nghiệm lập trình.',
        price: 0,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400',
        categoryId: { id: 1, name: 'Lập trình' },
        teacherId: { id: 5, name: 'Hoàng Văn E' }
      },
      {
        id: 6,
        title: 'Photoshop chuyên nghiệp',
        description: 'Thành thạo Photoshop với các kỹ thuật chỉnh sửa ảnh và thiết kế đồ họa chuyên nghiệp.',
        price: 899000,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
        categoryId: { id: 2, name: 'Thiết kế' },
        teacherId: { id: 6, name: 'Vũ Thị F' }
      }
    ];

    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter courses based on search params
    let filtered = courses;

    if (searchParams.kw) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchParams.kw.toLowerCase()) ||
        course.description.toLowerCase().includes(searchParams.kw.toLowerCase())
      );
    }

    if (searchParams.fromPrice) {
      filtered = filtered.filter(course => course.price >= parseInt(searchParams.fromPrice));
    }

    if (searchParams.toPrice) {
      filtered = filtered.filter(course => course.price <= parseInt(searchParams.toPrice));
    }

    if (searchParams.cateId) {
      filtered = filtered.filter(course => course.categoryId.id === parseInt(searchParams.cateId));
    }

    setFilteredCourses(filtered);
  }, [searchParams, courses]);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        // Mock delete - replace with actual API call
        setCourses(prev => prev.filter(course => course.id !== courseId));
        alert('Xóa khóa học thành công!');
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa khóa học!');
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Học trực tuyến <br />
                <span className="text-warning">dễ dàng hơn</span>
              </h1>
              <p className="lead mb-4">
                Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. 
                Học mọi lúc, mọi nơi với CourseWeb.
              </p>
              <div className="d-flex gap-3">
                <a href="#courses" className="btn btn-light btn-lg btn-modern">
                  <i className="fas fa-play me-2"></i>Bắt đầu học
                </a>
                <a href="#" className="btn btn-outline-light btn-lg btn-modern">
                  <i className="fas fa-info-circle me-2"></i>Tìm hiểu thêm
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <i 
                className="fas fa-graduation-cap" 
                style={{ fontSize: '15rem', opacity: 0.1 }}
              ></i>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper">
        <div className="container">
          {/* Search Card */}
          <SearchCard onSearch={handleSearch} />

          {/* Admin Actions */}
          {isAdmin && (
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
          )}

          {/* Courses Section */}
          <section id="courses" className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>
                <i className="fas fa-book me-2"></i>Khóa học nổi bật
              </h2>
              <div className="text-muted">
                <i className="fas fa-graduation-cap me-1"></i>
                <span>{filteredCourses.length}</span> khóa học
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="row">
                {filteredCourses.map(course => (
                  <div key={course.id} className="col-lg-4 col-md-6 mb-4">
                    <CourseCard 
                      course={course} 
                      isAdmin={isAdmin}
                      onDelete={handleDeleteCourse}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">Không tìm thấy khóa học nào</h4>
                <p className="text-muted">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn!
                </p>
                {isAdmin && (
                  <Link to="/admin/courses/new" className="btn btn-primary btn-modern">
                    <i className="fas fa-plus me-2"></i>Thêm khóa học đầu tiên
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default HomePage;
