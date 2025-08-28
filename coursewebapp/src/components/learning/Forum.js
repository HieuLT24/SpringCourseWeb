import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';

function Forum() {
  const { id } = useParams();
  const courseId = parseInt(id);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, [courseId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await learningService.getPosts(courseId);
      if (res.success) {
        setPosts(res.data || []);
      } else {
        setError(res.message || 'Không thể tải bài viết');
      }
    } catch (err) {
      console.error('Load forum posts error:', err);
      setError('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="alert alert-danger" role="alert">{error}</div>
          <button className="btn btn-primary" onClick={loadPosts}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0"><i className="fas fa-comments me-2"></i>Diễn đàn</h3>
          <button className="btn btn-primary"><i className="fas fa-plus me-2"></i>Tạo bài viết</button>
        </div>
        <div className="list-group">
          {posts.map(p => (
            <Link className="list-group-item list-group-item-action" to={`/learning/forum/${p.id}`} key={p.id}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{p.title || `Bài viết #${p.id}`}</h5>
                <small>{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}</small>
              </div>
              <p className="mb-1 text-muted">{p.content || '...'}</p>
              <small>{p.commentCount || 0} bình luận</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forum;


