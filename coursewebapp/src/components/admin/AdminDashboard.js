import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAdminDashboard();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Load dashboard error:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
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

  const courses = dashboardData?.courses || [];
  const revenues = dashboardData?.revenues || [];
  const totalUsers = dashboardData?.totalUsers || 0;
  const totalCourses = dashboardData?.totalCourses || 0;
  const pendingCourses = dashboardData?.pendingCourses || 0;
  const totalRevenue = dashboardData?.totalRevenue || 0;
  
  const stats = [
    {
      icon: 'fa-users',
      title: 'Tổng người dùng',
      value: totalUsers,
      color: 'primary'
    },
    {
      icon: 'fa-book',
      title: 'Tổng khóa học',
      value: totalCourses,
      color: 'info'
    },
    {
      icon: 'fa-clock',
      title: 'Khóa học chờ duyệt',
      value: pendingCourses,
      color: 'warning'
    },
    {
      icon: 'fa-chart-line',
      title: 'Tổng doanh thu',
      value: totalRevenue.toLocaleString('vi-VN') + ' VNĐ',
      color: 'success'
    }
  ];

  return (
    <div className="admin-dashboard">
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className={`me-3 text-${stat.color}`}>
                    <i className={`fas ${stat.icon} fa-2x`}></i>
                  </div>
                  <div>
                    <div className="text-muted small">{stat.title}</div>
                    <div className="fw-bold fs-5">{stat.value}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        {/* Recent Courses */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-book me-2"></i>
                Khóa học gần đây
              </h5>
            </div>
            <div className="card-body">
              {courses.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Tên khóa học</th>
                        <th>Giáo viên</th>
                        <th>Trạng thái</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.slice(0, 5).map(course => (
                        <tr key={course.id}>
                          <td>{course.title}</td>
                          <td>{course.teacherId?.name || 'N/A'}</td>
                          <td>
                            <span className={`badge ${course.status === 'active' ? 'bg-success' : course.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                              {course.status === 'active' ? 'Đã duyệt' : course.status === 'pending' ? 'Chờ duyệt' : course.status}
                            </span>
                          </td>
                          <td>{course.price?.toLocaleString('vi-VN')} VNĐ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4">Chưa có khóa học nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Doanh thu theo khóa học
              </h5>
            </div>
            <div className="card-body">
              {revenues.length > 0 ? (
                <div className="revenue-list">
                  {revenues.slice(0, 5).map((revenue, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-3">
                      <div className="fw-medium">{revenue[1]}</div>
                      <div className="text-success fw-bold">
                        {revenue[2]?.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">Chưa có dữ liệu doanh thu</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


