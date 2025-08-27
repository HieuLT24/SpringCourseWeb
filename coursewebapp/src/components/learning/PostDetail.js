import React from 'react';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h3 className="mb-3">Bài viết #{id}</h3>
        <p className="text-muted">Nội dung bài viết chi tiết hiển thị ở đây.</p>
        <hr />
        <h5 className="mt-4 mb-3">Bình luận</h5>
        <div className="mb-3">
          {[1,2].map(c => (
            <div className="mb-3" key={c}>
              <strong>Người dùng {c}:</strong>
              <p className="mb-0">Bình luận mẫu {c}</p>
            </div>
          ))}
        </div>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Viết bình luận..." />
          <button className="btn btn-primary">Gửi</button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;


