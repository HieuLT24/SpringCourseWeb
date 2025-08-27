import React from 'react';

function AdminDashboard() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h1 className="mb-4"><i className="fas fa-tachometer-alt me-2"></i>Admin Dashboard</h1>
        <div className="row g-4">
          {[{
            icon:'fa-book', title:'Tổng khoá học', value:'128'
          },{
            icon:'fa-users', title:'Người dùng', value:'2,345'
          },{
            icon:'fa-chart-line', title:'Doanh thu tháng', value:'120,000,000 VNĐ'
          },{
            icon:'fa-shopping-cart', title:'Đơn đăng ký', value:'456'
          }].map((c,idx)=> (
            <div className="col-md-3" key={idx}>
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary"><i className={`fas ${c.icon} fa-2x`}></i></div>
                    <div>
                      <div className="text-muted small">{c.title}</div>
                      <div className="fw-bold fs-5">{c.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


