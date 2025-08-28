import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learningService } from '../../services/learningService';

function LearningList() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await learningService.getMyCourses();
      setMyCourses(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h1 className="mb-4"><i className="fas fa-book-reader me-2"></i>Khóa học của tôi</h1>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : myCourses.length === 0 ? (
          <div className="text-center text-muted py-5">Bạn chưa đăng ký khóa học nào.</div>
        ) : (
          <div className="row">
            {myCourses.map(course => (
              <div className="col-lg-3 col-md-4 mb-4" key={course.id}>
                <div className="border rounded-3 overflow-hidden bg-white h-100">
                  <img src={course.image || `https://picsum.photos/seed/m${course.id}/800/400`} alt={course.title || course.name} style={{width:'100%',height:160,objectFit:'cover'}} />
                  <div className="p-3">
                    <h6 className="mb-2">{course.title || course.name}</h6>
                    <Link to={`/learning/course/${course.id}`} className="btn btn-primary btn-sm w-100">Vào học</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningList;


