import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { learningService } from '../../services/learningService';

function Forum() {
  const { id, postId } = useParams();
  const courseId = parseInt(id);
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' hoặc 'detail'
  
  // State cho tạo bài post mới
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    if (!isNaN(courseId)) {
      sessionStorage.setItem('currentCourseId', courseId.toString());
      if (postId) {
        setViewMode('detail');
        loadPostDetail(parseInt(postId));
      } else {
        setViewMode('list');
        loadPosts();
      }
    }
  }, [courseId, postId]);

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

  const loadPostDetail = async (postId) => {
    try {
      setLoading(true);
      const res = await learningService.getPost(courseId, postId);
      if (res.success) {
        setCurrentPost(res.data.post);
        setComments(res.data.comments || []);
      } else {
        setError(res.message || 'Không thể tải bài viết');
      }
    } catch (err) {
      console.error('Load post detail error:', err);
      setError('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!commentContent.trim()) return;
    try {
      const res = await learningService.createComment(courseId, parseInt(postId), { content: commentContent });
      if (res.success) {
        setCommentContent('');
        loadPostDetail(parseInt(postId));
      }
    } catch (err) {
      console.error('Create comment error:', err);
    }
  };

  const backToList = () => {
    setViewMode('list');
    setCurrentPost(null);
    setComments([]);
    setCommentContent('');
    setError('');
    navigate(`/learning/course/${courseId}/forum`);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    if (!showCreateForm) {
      setNewPostTitle('');
      setNewPostContent('');
    }
  };

  const createNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      setCreatingPost(true);
      const res = await learningService.createPost(courseId, {
        title: newPostTitle.trim(),
        content: newPostContent.trim()
      });
      
      if (res.success) {
        setNewPostTitle('');
        setNewPostContent('');
        setShowCreateForm(false);
        await loadPosts(); // Reload danh sách bài viết
        alert('Đăng bài viết thành công!');
      } else {
        alert(res.message || 'Đăng bài viết thất bại');
      }
    } catch (err) {
      console.error('Create post error:', err);
      alert('Đăng bài viết thất bại');
    } finally {
      setCreatingPost(false);
    }
  };

  if (isNaN(courseId)) {
    return (
      <div className="content-wrapper py-5">
        <div className="container text-center">
          <div className="alert alert-danger" role="alert">
            ID khóa học không hợp lệ: {id}
          </div>
        </div>
      </div>
    );
  }

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
          <button className="btn btn-primary" onClick={viewMode === 'list' ? loadPosts : () => loadPostDetail(parseInt(postId))}>
            Thử lại
          </button>
          {viewMode === 'detail' && (
            <button className="btn btn-secondary ms-2" onClick={backToList}>
              Quay lại danh sách
            </button>
          )}
        </div>
      </div>
    );
  }

  // Hiển thị chi tiết bài viết
  if (viewMode === 'detail' && currentPost) {
    return (
      <div className="content-wrapper py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button className="btn btn-outline-secondary" onClick={backToList}>
              <i className="fas fa-arrow-left me-2"></i>Quay lại diễn đàn
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h3 className="mb-0">{currentPost.title || `Bài viết #${postId}`}</h3>
              <small className="text-muted">
                {currentPost.createdAt ? new Date(currentPost.createdAt).toLocaleString('vi-VN') : ''}
              </small>
            </div>
            <p className="text-muted mb-3 fs-5">{currentPost.content}</p>
            <div className="d-flex align-items-center text-muted">
              <i className="fas fa-user me-2"></i>
              <span>{currentPost.user?.name || 'Người dùng'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3 shadow-sm">
            <h5 className="mb-3">
              <i className="fas fa-comments me-2"></i>
              Bình luận ({comments.length})
            </h5>
            
            {comments.length > 0 ? (
              <div className="mb-4">
                {comments.map((comment, idx) => (
                  <div className="border-bottom pb-3 mb-3" key={idx}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                          <i className="fas fa-user"></i>
                        </div>
                        <strong className="text-primary">{comment.user?.name || 'Người dùng'}</strong>
                      </div>
                      <small className="text-muted">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString('vi-VN') : ''}
                      </small>
                    </div>
                    <p className="mb-0 mt-2 ms-4">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 mb-4">
                <i className="fas fa-comment-slash fa-2x text-muted mb-3"></i>
                <p className="text-muted mb-0">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              </div>
            )}

            <div className="border-top pt-3">
              <h6 className="mb-3">Thêm bình luận</h6>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Viết bình luận của bạn..." 
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && submitComment()}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={submitComment}
                  disabled={!commentContent.trim()}
                >
                  <i className="fas fa-paper-plane me-2"></i>Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị danh sách bài viết
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0"><i className="fas fa-comments me-2"></i>Diễn đàn</h3>
          <button 
            className={`btn ${showCreateForm ? 'btn-secondary' : 'btn-primary'}`} 
            onClick={toggleCreateForm}
          >
            <i className={`fas ${showCreateForm ? 'fa-times' : 'fa-plus'} me-2`}></i>
            {showCreateForm ? 'Hủy' : 'Tạo bài viết'}
          </button>
        </div>

        {/* Form tạo bài viết mới */}
        {showCreateForm && (
          <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
            <h5 className="mb-3">Tạo bài viết mới</h5>
            <div className="mb-3">
              <label className="form-label">Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tiêu đề bài viết..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                disabled={creatingPost}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Nhập nội dung bài viết..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                disabled={creatingPost}
              />
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={createNewPost}
                disabled={creatingPost || !newPostTitle.trim() || !newPostContent.trim()}
              >
                {creatingPost ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang đăng...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>Đăng bài viết
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={toggleCreateForm}
                disabled={creatingPost}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div className="list-group">
          {posts.map(p => (
            <Link className="list-group-item list-group-item-action" to={`/learning/course/${courseId}/forum/post/${p.id}`} key={p.id}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{p.title || `Bài viết #${p.id}`}</h5>
                <small>{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : ''}</small>
              </div>
              <p className="mb-1 text-muted">{p.content || '...'}</p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-primary">
                  <i className="fas fa-user me-1"></i>
                  {p.user?.name || 'Người dùng'}
                </small>
                <small className="text-muted">
                  {comments.length > 0 ? `${comments.length} bình luận` : 'Chưa có bình luận'}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forum;


