import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueByCourse = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('revenue'); 
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Monthly revenue states
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showMonthlyChart, setShowMonthlyChart] = useState(false); 
  useEffect(() => {
    loadRevenueData();
  }, []);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const result = await adminService.getRevenueByCourse();
      if (result.success) {
        setRevenueData(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Load revenue data error:', err);
      setError('Không thể tải dữ liệu doanh thu');
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyData = async () => {
    try {
      setMonthlyLoading(true);
      const courseId = selectedCourseId ? parseInt(selectedCourseId) : null;
      const result = await adminService.getRevenueByMonth(selectedYear, courseId);
      if (result.success) {
        setMonthlyData(result.data || []);
      } else {
        console.error('Load monthly data error:', result.message);
        setMonthlyData([]);
      }
    } catch (err) {
      console.error('Load monthly data error:', err);
      setMonthlyData([]);
    } finally {
      setMonthlyLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...revenueData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'revenue') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalRevenue = revenueData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);

  // Generate year options (2020 to current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = 2020; year <= currentYear; year++) {
    yearOptions.push(year);
  }

  // Handle monthly chart toggle
  const handleToggleMonthlyChart = () => {
    setShowMonthlyChart(!showMonthlyChart);
    if (!showMonthlyChart) {
      loadMonthlyData();
    }
  };

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const prepareChartData = () => {
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const revenueByMonth = new Array(12).fill(0);

    monthlyData.forEach(item => {
      const monthIndex = parseInt(item.month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        revenueByMonth[monthIndex] = parseFloat(item.revenue) || 0;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: `Doanh thu ${selectedYear}`,
          data: revenueByMonth,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Tính tổng doanh thu theo tháng
  const monthlyTotalRevenue = monthlyData.reduce((sum, item) => sum + (parseFloat(item.revenue) || 0), 0);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Doanh thu theo tháng năm ${selectedYear}`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VNĐ`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('vi-VN') + ' VNĐ';
          }
        }
      },
    },
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
    <div className="revenue-by-course">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-chart-bar me-2 text-success"></i>
          Doanh thu theo khóa học ({revenueData.length} khóa học)
        </h4>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted">
            <strong>Tổng doanh thu: </strong>
            <span className="text-success fw-bold">
              {totalRevenue.toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
          <button 
            className={`btn ${showMonthlyChart ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleToggleMonthlyChart}
          >
            <i className="fas fa-chart-line me-1"></i>
            {showMonthlyChart ? 'Ẩn biểu đồ' : 'Xem biểu đồ'}
          </button>
          <button className="btn btn-outline-primary" onClick={loadRevenueData}>
            <i className="fas fa-sync-alt me-1"></i>
            Làm mới
          </button>
        </div>
      </div>

      {/* Monthly Chart Controls */}
      {showMonthlyChart && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">
              <i className="fas fa-chart-line me-2"></i>
              Thống kê doanh thu theo tháng
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Năm</label>
                <select 
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Khóa học (tùy chọn)</label>
                <select 
                  className="form-select"
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">Tất cả khóa học</option>
                  {revenueData.map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn btn-primary"
                  onClick={loadMonthlyData}
                  disabled={monthlyLoading}
                >
                  {monthlyLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt me-1"></i>
                      Tải dữ liệu
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Chart */}
      {showMonthlyChart && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            {monthlyLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải biểu đồ...</span>
                </div>
              </div>
            ) : monthlyData.length > 0 ? (
              <div style={{ height: '400px' }}>
                <Bar data={prepareChartData()} options={chartOptions} />
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-chart-line text-muted fa-3x mb-3"></i>
                <h5>Chưa tải dữ liệu</h5>
                <p className="text-muted">Vui lòng chọn năm, khóa học và bấm "Tải dữ liệu" để xem biểu đồ</p>
              </div>
            )}
          </div>
        </div>
      )}

      {revenueData.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i className="fas fa-chart-line text-muted fa-3x mb-3"></i>
            <h5>Chưa có dữ liệu doanh thu</h5>
            <p className="text-muted">Chưa có khóa học nào có doanh thu</p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('courseId')}
                    >
                      <div className="d-flex align-items-center">
                        <span>ID</span>
                        <i className={`fas fa-sort ms-2 ${sortBy === 'courseId' ? 'text-primary' : 'text-muted'}`}></i>
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer"
                      onClick={() => handleSort('courseTitle')}
                    >
                      <div className="d-flex align-items-center">
                        <span>Tên khóa học</span>
                        <i className={`fas fa-sort ms-2 ${sortBy === 'courseTitle' ? 'text-primary' : 'text-muted'}`}></i>
                      </div>
                    </th>
                    <th 
                      className="cursor-pointer text-end"
                      onClick={() => handleSort('revenue')}
                    >
                      <div className="d-flex align-items-center justify-content-end">
                        <span>Doanh thu</span>
                        <i className={`fas fa-sort ms-2 ${sortBy === 'revenue' ? 'text-primary' : 'text-muted'}`}></i>
                      </div>
                    </th>
                    <th className="text-end">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, index) => {
                    const revenue = parseFloat(item.revenue) || 0;
                    const percentage = totalRevenue > 0 ? (revenue / totalRevenue * 100) : 0;
                    
                    return (
                      <tr key={item.courseId}>
                        <td>
                          <span className="badge bg-secondary">#{item.courseId}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <i className="fas fa-book text-primary"></i>
                            </div>
                            <div>
                              <div className="fw-medium">{item.courseTitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-end">
                          <span className="fw-bold text-success">
                            {revenue.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end">
                            <div className="progress me-2" style={{ width: '100px', height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {percentage.toFixed(1)}%
                            </small>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {revenueData.length > 0 && (
        <div className="row g-4 mt-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-chart-line text-primary fa-2x mb-2"></i>
                <h6 className="text-muted">Tổng doanh thu</h6>
                <h5 className="text-primary fw-bold">
                  {totalRevenue.toLocaleString('vi-VN')} VNĐ
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-book text-info fa-2x mb-2"></i>
                <h6 className="text-muted">Khóa học có doanh thu</h6>
                <h5 className="text-info fw-bold">{revenueData.length}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-calculator text-success fa-2x mb-2"></i>
                <h6 className="text-muted">Doanh thu trung bình</h6>
                <h5 className="text-success fw-bold">
                  {revenueData.length > 0 ? (totalRevenue / revenueData.length).toLocaleString('vi-VN') : 0} VNĐ
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="fas fa-trophy text-warning fa-2x mb-2"></i>
                <h6 className="text-muted">Khóa học top 1</h6>
                <h6 className="text-warning fw-bold">
                  {sortedData.length > 0 ? sortedData[0].courseTitle.substring(0, 20) + '...' : 'N/A'}
                </h6>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .cursor-pointer:hover {
          background-color: rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default RevenueByCourse;
