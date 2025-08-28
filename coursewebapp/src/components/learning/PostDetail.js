import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';

function PostDetail() {
  const { id } = useParams();
  const postId = parseInt(id);
  const [courseId, setCourseId] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Giả sử courseId được lưu trong sessionStorage khi vào forum theo course
    const cid = sessionStorage.getItem('currentCourseId');
    if (cid) setCourseId(parseInt(cid));
    loadPost(parseInt(cid));
  }, [postId]);

  const loadPost = async (cid) => {
    try {
      setLoading(true);
      const res = await learningService.getPost(cid, postId);
      if (res.success) {
        setPost(res.data.post || res.data);
        setComments(res.data.comments || res.data.post?.comments || []);
      } else {
        setError(res.message || 'Không thể tải bài viết');
      }
    } catch (err) {
      console.error('Load post error:', err);
      setError('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!content.trim()) return;
    try {
      const res = await learningService.createComment(courseId, postId, { content });
      if (res.success) {
        setContent('');
        loadPost(courseId);
      }
    } catch (err) {
      console.error('Create comment error:', err);
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
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h3 className="mb-3">{post?.title || `Bài viết #${postId}`}</h3>
        <p className="text-muted">{post?.content}</p>
        <hr />
        <h5 className="mt-4 mb-3">Bình luận</h5>
        <div className="mb-3">
          {comments.map((c, idx) => (
            <div className="mb-3" key={idx}>
              <strong>{c.user?.name || 'Người dùng'}:</strong>
              <p className="mb-0">{c.content}</p>
            </div>
          ))}
        </div>
        <div className="input-group">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Viết bình luận..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="btn btn-primary" onClick={submitComment}>Gửi</button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;


