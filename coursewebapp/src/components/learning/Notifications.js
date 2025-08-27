import React from 'react';

function Notifications() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h3 className="mb-4"><i className="fas fa-bell me-2"></i>Thông báo</h3>
        <ul className="list-group">
          {[1,2,3].map(i => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={i}>
              Bạn có thông báo số {i}
              <span className="badge bg-primary rounded-pill">mới</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notifications;


