import React from 'react';

function LearningDashboard() {
  return (
    <div className="content-wrapper py-5">
      <div className="container">
        <h1 className="mb-4"><i className="fas fa-book-reader me-2"></i>Khóa học của tôi</h1>
        <div className="row">
          {[1,2,3].map(id => (
            <div className="col-lg-3 col-md-4 mb-4" key={id}>
              <div className="border rounded-3 overflow-hidden bg-white h-100">
                <img src={`https://picsum.photos/seed/m${id}/800/400`} alt="Course" style={{width:'100%',height:160,objectFit:'cover'}} />
                <div className="p-3">
                  <h6 className="mb-2">Khoá học #{id}</h6>
                  <a href={`/learning/course/${id}`} className="btn btn-primary btn-sm w-100">Vào học</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LearningDashboard;


