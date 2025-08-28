import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/statsService';

function AdminStats() {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await statsService.getRevenues();
      if (result.success) {
        setRevenues(result.data || []);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setError('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="alert alert-danger" role="alert">
        {error}
        <button onClick={loadStats} className="btn btn-sm btn-outline-danger ms-2">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0"><i className="fas fa-chart-bar me-2"></i>Thống kê doanh thu</h5>
      </div>
      <div className="card-body">
        {revenues.length === 0 ? (
          <p className="text-muted text-center">Chưa có dữ liệu thống kê</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Doanh thu</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {revenues.map((revenue, index) => (
                  <tr key={index}>
                    <td>{revenue.productName || 'Khóa học'}</td>
                    <td>{revenue.revenue?.toLocaleString('vi-VN')} VNĐ</td>
                    <td>{revenue.quantity || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStats;


