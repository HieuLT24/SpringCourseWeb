import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { learningService } from '../../services/learningService';

function Lecture() {
  const { id } = useParams();
  const courseId = parseInt(id);
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const dashboard = await learningService.getLearningDashboard(courseId);
      if (dashboard.success) {
        setCourse(dashboard.data.course);
      }
      const resLectures = await learningService.getLectures(courseId);
      if (resLectures.success) {
        setLectures(resLectures.data || []);
        if (resLectures.data && resLectures.data.length > 0) {
          setCurrentLecture(resLectures.data[0]);
        }
      }
    } catch (err) {
      console.error('Load lecture error:', err);
      setError('Không thể tải nội dung khóa học');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper py-4">
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
      <div className="content-wrapper py-4">
        <div className="container text-center">
          <div className="alert alert-danger" role="alert">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="ratio ratio-16x9 bg-dark rounded-3 mb-3">
              {currentLecture?.videoUrl && (
                <iframe src={currentLecture.videoUrl} title={currentLecture?.content} allowFullScreen></iframe>
              )}
            </div>
            <h3>{currentLecture?.content || 'Bài giảng'}</h3>
            <p className="text-muted">{course?.title || 'Nội dung bài giảng hiển thị ở đây.'}</p>
          </div>
          <div className="col-lg-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <h5 className="mb-3">Danh sách bài học</h5>
              <ul className="list-group list-group-flush">
                {lectures.map((lec, idx) => (
                  <li 
                    className={`list-group-item ${currentLecture?.id === lec.id ? 'active' : ''}`} 
                    key={lec.id}
                    role="button"
                    onClick={() => setCurrentLecture(lec)}
                  >
                    Bài {idx + 1}: {lec.content}
                  </li>
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


