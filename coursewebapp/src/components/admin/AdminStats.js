import React from 'react';

function AdminStats() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h1 className="mb-4"><i className="fas fa-chart-bar me-2"></i>Thống kê</h1>
        <div className="row g-4">
          {[1,2,3].map(i => (
            <div className="col-md-4" key={i}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Biểu đồ {i}</h5>
                  <div className="bg-light rounded-3" style={{height: 180}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminStats;


