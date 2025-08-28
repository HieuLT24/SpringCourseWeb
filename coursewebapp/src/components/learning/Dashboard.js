import React from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';

function DashboardLayout() {
  const { id } = useParams();
  const courseId = parseInt(id);
  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="bg-white rounded-3 shadow-sm p-3">
              <h5 className="mb-3"><i className="fas fa-layer-group me-2"></i>Điều hướng</h5>
              <nav className="nav flex-column">
                <NavLink className={({isActive}) => `nav-link ${isActive?'active fw-semibold':''}`} to={`/learning/course/${courseId}/lectures`}>
                  <i className="fas fa-play-circle me-2"></i>Bài giảng
                </NavLink>
                <NavLink className={({isActive}) => `nav-link ${isActive?'active fw-semibold':''}`} to={`/learning/course/${courseId}/exams`}>
                  <i className="fas fa-file-alt me-2"></i>Bài thi
                </NavLink>
                <NavLink className={({isActive}) => `nav-link ${isActive?'active fw-semibold':''}`} to={`/learning/course/${courseId}/forum`}>
                  <i className="fas fa-comments me-2"></i>Forum & Thông báo
                </NavLink>
              </nav>
            </div>
          </div>
          <div className="col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;


