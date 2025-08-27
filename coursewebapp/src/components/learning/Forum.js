import React from 'react';
import { Link } from 'react-router-dom';

function Forum() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0"><i className="fas fa-comments me-2"></i>Diễn đàn</h3>
          <button className="btn btn-primary"><i className="fas fa-plus me-2"></i>Tạo bài viết</button>
        </div>
        <div className="list-group">
          {[1,2,3].map(id => (
            <Link className="list-group-item list-group-item-action" to={`/learning/forum/${id}`} key={id}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Bài viết #{id}</h5>
                <small>3 phút trước</small>
              </div>
              <p className="mb-1 text-muted">Nội dung tóm tắt bài viết...</p>
              <small>10 bình luận</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forum;


