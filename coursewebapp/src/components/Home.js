import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';

function Home() {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    kw: '',
    fromPrice: '',
    toPrice: '',
    cateId: ''
  });

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    try {
      const [coursesData, categoriesData] = await Promise.all([
        courseService.getAllCourses({ page }),
        courseService.getCategories()
      ]);
      
      const items = coursesData.courses || [];
      setCourses(items);
      setHasMore(items.length === 12);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        kw: searchParams.kw || undefined,
        fromPrice: searchParams.fromPrice || undefined,
        toPrice: searchParams.toPrice || undefined,
        cateId: searchParams.cateId || undefined
      };
      const coursesData = await courseService.getAllCourses(params);
      const items = coursesData.courses || [];
      setPage(1);
      setCourses(items);
      setHasMore(items.length === 12);
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="main-wrapper">
      {/* Hero Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-indigo) 100%)', color: 'white'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Học trực tuyến <br />
                <span className="text-warning">dễ dàng hơn</span>
              </h1>
              <p className="lead mb-4">Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. Học mọi lúc, mọi nơi với CourseWeb.</p>
              <div className="d-flex gap-3">
                <a href="#courses" className="btn btn-light btn-lg">
                  <i className="fas fa-play me-2"></i>Bắt đầu học
                </a>
                <a href="#" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-info-circle me-2"></i>Tìm hiểu thêm
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <i className="fas fa-graduation-cap" style={{fontSize: '15rem', opacity: 0.1}}></i>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper py-5">
        <div className="container">
          {/* Categories Section */}
          <div className="bg-white p-4 rounded-3 shadow-sm mb-5">
            <h4 className="mb-3">
              <i className="fas fa-th-large me-2"></i>Danh mục nổi bật
            </h4>
            {categories.length === 0 ? (
              <p className="text-muted mb-0">Chưa có danh mục.</p>
            ) : (
              <div className="row g-3">
                {categories.map((cate) => (
                  <div className="col-6 col-md-4 col-lg-3" key={cate.id}>
                    <button
                      type="button"
                      className="w-100 btn btn-outline-primary d-flex align-items-center justify-content-between"
                      onClick={() => {
                        setSearchParams((prev) => ({ ...prev, cateId: String(cate.id) }));
                        handleSearch();
                      }}
                    >
                      <span className="text-start">
                        <i className="fas fa-folder-open me-2"></i>
                        {cate.name}
                      </span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Search Card */}
          <div className="bg-white p-4 rounded-3 shadow-sm mb-5">
            <h4 className="mb-4">
              <i className="fas fa-search me-2"></i>Tìm kiếm khóa học
            </h4>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div className="row">
                <div className="col-lg-3 mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Tìm theo tên khóa học..." 
                    name="kw"
                    value={searchParams.kw}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-2 mb-3">
                  <select 
                    className="form-select" 
                    name="cateId"
                    value={searchParams.cateId}
                    onChange={handleInputChange}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 mb-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Từ giá" 
                    name="fromPrice"
                    value={searchParams.fromPrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-2 mb-3">
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Đến giá" 
                    name="toPrice"
                    value={searchParams.toPrice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-3 mb-3">
                  <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    {loading ? (
                      <span><i className="fas fa-spinner fa-spin me-1"></i>Đang tìm...</span>
                    ) : (
                      <span><i className="fas fa-search me-1"></i>Tìm kiếm</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Courses Section */}
          <section id="courses" className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>
                <i className="fas fa-book me-2"></i>Khóa học nổi bật
              </h2>
              <div className="text-muted">
                <i className="fas fa-graduation-cap me-1"></i>
                <span>{courses.length}</span> khóa học
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải danh sách khóa học...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Không tìm thấy khóa học nào</h5>
                <p className="text-muted">Hãy thử thay đổi tiêu chí tìm kiếm</p>
              </div>
            ) : (
              <div className="row">
                {courses.map((course) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={course.id}>
                    <div className="border rounded-3 overflow-hidden bg-white h-100">
                      <div className="position-relative">
                        <img 
                          src={course.image || `https://picsum.photos/seed/${course.id}/800/400`} 
                          alt={course.name} 
                          style={{width:'100%',height:200,objectFit:'cover',background:'#f8f9fa'}} 
                        />
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-warning text-dark">
                            {course.price ? course.price.toLocaleString('vi-VN') + ' VNĐ' : 'Miễn phí'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="mb-2">
                          <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                            {course.name}
                          </Link>
                        </h5>
                        <p className="text-muted mb-3">
                          {course.description || 'Mô tả khóa học sẽ được hiển thị ở đây.'}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          
                          <div>
                            <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                              <i className="fas fa-eye me-1"></i>Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center gap-2">
            <button className="btn btn-outline-secondary" disabled={page === 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <i className="fas fa-chevron-left me-1"></i>Trang trước
            </button>
            <span className="px-3">Trang {page}</span>
            <button className="btn btn-outline-primary" disabled={!hasMore || loading} onClick={() => setPage((p) => p + 1)}>
              Trang sau<i className="fas fa-chevron-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;



