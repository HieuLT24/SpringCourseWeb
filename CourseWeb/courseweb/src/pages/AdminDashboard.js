import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const AdminDashboard = ({ user, categories }) => {
  return (
    <div className="content-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="admin-sidebar" style={{
              background: 'white',
              borderRadius: 'var(--border-radius)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow)',
              marginBottom: '2rem'
            }}>
              <h5 className="mb-3">
                <i className="fas fa-cog me-2"></i>Quản trị
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link 
                    to="/admin" 
                    className="text-decoration-none d-flex align-items-center p-2 rounded"
                    style={{ color: 'var(--dark-color)' }}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/courses" 
                    className="text-decoration-none d-flex align-items-center p-2 rounded"
                    style={{ color: 'var(--dark-color)' }}
                  >
                    <i className="fas fa-book me-2"></i>Quản lý khóa học
                  </Link>
                </li>
                <li className="mb-2">
                  <Link 
                    to="/admin/stats" 
                    className="text-decoration-none d-flex align-items-center p-2 rounded"
                    style={{ color: 'var(--dark-color)' }}
                  >
                    <i className="fas fa-chart-bar me-2"></i>Thống kê
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="col-md-9">
            <Routes>
              <Route path="/" element={<AdminHome />} />
              <Route path="/courses" element={<AdminCourses categories={categories} />} />
              <Route path="/courses/new" element={<AdminCourseForm categories={categories} />} />
              <Route path="/courses/:id/edit" element={<AdminCourseForm categories={categories} isEdit />} />
              <Route path="/stats" element={<AdminStats />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminHome = () => {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--border-radius)',
      padding: '2rem',
      boxShadow: 'var(--shadow)'
    }}>
      <h2 className="mb-4">Dashboard Quản trị</h2>
      
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card border-0" style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: 'white'
          }}>
            <div className="card-body text-center">
              <i className="fas fa-book fa-3x mb-3"></i>
              <h4>120</h4>
              <p>Khóa học</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-0" style={{
            background: 'linear-gradient(135deg, var(--success-color), #20c997)',
            color: 'white'
          }}>
            <div className="card-body text-center">
              <i className="fas fa-users fa-3x mb-3"></i>
              <h4>1,250</h4>
              <p>Học viên</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-0" style={{
            background: 'linear-gradient(135deg, var(--warning-color), #fd7e14)',
            color: 'white'
          }}>
            <div className="card-body text-center">
              <i className="fas fa-dollar-sign fa-3x mb-3"></i>
              <h4>50M</h4>
              <p>Doanh thu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCourses = ({ categories }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--border-radius)',
      padding: '2rem',
      boxShadow: 'var(--shadow)'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý khóa học</h2>
        <Link to="/admin/courses/new" className="btn btn-primary btn-modern">
          <i className="fas fa-plus me-2"></i>Thêm khóa học
        </Link>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Tên khóa học</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Lập trình React từ cơ bản đến nâng cao</td>
              <td>Lập trình</td>
              <td>999,000 VNĐ</td>
              <td><span className="badge bg-success">Hoạt động</span></td>
              <td>
                <div className="btn-group btn-group-sm">
                  <Link to="/admin/courses/1/edit" className="btn btn-warning">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button className="btn btn-danger">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Thiết kế UI/UX với Figma</td>
              <td>Thiết kế</td>
              <td>799,000 VNĐ</td>
              <td><span className="badge bg-success">Hoạt động</span></td>
              <td>
                <div className="btn-group btn-group-sm">
                  <Link to="/admin/courses/2/edit" className="btn btn-warning">
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button className="btn btn-danger">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminCourseForm = ({ categories, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryId: '',
    description: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert(isEdit ? 'Cập nhật khóa học thành công!' : 'Thêm khóa học thành công!');
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--border-radius)',
      padding: '2rem',
      boxShadow: 'var(--shadow)'
    }}>
      <h2 className="mb-4">
        {isEdit ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input 
            type="text" 
            className="form-control" 
            id="title" 
            name="title"
            placeholder="Tên khóa học"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="title">Tên khóa học</label>
        </div>
        
        <div className="form-floating mb-3">
          <input 
            type="number" 
            className="form-control" 
            id="price" 
            name="price"
            placeholder="Giá khóa học"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="price">Giá khóa học</label>
        </div>
        
        <div className="form-floating mb-3">
          <select 
            className="form-select" 
            id="categoryId" 
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <label htmlFor="categoryId">Danh mục</label>
        </div>
        
        <div className="form-floating mb-3">
          <textarea 
            className="form-control" 
            id="description" 
            name="description"
            placeholder="Mô tả khóa học"
            style={{ height: '120px' }}
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <label htmlFor="description">Mô tả khóa học</label>
        </div>
        
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Ảnh khóa học</label>
          <input 
            type="file" 
            className="form-control" 
            id="image" 
            name="image"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>
        
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success btn-modern">
            <i className="fas fa-save me-2"></i>
            {isEdit ? 'Cập nhật' : 'Thêm khóa học'}
          </button>
          <Link to="/admin/courses" className="btn btn-secondary btn-modern">
            <i className="fas fa-times me-2"></i>Hủy
          </Link>
        </div>
      </form>
    </div>
  );
};

const AdminStats = () => {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--border-radius)',
      padding: '2rem',
      boxShadow: 'var(--shadow)'
    }}>
      <h2 className="mb-4">Thống kê</h2>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Doanh thu theo tháng</h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <p className="text-muted">Biểu đồ sẽ hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Khóa học phổ biến</h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                <p className="text-muted">Biểu đồ sẽ hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
