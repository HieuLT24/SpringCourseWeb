import React from 'react';

function Lecture() {
  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="ratio ratio-16x9 bg-dark rounded-3 mb-3"></div>
            <h3>Bài giảng 1: Giới thiệu</h3>
            <p className="text-muted">Nội dung bài giảng hiển thị ở đây.</p>
          </div>
          <div className="col-lg-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <h5 className="mb-3">Danh sách bài học</h5>
              <ul className="list-group list-group-flush">
                {[1,2,3,4].map(i => (
                  <li className="list-group-item" key={i}>Bài {i}: Chủ đề {i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lecture;


